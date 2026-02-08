import { GoogleGenAI } from '@google/genai';
import { AgentRole } from '../types.js';
import { SYSTEM_INSTRUCTIONS, AGENTS } from '../constants.js';

// API key management — prompt user if not set
let apiKey = localStorage.getItem('GEMINI_API_KEY') || '';

export const getApiKey = () => apiKey;

export const setApiKey = (key) => {
  apiKey = key;
  localStorage.setItem('GEMINI_API_KEY', key);
};

export const hasApiKey = () => apiKey.length > 0;

const getAI = () => new GoogleGenAI({ apiKey });
const MODEL_NAME = 'gemini-2.5-flash';

// Retry helper with exponential backoff for transient API errors
const withRetry = async (fn, maxRetries = 3) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const status = error?.status || error?.code || error?.httpErrorCode;
      const isRetryable = status === 500 || status === 503 || status === 429;
      if (!isRetryable || attempt === maxRetries) throw error;
      const delay = Math.min(1000 * Math.pow(2, attempt), 8000);
      await new Promise(r => setTimeout(r, delay));
    }
  }
};

// Helper to determine mode based on word count
export const determineMode = (input) => {
  const wordCount = input.trim().split(/\s+/).length;
  return wordCount < 30 ? 'SMS' : 'DASHBOARD';
};

const getFormatInstruction = (mode) => {
  if (mode === 'SMS') {
    return "BRIEF MODE: 2-3 bullet points only. Maximum 50 words total. No headers, no elaboration.";
  }
  return "REPORT MODE: Use short markdown headers and tight bullet points. Maximum 150 words. Lead with your conclusion. No filler, no preambles, no repetition.";
};

// Build conversation history for multi-turn context
const buildConversationHistory = (messages, currentRole) => {
  const historyParts = [];

  for (const msg of messages) {
    if (msg.role === AgentRole.USER) {
      historyParts.push({
        role: 'user',
        parts: [{ text: msg.content }]
      });
    } else {
      // Agent responses become "model" turns in the conversation
      const agentName = msg.role === AgentRole.SYNTHESIS
        ? 'Board Secretary'
        : AGENTS[msg.role]?.name || msg.role;
      historyParts.push({
        role: 'model',
        parts: [{ text: `[${agentName}]: ${msg.content}` }]
      });
    }
  }

  return historyParts;
};

// Parse vote and confidence from advisor response text
export const parseVoteAndConfidence = (text) => {
  const voteMatch = text.match(/\*\*Vote:\s*(APPROVE|AGAINST|ABSTAIN)\*\*/i);
  const confidenceMatch = text.match(/\*\*Confidence:\s*(\d+)\*\*/i);
  return {
    vote: voteMatch ? voteMatch[1].toUpperCase() : null,
    confidence: confidenceMatch ? Math.min(10, Math.max(1, parseInt(confidenceMatch[1], 10))) : null,
  };
};

// Individual Agent Call with streaming
const consultAgentStreaming = async (role, userPrompt, mode, messageHistory, onChunk) => {
  const ai = getAI();
  const systemInstruction = `${SYSTEM_INSTRUCTIONS[role]}\n\n${getFormatInstruction(mode)}`;

  // Build conversation context from history
  const history = buildConversationHistory(messageHistory, role);

  // Add the current user prompt
  const contents = [
    ...history,
    { role: 'user', parts: [{ text: userPrompt }] }
  ];

  // Deduplicate consecutive same-role entries (Gemini requires alternating roles)
  const deduped = [];
  for (const entry of contents) {
    if (deduped.length > 0 && deduped[deduped.length - 1].role === entry.role) {
      // Merge into previous entry
      const prev = deduped[deduped.length - 1];
      prev.parts.push(...entry.parts);
    } else {
      deduped.push({ ...entry, parts: [...entry.parts] });
    }
  }

  try {
    let fullText = '';
    await withRetry(async () => {
      fullText = '';
      const response = await ai.models.generateContentStream({
        model: MODEL_NAME,
        contents: deduped,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
        }
      });

      for await (const chunk of response) {
        const text = chunk.text || '';
        fullText += text;
        onChunk(fullText);
      }
    });

    const { vote, confidence } = parseVoteAndConfidence(fullText);
    return {
      id: crypto.randomUUID(),
      role: role,
      content: fullText || "I have no comment at this time.",
      timestamp: Date.now(),
      mode: mode,
      vote,
      confidence
    };
  } catch (error) {
    console.error(`Error consulting ${role}:`, error);
    return {
      id: crypto.randomUUID(),
      role: role,
      content: `[${AGENTS[role]?.name || role} is unavailable: ${error.message || 'connection error'}]`,
      timestamp: Date.now(),
      mode: mode,
      vote: null,
      confidence: null
    };
  }
};

