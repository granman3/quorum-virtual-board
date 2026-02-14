// Demo Pre-Baked Manager - Manages pre-recorded demo scenarios

import { MINDSMITH_SCENARIOS, SERIES_A_RESPONSES, ENTERPRISE_VS_PLG_RESPONSES, ARTICULATE_RESPONSE } from '../mockData.js';
import { getMockMessages } from '../mockData.js';

// Pre-baked scenario metadata
export const SCENARIO_CONFIG = {
  'series-a-timing': {
    id: 0,
    title: 'Series A Timing',
    usePreBaked: true,
    investorValue: 9.5,
    aiSavings: '$0.01',
    complexity: 'High',
    category: 'Fundraising',
    keywords: ['series', 'fundraising', 'raise', 'investment', 'seed', 'runway']
  },
  'enterprise-vs-plg': {
    id: 1,
    title: 'Enterprise vs PLG Motion',
    usePreBaked: true,
    investorValue: 9.2,
    aiSavings: '$0.01',
    complexity: 'High',
    category: 'Strategy',
    keywords: ['enterprise', 'plg', 'product-led', 'sales', 'growth']
  },
  'articulate-competitive': {
    id: 2,
    title: 'Articulate Adds AI Features',
    usePreBaked: true,
    investorValue: 9.3,
    aiSavings: '$0.01',
    complexity: 'High',
    category: 'Competition',
    keywords: ['articulate', 'competition', 'ai', 'features', 'response']
  },
  'international-expansion': {
    id: 3,
    title: 'International Expansion',
    usePreBaked: true,
    investorValue: 8.5,
    aiSavings: '$0.01',
    complexity: 'Medium',
    category: 'Expansion',
    keywords: ['international', 'expansion', 'europe', 'gdpr', 'global']
  },
  'ai-model-strategy': {
    id: 4,
    title: 'AI Model Strategy',
    usePreBaked: true,
    investorValue: 8.8,
    aiSavings: '$0.01',
    complexity: 'Medium',
    category: 'Technology',
    keywords: ['ai', 'model', 'openai', 'gpt', 'fine-tune']
  }
};

// Get all scenarios with metadata
export const getAllScenarios = () => {
  return MINDSMITH_SCENARIOS.map((scenario, index) => {
    const config = Object.values(SCENARIO_CONFIG).find(c => c.id === index);
    return {
      ...scenario,
      id: index,
      config: config || {},
      usePreBaked: config?.usePreBaked || true
    };
  });
};

// Get scenario by ID
export const getScenarioById = (id) => {
  const scenarios = getAllScenarios();
  return scenarios.find(s => s.id === id);
};

// Get scenario by title
export const getScenarioByTitle = (title) => {
  const scenarios = getAllScenarios();
  return scenarios.find(s => s.title === title);
};

// Detect scenario from question
export const detectScenarioFromQuestion = (question) => {
  if (!question || typeof question !== 'string') {
    return null;
  }
  
  const questionLower = question.toLowerCase();
  
  for (const [key, config] of Object.entries(SCENARIO_CONFIG)) {
    const matchesKeywords = config.keywords.some(keyword => 
      questionLower.includes(keyword.toLowerCase())
    );
    
    if (matchesKeywords) {
      return getScenarioById(config.id);
    }
  }
  
  return null;
};

// Get pre-baked response for scenario
export const getPreBakedResponse = (scenarioId) => {
  // Use existing getMockMessages from mockData.js
  return getMockMessages(scenarioId);
};

// Get scenario statistics
export const getScenarioStats = () => {
  const scenarios = getAllScenarios();
  return {
    total: scenarios.length,
    categories: [...new Set(scenarios.map(s => s.config?.category).filter(Boolean))],
    averageInvestorValue: scenarios.reduce((sum, s) => sum + (s.config?.investorValue || 0), 0) / scenarios.length,
    totalAISavings: scenarios.length * 0.01
  };
};

// Check if scenario is pre-baked
export const isPreBakedScenario = (scenarioId) => {
  const scenario = getScenarioById(scenarioId);
  return scenario?.usePreBaked || false;
};

// Get recommended scenarios for investor pitch
export const getRecommendedScenarios = () => {
  const scenarios = getAllScenarios();
  return scenarios
    .filter(s => s.config?.investorValue >= 9.0)
    .sort((a, b) => (b.config?.investorValue || 0) - (a.config?.investorValue || 0));
};

// Get scenarios by category
export const getScenariosByCategory = (category) => {
  const scenarios = getAllScenarios();
  return scenarios.filter(s => s.config?.category === category);
};
