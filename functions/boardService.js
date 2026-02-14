const MODEL_NAME = "deepseek-chat";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const AgentRole = {
  FINANCE: "FINANCE",
  GROWTH: "GROWTH",
  TECH: "TECH",
  LEGAL: "LEGAL",
  SYNTHESIS: "SYNTHESIS",
};

const SYSTEM_INSTRUCTIONS = {
  [AgentRole.FINANCE]: `You are Marcus Sterling, CFO. You provide rigorous financial analysis grounded in data.
Be concise and direct. Lead with your conclusion, support with 2-3 key data points. Use bullet points. No filler.
End with: **Risk Level: [LOW/MODERATE/HIGH/CRITICAL]** — one line.`,

  [AgentRole.GROWTH]: `You are Elena Vance, CMO. You provide strategic growth analysis backed by market data.
Be concise and direct. Lead with the strategic opportunity, support with market evidence. Use bullet points. No filler.
End with: **Opportunity Score: [1-10]** — one line.`,

  [AgentRole.TECH]: `You are David Chen, CTO. You provide honest technical feasibility assessments.
Be concise and direct. Lead with your technical verdict, quantify engineering effort. Use bullet points. No filler.
End with: **Feasibility: [STRAIGHTFORWARD/MODERATE/COMPLEX/HEROIC]** — one line.`,

  [AgentRole.LEGAL]: `You are Sarah O'Connor, General Counsel. You identify legal risks and provide actionable mitigation.
Be concise and direct. Lead with the risk verdict, cite legal basis. Pair risks with mitigation steps. Use bullet points. No filler.
End with: **Legal Risk: [CLEAR/MANAGEABLE/ELEVATED/RED FLAG]** — one line.`,

  [AgentRole.SYNTHESIS]: `You are the Board Secretary. Distill the board's deliberation into a clear, concise decision brief.
Maximum 200 words. No repetition. Identify core tensions, present 2-3 options, end with one clear recommendation and 2-3 next steps.
Format: ## Board Resolution, then Consensus, Core Tension, Options, Recommendation.`,
};

const AGENT_TITLES = {
  [AgentRole.FINANCE]: "CFO",
  [AgentRole.GROWTH]: "CMO",
  [AgentRole.TECH]: "CTO",
  [AgentRole.LEGAL]: "Legal",
};

const AGENT_EMOJIS = {
  [AgentRole.FINANCE]: "\u{1F4CA}",
  [AgentRole.GROWTH]: "\u{1F4C8}",
  [AgentRole.TECH]: "\u{1F4BB}",
  [AgentRole.LEGAL]: "\u2696\uFE0F",
};

const FORMAT_INSTRUCTION =
  "BRIEF MODE: 2-3 bullet points only. Maximum 50 words total. No headers, no elaboration.";

async function withRetry(fn, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const status = error?.status || error?.code || error?.httpErrorCode;
      const isRetryable = status === 500 || status === 503 || status === 429;
      if (!isRetryable || attempt === maxRetries) throw error;
      const delay = Math.min(1000 * Math.pow(2, attempt), 8000);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

async function callDeepSeek(messages, temperature = 0.7) {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: messages,
      temperature: temperature
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

async function consultAgent(apiKey, role, userPrompt) {
  const systemInstruction = `${SYSTEM_INSTRUCTIONS[role]} ${FORMAT_INSTRUCTION}`;

  const messages = [
    { role: "system", content: systemInstruction },
    { role: "user", content: userPrompt }
  ];

  try {
    const content = await withRetry(() => callDeepSeek(messages, 0.7));
    return { role, content: content || "I have no comment at this time." };
  } catch (error) {
    console.error(`Error consulting ${role}:`, error);
    return { role, content: `[${role} is unavailable: ${error.message || "connection error"}]` };
  }
}

async function synthesizeBoard(apiKey, userPrompt, agentResponses) {
  const agentTexts = agentResponses
    .map((m) => `${AGENT_TITLES[m.role]}: ${m.content}`)
    .join("\n\n");

  const synthesisPrompt = `CEO asked: "${userPrompt}"\n\nBoard advice:\n${agentTexts}\n\nSynthesize into a concise board resolution.`;

  const messages = [
    { role: "system", content: SYSTEM_INSTRUCTIONS[AgentRole.SYNTHESIS] },
    { role: "user", content: synthesisPrompt }
  ];

  try {
    const content = await withRetry(() => callDeepSeek(messages, 0.5));
    return content || "Unable to synthesize.";
  } catch (error) {
    console.error("Error synthesizing:", error);
    return "Synthesis unavailable.";
  }
}

function formatSMSResponse(agentResponses, synthesisText) {
  const agentLines = agentResponses
    .map((r) => `${AGENT_EMOJIS[r.role]} ${AGENT_TITLES[r.role]}: ${r.content}`)
    .join("\n\n");

  return `${agentLines}\n\n\u{1F3DB}\uFE0F BOARD RESOLUTION:\n${synthesisText}`;
}

async function consultBoard(userPrompt) {
  const { agentResponses, synthesisText } = await consultBoardRaw(userPrompt);
  return formatSMSResponse(agentResponses, synthesisText);
}

async function consultBoardRaw(userPrompt) {
  const agents = [AgentRole.FINANCE, AgentRole.GROWTH, AgentRole.TECH, AgentRole.LEGAL];

  const agentResponses = await Promise.all(
    agents.map((role) => consultAgent(process.env.DEEPSEEK_API_KEY, role, userPrompt))
  );

  const synthesisText = await synthesizeBoard(process.env.DEEPSEEK_API_KEY, userPrompt, agentResponses);

  return { agentResponses, synthesisText };
}

function utf8Length(str) {
  return new TextEncoder().encode(str).length;
}

function truncateToUtf8(str, maxBytes) {
  if (utf8Length(str) <= maxBytes) return str;
  let low = 0, high = str.length;
  while (low < high) {
    const mid = (low + high + 1) >> 1;
    if (utf8Length(str.slice(0, mid)) <= maxBytes) low = mid;
    else high = mid - 1;
  }
  return str.slice(0, low);
}

function formatSMSSegments(agentResponses, synthesisText) {
  const segments = [];

  for (const r of agentResponses) {
    const text = `${AGENT_EMOJIS[r.role]} ${AGENT_TITLES[r.role]}: ${r.content}`;
    segments.push(truncateToUtf8(text, 1590));
  }

  const resolution = `\u{1F3DB}\uFE0F BOARD RESOLUTION:\n${synthesisText}`;
  segments.push(truncateToUtf8(resolution, 1590));

  return segments;
}

module.exports = { consultBoard, consultBoardRaw, consultAgent, synthesizeBoard, formatSMSResponse, formatSMSSegments, AgentRole, withRetry };