// Synthesis Call with streaming
const synthesizeBoardStreaming = async (userPrompt, agentResponses, mode, messageHistory, onChunk) => {
  const ai = getAI();
  const agentTexts = agentResponses.map(m => {
    const name = AGENTS[m.role]?.name || m.role;
    return `**${name} (${AGENTS[m.role]?.title || m.role})** says:\n${m.content}`;
  }).join('\n\n---\n\n');

  // Build vote summary for synthesis context
  const voteSummary = agentResponses
    .filter(m => m.vote)
    .map(m => `- ${AGENTS[m.role]?.title || m.role}: ${m.vote} (Confidence: ${m.confidence}/10)`)
    .join('\n');

  const synthesisPrompt = `The CEO asked: "${userPrompt}"

Here is the advice from the board members:

${agentTexts}

Board Votes:
${voteSummary || 'No votes recorded.'}

Synthesize this into a final board resolution. Include a Vote Tally table at the top. Highlight where the board agrees and where they fundamentally clash. Be specific about who disagrees with whom and why.`;

  const history = buildConversationHistory(messageHistory, AgentRole.SYNTHESIS);
  const contents = [
    ...history,
    { role: 'user', parts: [{ text: synthesisPrompt }] }
  ];

  // Deduplicate consecutive same-role entries
  const deduped = [];
  for (const entry of contents) {
    if (deduped.length > 0 && deduped[deduped.length - 1].role === entry.role) {
      const prev = deduped[deduped.length - 1];
      prev.parts.push(...entry.parts);
    } else {
      deduped.push({ ...entry, parts: [...entry.parts] });
    }
  }

  try {
    let fullText = '';
    await withRetry(async () => {
      fullText = '';
      const response = await ai.models.generateContentStream({
        model: MODEL_NAME,
        contents: deduped,
        config: {
          systemInstruction: SYSTEM_INSTRUCTIONS[AgentRole.SYNTHESIS],
          temperature: 0.5,
        }
      });

      for await (const chunk of response) {
        const text = chunk.text || '';
        fullText += text;
        onChunk(fullText);
      }
    });

    return {
      id: crypto.randomUUID(),
      role: AgentRole.SYNTHESIS,
      content: fullText || "Unable to synthesize.",
      timestamp: Date.now(),
      mode: mode
    };
  } catch (error) {
    console.error("Error synthesizing:", error);
    return {
      id: crypto.randomUUID(),
      role: AgentRole.SYNTHESIS,
      content: `Synthesis unavailable: ${error.message || 'connection error'}`,
      timestamp: Date.now(),
      mode: mode
    };
  }
};

export const consultBoard = async (userInput, messageHistory, onStreamingUpdate, onAgentComplete) => {
  const mode = determineMode(userInput);
  const agents = [AgentRole.FINANCE, AgentRole.GROWTH, AgentRole.TECH, AgentRole.LEGAL];

  // Process agents sequentially for dramatic effect (one-by-one deliberation)
  const responses = [];

  for (const role of agents) {
    // Signal which agent is now "thinking"
    onStreamingUpdate(role, '', true);

    const msg = await consultAgentStreaming(
      role, userInput, mode, messageHistory,
      (partialText) => onStreamingUpdate(role, partialText, true)
    );

    responses.push(msg);
    onAgentComplete(msg);
  }

  // Now synthesize
  onStreamingUpdate(AgentRole.SYNTHESIS, '', true);

  const synthesisMsg = await synthesizeBoardStreaming(
    userInput, responses, mode, messageHistory,
    (partialText) => onStreamingUpdate(AgentRole.SYNTHESIS, partialText, true)
  );

  onAgentComplete(synthesisMsg);
};
