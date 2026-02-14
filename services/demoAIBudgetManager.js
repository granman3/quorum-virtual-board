// Demo AI Budget Manager - Manages AI usage limits for public demo

export const DEMO_DAILY_LIMIT = 100;
export const COST_PER_CALL = 0.002; // DeepSeek V3 cost per call

// Storage key generator
const getStorageKey = () => {
  const today = new Date().toDateString();
  return `demo_ai_usage_${today}`;
};

// Get current usage data
export const getDemoUsage = () => {
  try {
    const storageKey = getStorageKey();
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { calls: 0, preBaked: 0, template: 0, ai: 0, fallback: 0 };
    
    const usage = JSON.parse(raw);
    return {
      calls: usage.calls || 0,
      preBaked: usage.preBaked || 0,
      template: usage.template || 0,
      ai: usage.ai || 0,
      fallback: usage.fallback || 0,
      lastUpdate: usage.lastUpdate || null
    };
  } catch (e) {
    console.error('Error reading demo usage:', e);
    return { calls: 0, preBaked: 0, template: 0, ai: 0, fallback: 0 };
  }
};

// Track demo usage
export const trackDemoUsage = (type) => {
  try {
    const storageKey = getStorageKey();
    const usage = getDemoUsage();
    
    usage.calls++;
    usage[type] = (usage[type] || 0) + 1;
    usage.lastUpdate = Date.now();
    
    localStorage.setItem(storageKey, JSON.stringify(usage));
    
    return usage;
  } catch (e) {
    console.error('Error tracking demo usage:', e);
    return getDemoUsage();
  }
};

// Check budget status
export const checkDemoBudget = () => {
  const usage = getDemoUsage();
  
  if (usage.calls >= DEMO_DAILY_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      used: usage.calls,
      total: DEMO_DAILY_LIMIT,
      percentage: 100,
      message: 'Demo AI limit reached for today',
      canUseAI: false,
      canUseTemplate: false
    };
  }
  
  const percentage = Math.round((usage.calls / DEMO_DAILY_LIMIT) * 100);
  const remaining = DEMO_DAILY_LIMIT - usage.calls;
  
  return {
    allowed: true,
    remaining,
    used: usage.calls,
    total: DEMO_DAILY_LIMIT,
    percentage,
    message: `${remaining} calls remaining`,
    canUseAI: remaining >= 10, // Need at least 10 calls for full AI session
    canUseTemplate: remaining >= 5, // Need at least 5 for template
    usage
  };
};

// Estimate cost
export const estimateCost = (numCalls) => {
  return numCalls * COST_PER_CALL;
};

// Get current cost
export const getCurrentCost = () => {
  const usage = getDemoUsage();
  return estimateCost(usage.calls);
};

// Reset daily counter (admin function)
export const resetDailyUsage = () => {
  try {
    const storageKey = getStorageKey();
    localStorage.removeItem(storageKey);
    return { success: true, message: 'Daily usage reset' };
  } catch (e) {
    console.error('Error resetting usage:', e);
    return { success: false, message: 'Failed to reset usage' };
  }
};

// Check if can perform action
export const canPerformAction = (actionType) => {
  const budget = checkDemoBudget();
  
  switch (actionType) {
    case 'pre-baked':
      return true; // Always allowed
    case 'template':
      return budget.canUseTemplate;
    case 'ai':
      return budget.canUseAI;
    default:
      return budget.allowed;
  }
};

// Get recommended action based on budget
export const getRecommendedAction = () => {
  const budget = checkDemoBudget();
  
  if (!budget.allowed) {
    return { action: 'pre-baked', reason: 'Daily limit reached' };
  }
  
  if (!budget.canUseTemplate) {
    return { action: 'pre-baked', reason: 'Insufficient budget for templates' };
  }
  
  if (!budget.canUseAI) {
    return { action: 'template', reason: 'Limited budget - using templates' };
  }
  
  return { action: 'ai', reason: 'Full AI available' };
};
