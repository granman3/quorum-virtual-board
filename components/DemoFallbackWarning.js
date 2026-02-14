import React from 'react';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { checkDemoBudget } from '../services/demoAIBudgetManager.js';

export const DemoFallbackWarning = () => {
  const budget = checkDemoBudget();
  
  if (budget.percentage < 70) {
    return null;
  }
  
  if (budget.percentage >= 100) {
    return React.createElement('div', {
      className: 'bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4'
    },
      React.createElement('div', { className: 'flex items-start gap-3' },
        React.createElement(AlertTriangle, { className: 'w-5 h-5 text-red-400 flex-shrink-0 mt-0.5' }),
        React.createElement('div', { className: 'flex-1' },
          React.createElement('h3', { className: 'text-sm font-semibold text-red-300 mb-1' }, 'Demo AI Limit Reached'),
          React.createElement('p', { className: 'text-xs text-red-200/80 leading-relaxed' }, 
            'Daily AI consultation limit has been reached. Pre-baked demo scenarios remain available. Try again tomorrow for custom AI questions.'
          ),
          React.createElement('div', { className: 'mt-3 flex items-center gap-4 text-xs text-red-300/70' },
            React.createElement('span', null, '✓ Pre-baked scenarios: Available'),
            React.createElement('span', null, '✗ Custom AI: Unavailable')
          )
        )
      )
    );
  }
  
  if (budget.percentage >= 90) {
    return React.createElement('div', {
      className: 'bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4'
    },
      React.createElement('div', { className: 'flex items-start gap-3' },
        React.createElement(AlertTriangle, { className: 'w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5' }),
        React.createElement('div', { className: 'flex-1' },
          React.createElement('h3', { className: 'text-sm font-semibold text-amber-300 mb-1' }, 'Demo AI Limit Approaching'),
          React.createElement('p', { className: 'text-xs text-amber-200/80 leading-relaxed' }, 
            `Only ${budget.remaining} AI consultations remaining today. Template responses will be used for custom questions once the limit is reached.`
          ),
          React.createElement('div', { className: 'mt-3 flex items-center gap-4 text-xs text-amber-300/70' },
            React.createElement('span', null, '✓ Pre-baked scenarios: Available'),
            React.createElement('span', null, '✓ Templates: Available'),
            React.createElement('span', null, '⚠ Custom AI: Limited')
          )
        )
      )
    );
  }
  
  if (budget.percentage >= 70) {
    return React.createElement('div', {
      className: 'bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4'
    },
      React.createElement('div', { className: 'flex items-start gap-3' },
        React.createElement(Info, { className: 'w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5' }),
        React.createElement('div', { className: 'flex-1' },
          React.createElement('h3', { className: 'text-sm font-semibold text-blue-300 mb-1' }, 'Demo Usage Update'),
          React.createElement('p', { className: 'text-xs text-blue-200/80 leading-relaxed' }, 
            `${budget.remaining} AI consultations remaining today. All demo features remain fully available.`
          ),
          React.createElement('div', { className: 'mt-3 flex items-center gap-4 text-xs text-blue-300/70' },
            React.createElement('span', null, '✓ All features available'),
            React.createElement('span', null, `✓ ${budget.remaining} AI calls left`)
          )
        )
      )
    );
  }
  
  return null;
};

export const DemoStatusBanner = () => {
  const budget = checkDemoBudget();
  
  return React.createElement('div', {
    className: 'bg-gradient-to-r from-quorum-accent/10 to-blue-600/10 border-b border-quorum-accent/30'
  },
    React.createElement('div', {
      className: 'max-w-7xl mx-auto px-6 py-2 flex items-center justify-between'
    },
      React.createElement('div', { className: 'flex items-center gap-3' },
        React.createElement('div', {
          className: 'px-2.5 py-1 bg-quorum-accent/20 border border-quorum-accent/40 rounded-md text-xs font-bold text-quorum-accent uppercase tracking-wider'
        }, 'Demo Mode'),
        React.createElement('span', { className: 'text-xs text-quorum-muted' }, 
          'Pre-recorded board sessions — no sign-up required'
        )
      ),
      React.createElement('div', { className: 'flex items-center gap-4 text-xs' },
        React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement(CheckCircle, { className: 'w-3.5 h-3.5 text-emerald-400' }),
          React.createElement('span', { className: 'text-quorum-muted' }, 
            `${budget.remaining} AI calls remaining today`
          )
        )
      )
    )
  );
};

export const DemoLimitReached = ({ onTryPreBaked }) => {
  return React.createElement('div', {
    className: 'flex flex-col items-center justify-center py-12 text-center'
  },
    React.createElement('div', { className: 'w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mb-6' },
      React.createElement(AlertTriangle, { className: 'w-8 h-8 text-red-400' })
    ),
    React.createElement('h3', { className: 'text-xl font-bold text-red-300 mb-2' }, 'Demo AI Limit Reached'),
    React.createElement('p', { className: 'text-sm text-red-200/80 mb-6 max-w-md leading-relaxed' }, 
      'The daily AI consultation limit has been reached. You can still explore pre-baked demo scenarios or try again tomorrow.'
    ),
    onTryPreBaked && React.createElement('button', {
      onClick: onTryPreBaked,
      className: 'px-6 py-2.5 bg-quorum-accent hover:bg-sky-400 text-quorum-dark font-semibold text-sm rounded-lg transition-all'
    }, 'Explore Pre-Baked Scenarios')
  );
};
