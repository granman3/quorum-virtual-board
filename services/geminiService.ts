import { GoogleGenAI } from '@google/genai';
import { AgentRole, Message } from '../types';
import { SYSTEM_INSTRUCTIONS, AGENTS } from '../constants';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey, vertexai: true });
const MODEL_NAME = 'gemini-2.5-flash';

// Parse vote and confidence from advisor response text
export const parseVoteAndConfidence = (text: string): { vote: string | null; confidence: number | null } => {
  const voteMatch = text.match(/\*\*Vote:\s*(APPROVE|AGAINST|ABSTAIN)\*\*/i);
  const confidenceMatch = text.match(/\*\*Confidence:\s*(\d+)\*\*/i);
  return {
    vote: voteMatch ? voteMatch[1].toUpperCase() : null,
    confidence: confidenceMatch ? Math.min(10, Math.max(1, parseInt(confidenceMatch[1], 10))) : null,
  };
};

// Helper to determine mode based on word count
export const determineMode = (input: string): 'SMS' | 'DASHBOARD' => {
  const wordCount = input.trim().split(/\s+/).length;
  return wordCount < 30 ? 'SMS' : 'DASHBOARD';
};

const getFormatInstruction = (mode: 'SMS' | 'DASHBOARD') => {
  if (mode === 'SMS') {
    return "The CEO is in a rush. Provide your advice as a set of 2-3 extremely concise, punchy bullet points. No fluff.";
  }
  return "The CEO needs a deep dive. Provide a structured report with headers (Markdown). Be detailed, cite specific risks/opportunities within your domain.";
};

// Individual Agent Call
const consultAgent = async (
  role: Exclude<AgentRole, AgentRole.USER | AgentRole.SYNTHESIS>,
  userPrompt: string,
  mode: 'SMS' | 'DASHBOARD'
): Promise<Message> => {
  const systemInstruction = `${SYSTEM_INSTRUCTIONS[role]} ${getFormatInstruction(mode)}`;
  
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        role: 'user',
        parts: [{ text: userPrompt }]
      },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Distinct personalities need some creativity
      }
    });

    const content = response.text || "I have no comment at this time.";
    const { vote, confidence } = parseVoteAndConfidence(content);
    return {
      id: crypto.randomUUID(),
      role: role,
      content,
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
      content: `[${role} is unavailable due to connection issues]`,
      timestamp: Date.now(),
      mode: mode,
      vote: null,
      confidence: null
    };
  }
};

// Synthesis Call
const synthesizeBoard = async (
  userPrompt: string,
  agentResponses: Message[],
  mode: 'SMS' | 'DASHBOARD'
): Promise<Message> => {
  const agentTexts = agentResponses.map(m => `${m.role} says:\n${m.content}`).join('\n\n---\n\n');

  const voteSummary = agentResponses
    .filter(m => m.vote)
    .map(m => `- ${m.role}: ${m.vote} (Confidence: ${m.confidence}/10)`)
    .join('\n');

  const synthesisPrompt = `
    The CEO asked: "${userPrompt}"

    Here is the advice from the board:
    ${agentTexts}

    Board Votes:
    ${voteSummary || 'No votes recorded.'}

    Synthesize this into a final decision framework. Include a Vote Tally table at the top. Highlight the major conflict between the agents.
    ${getFormatInstruction(mode)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        role: 'user',
        parts: [{ text: synthesisPrompt }]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS[AgentRole.SYNTHESIS],
        temperature: 0.5,
      }
    });

    return {
      id: crypto.randomUUID(),
      role: AgentRole.SYNTHESIS,
      content: response.text || "Unable to synthesize.",
      timestamp: Date.now(),
      mode: mode
    };
  } catch (error) {
    console.error("Error synthesizing:", error);
    return {
      id: crypto.randomUUID(),
      role: AgentRole.SYNTHESIS,
      content: "Synthesis unavailable.",
      timestamp: Date.now(),
      mode: mode
    };
  }
};

export const consultBoard = async (
  userInput: string,
  onAgentResponse: (msg: Message) => void
): Promise<void> => {
  const mode = determineMode(userInput);
  
  // 1. Define the agents to consult
  const agents = [AgentRole.FINANCE, AgentRole.GROWTH, AgentRole.TECH, AgentRole.LEGAL] as const;

  // 2. Launch parallel requests
  const agentPromises = agents.map(role => consultAgent(role, userInput, mode).then(msg => {
    onAgentResponse(msg);
    return msg;
  }));

  // 3. Wait for all agents
  const responses = await Promise.all(agentPromises);

  // 4. Synthesize
  const synthesisMsg = await synthesizeBoard(userInput, responses, mode);
  onAgentResponse(synthesisMsg);
};
