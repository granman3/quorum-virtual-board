import React from 'react';
import { AlertCircle, TrendingUp, Zap, DollarSign } from 'lucide-react';
import { checkDemoBudget, getCurrentCost } from '../services/demoAIBudgetManager.js';

export const DemoAIBudgetIndicator = () => {
  const budget = checkDemoBudget();
  const cost = getCurrentCost();
  const percentage = budget.percentage;
  
  const getStatusColor = () => {
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 70) return 'text-amber-400';
    return 'text-quorum-accent';
  };
  
  const getBarColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-amber-500';
    return 'bg-quorum-accent';
  };
  
  const getStatusMessage = () => {
    if (percentage >= 100) return '⚠️ Limit Reached';
    if (percentage >= 90) return '⚠️ Almost Limit';
    if (percentage >= 70) return '⚡ Moderate Usage';
    return '✅ Good Standing';
  };
  
  return React.createElement('div', {
    className: 'bg-quorum-surface/50 border border-quorum-border/50 rounded-lg p-4 mb-4'
  },
    React.createElement('div', { className: 'flex items-center justify-between mb-3' },
      React.createElement('div', { className: 'flex items-center gap-2' },
        React.createElement(Zap, { className: 'w-4 h-4 text-quorum-accent' }),
        React.createElement('span', { className: 'text-xs font-bold text-quorum-muted uppercase tracking-wider' }, 'Demo AI Budget')
      ),
      React.createElement('span', { className: `text-xs font-bold ${getStatusColor()}` }, getStatusMessage())
    ),
    
    React.createElement('div', { className: 'space-y-2' },
      React.createElement('div', { className: 'flex items-center justify-between text-xs' },
        React.createElement('span', { className: 'text-quorum-muted' }, 'Calls Used'),
        React.createElement('span', { className: 'text-quorum-text font-semibold' }, `${budget.used} / ${budget.total}`)
      ),
      
      React.createElement('div', { className: 'w-full bg-quorum-dark rounded-full h-2 overflow-hidden' },
        React.createElement('div', {
          className: `h-full ${getBarColor()} transition-all duration-500`,
          style: { width: `${percentage}%` }
        })
      ),
      
      React.createElement('div', { className: 'flex items-center justify-between text-xs' },
        React.createElement('div', { className: 'flex items-center gap-1' },
          React.createElement(DollarSign, { className: 'w-3 h-3 text-quorum-muted' }),
          React.createElement('span', { className: 'text-quorum-muted' }, 'Cost'),
          React.createElement('span', { className: 'text-quorum-text font-semibold ml-1' }, `$${cost.toFixed(3)}`)
        ),
        React.createElement('div', { className: 'flex items-center gap-1' },
          React.createElement(TrendingUp, { className: 'w-3 h-3 text-quorum-muted' }),
          React.createElement('span', { className: 'text-quorum-muted' }, 'Remaining'),
          React.createElement('span', { className: 'text-quorum-text font-semibold ml-1' }, budget.remaining)
        )
      )
    ),
    
    budget.canUseAI && React.createElement('div', { className: 'mt-3 pt-3 border-t border-quorum-border/30' },
      React.createElement('div', { className: 'flex items-center gap-2 text-xs' },
        React.createElement('div', { className: 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse' }),
        React.createElement('span', { className: 'text-quorum-muted' }, 'Full AI available for custom questions')
      )
    ),
    
    !budget.canUseAI && budget.canUseTemplate && React.createElement('div', { className: 'mt-3 pt-3 border-t border-quorum-border/30' },
      React.createElement('div', { className: 'flex items-center gap-2 text-xs' },
        React.createElement('div', { className: 'w-2 h-2 rounded-full bg-amber-400 animate-pulse' }),
        React.createElement('span', { className: 'text-quorum-muted' }, 'Templates available for custom questions')
      )
    ),
    
    !budget.canUseTemplate && React.createElement('div', { className: 'mt-3 pt-3 border-t border-quorum-border/30' },
      React.createElement('div', { className: 'flex items-center gap-2 text-xs' },
        React.createElement('div', { className: 'w-2 h-2 rounded-full bg-red-400 animate-pulse' }),
        React.createElement('span', { className: 'text-quorum-muted' }, 'Pre-baked scenarios only')
      )
    )
  );
};

export const DemoBudgetMini = () => {
  const budget = checkDemoBudget();
  
  return React.createElement('div', {
    className: 'flex items-center gap-2 px-2 py-1 bg-quorum-surface/30 rounded text-xs'
  },
    React.createElement(Zap, { className: 'w-3 h-3 text-quorum-accent' }),
    React.createElement('span', { className: 'text-quorum-muted' }, 'AI Budget:'),
    React.createElement('span', { className: 'text-quorum-text font-semibold' }, `${budget.remaining} left`)
  );
};
