import { AgentRole } from '../types.js';
import { SYSTEM_INSTRUCTIONS, AGENTS } from '../constants.js';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MODEL_NAME = 'deepseek-chat';

let apiKey = localStorage.getItem('DEEPSEEK_API_KEY') || '';

export const getApiKey = () => apiKey;

export const setApiKey = (key) => {
  apiKey = key;
  localStorage.setItem('DEEPSEEK_API_KEY', key);
};

export const hasApiKey = () => apiKey.length > 0;

const withRetry = async (fn, maxRetries = 3) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const status = error?.status || error?.code;
      const isRetryable = status === 500 || status === 503 || status === 429;
      if (!isRetryable || attempt === maxRetries) throw error;
      const delay = Math.min(1000 * Math.pow(2, attempt), 8000);
      await new Promise(r => setTimeout(r, delay));
    }
  }
};

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

const buildConversationHistory = (messages, currentRole) => {
  const historyParts = [];

  for (const msg of messages) {
    if (msg.role === AgentRole.USER) {
      historyParts.push({
        role: 'user',
        content: msg.content
      });
    } else {
      const agentName = msg.role === AgentRole.SYNTHESIS
        ? 'Board Secretary'
        : AGENTS[msg.role]?.name || msg.role;
      historyParts.push({
        role: 'assistant',
        content: `[${agentName}]: ${msg.content}`
      });
    }
  }

  return historyParts;
};

export const parseVoteAndConfidence = (text) => {
  const voteMatch = text.match(/\*\*Vote:\s*(APPROVE|AGAINST|ABSTAIN)\*\*/i);
  const confidenceMatch = text.match(/\*\*Confidence:\s*(\d+)\*\*/i);
  return {
    vote: voteMatch ? voteMatch[1].toUpperCase() : null,
    confidence: confidenceMatch ? Math.min(10, Math.max(1, parseInt(confidenceMatch[1], 10))) : null,
  };
};

const callDeepSeekStreaming = async (messages, onChunk) => {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: messages,
      temperature: 0.8,
      stream: true
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim() !== '');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || '';
          fullText += content;
          onChunk(fullText);
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }

  return fullText;
};

const consultAgentStreaming = async (role, userPrompt, mode, messageHistory, onChunk) => {
  const systemInstruction = `${SYSTEM_INSTRUCTIONS[role]}\n\n${getFormatInstruction(mode)}`;
  const history = buildConversationHistory(messageHistory, role);

  const messages = [
    { role: 'system', content: systemInstruction },
    ...history,
    { role: 'user', content: userPrompt }
  ];

  try {
    let fullText = '';
    await withRetry(async () => {
      fullText = await callDeepSeekStreaming(messages, onChunk);
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

const synthesizeBoardStreaming = async (userPrompt, agentResponses, mode, messageHistory, onChunk) => {
  const agentTexts = agentResponses.map(m => {
    const name = AGENTS[m.role]?.name || m.role;
    return `**${name} (${AGENTS[m.role]?.title || m.role})** says:\n${m.content}`;
  }).join('\n\n---\n\n');

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
  
  const messages = [
    { role: 'system', content: SYSTEM_INSTRUCTIONS[AgentRole.SYNTHESIS] },
    ...history,
    { role: 'user', content: synthesisPrompt }
  ];

  try {
    let fullText = '';
    await withRetry(async () => {
      fullText = await callDeepSeekStreaming(messages, onChunk);
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

  const responses = [];

  for (const role of agents) {
    onStreamingUpdate(role, '', true);

    const msg = await consultAgentStreaming(
      role, userInput, mode, messageHistory,
      (partialText) => onStreamingUpdate(role, partialText, true)
    );

    responses.push(msg);
    onAgentComplete(msg);
  }

  onStreamingUpdate(AgentRole.SYNTHESIS, '', true);

  const synthesisMsg = await synthesizeBoardStreaming(
    userInput, responses, mode, messageHistory,
    (partialText) => onStreamingUpdate(AgentRole.SYNTHESIS, partialText, true)
  );

  onAgentComplete(synthesisMsg);
};
