import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AgentRole } from '../types.js';
import { AGENTS } from '../constants.js';
import { User, Gavel, Zap, FileText, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

export const MessageBubble = ({ message, currentUser, advisorVotes }) => {
  const isUser = message.role === AgentRole.USER;
  const isSynthesis = message.role === AgentRole.SYNTHESIS;

  let agentProfile = null;
  if (!isUser && !isSynthesis) {
    agentProfile = AGENTS[message.role];
  }

  const getBorderColor = () => {
    if (isUser) return 'border-l-slate-500';
    if (isSynthesis) return 'border-l-quorum-gold';
    switch (message.role) {
      case AgentRole.FINANCE: return 'border-l-quorum-finance';
      case AgentRole.GROWTH: return 'border-l-quorum-growth';
      case AgentRole.TECH: return 'border-l-quorum-tech';
      case AgentRole.LEGAL: return 'border-l-quorum-legal';
      default: return 'border-l-slate-500';
    }
  };

  // Streaming cursor
  const streamingCursor = message.isStreaming
    ? React.createElement('span', {
        className: 'inline-block w-2 h-4 bg-quorum-accent ml-1 animate-typing rounded-sm align-text-bottom'
      })
    : null;

  // Meta Header
  let metaHeader;
  if (isUser) {
    metaHeader = React.createElement('div', { className: 'flex items-center gap-2 flex-row-reverse' },
      React.createElement('div', { className: 'flex items-center gap-2' },
        React.createElement('span', { className: 'text-xs font-mono text-quorum-muted' },
          new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        ),
        React.createElement('span', { className: 'text-xs font-bold text-slate-300 uppercase tracking-wider' },
          currentUser?.displayName ? currentUser.displayName.split(' ')[0] : 'CEO'
        ),
        currentUser?.photoURL
          ? React.createElement('img', {
              src: currentUser.photoURL,
              alt: 'You',
              className: 'w-6 h-6 rounded-full border border-slate-600 object-cover'
            })
          : React.createElement('div', { className: 'p-1.5 bg-slate-700 rounded-full' },
              React.createElement(User, { className: 'w-3 h-3 text-white' })
            )
      )
    );
  } else if (isSynthesis) {
    metaHeader = React.createElement('div', { className: 'flex items-center gap-2 w-full' },
      React.createElement('div', { className: 'p-1.5 bg-quorum-gold/20 rounded-full border border-quorum-gold/50' },
        React.createElement(Gavel, { className: 'w-3 h-3 text-quorum-gold' })
      ),
      React.createElement('span', { className: 'text-xs font-bold text-quorum-gold uppercase tracking-widest' }, 'Board Resolution'),
      React.createElement('div', { className: 'h-px flex-1 bg-gradient-to-r from-quorum-gold/30 to-transparent' }),
      React.createElement('span', { className: 'text-xs font-mono text-quorum-muted' },
        new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      )
    );
  } else {
    metaHeader = React.createElement('div', { className: 'flex items-center gap-2' },
      agentProfile?.avatar
        ? React.createElement('img', {
            src: agentProfile.avatar,
            alt: agentProfile.name,
            className: 'w-6 h-6 rounded-full border border-quorum-border object-cover bg-quorum-dark'
          })
        : React.createElement('div', { className: `w-2 h-2 rounded-full ${agentProfile?.color.replace('text-', 'bg-')}` }),
      React.createElement('span', { className: `text-xs font-bold uppercase tracking-wider ${agentProfile?.color}` },
        agentProfile?.title
      ),
      React.createElement('span', { className: 'text-xs text-quorum-muted font-medium' },
        `\u2014 ${agentProfile?.name}`
      ),
      React.createElement('span', { className: 'text-xs font-mono text-quorum-muted opacity-0 group-hover:opacity-50 transition-opacity' },
        new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      )
    );
  }

  // Vote badge + confidence meter for advisor messages
  const voteBadge = !isUser && !isSynthesis && message.vote
    ? React.createElement('div', { className: 'flex items-center gap-3 mt-3 pt-3 border-t border-quorum-border/30' },
        // Vote pill
        React.createElement('div', {
          className: `flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
            message.vote === 'APPROVE' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
            message.vote === 'AGAINST' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
            'bg-amber-500/15 text-amber-400 border border-amber-500/30'
          }`
        },
          React.createElement(
            message.vote === 'APPROVE' ? ThumbsUp : message.vote === 'AGAINST' ? ThumbsDown : Minus,
            { className: 'w-3 h-3' }
          ),
          message.vote
        ),
        // Confidence meter
        message.confidence != null && React.createElement('div', { className: 'flex items-center gap-2 flex-1' },
          React.createElement('span', { className: 'text-[10px] font-mono text-quorum-muted uppercase tracking-wider' }, 'Confidence'),
          React.createElement('div', { className: 'flex-1 max-w-[120px] h-1.5 bg-slate-700 rounded-full overflow-hidden' },
            React.createElement('div', {
              className: `h-full rounded-full transition-all duration-500 ${
                message.confidence >= 8 ? 'bg-emerald-400' :
                message.confidence >= 5 ? 'bg-quorum-accent' :
                'bg-amber-400'
              }`,
              style: { width: `${(message.confidence / 10) * 100}%` }
            })
          ),
          React.createElement('span', {
            className: `text-xs font-bold font-mono ${
              message.confidence >= 8 ? 'text-emerald-400' :
              message.confidence >= 5 ? 'text-quorum-accent' :
              'text-amber-400'
            }`
          }, `${message.confidence}/10`)
        )
      )
    : null;

  // Vote tally for synthesis messages
  const voteTally = isSynthesis && advisorVotes && Object.keys(advisorVotes).length > 0
    ? (() => {
        const votes = Object.entries(advisorVotes);
        const approveCount = votes.filter(([, v]) => v.vote === 'APPROVE').length;
        const againstCount = votes.filter(([, v]) => v.vote === 'AGAINST').length;
        const abstainCount = votes.filter(([, v]) => v.vote === 'ABSTAIN').length;
        const totalConfidence = votes.reduce((sum, [, v]) => sum + (v.confidence || 0), 0);
        const avgConfidence = votes.length > 0 ? (totalConfidence / votes.length).toFixed(1) : '0';
        const totalVoters = approveCount + againstCount;

        return React.createElement('div', {
          className: 'mb-4 p-4 rounded-lg bg-quorum-dark/50 border border-quorum-gold/20'
        },
          // Header
          React.createElement('div', { className: 'flex items-center gap-2 mb-3' },
            React.createElement('span', { className: 'text-[10px] font-bold text-quorum-gold uppercase tracking-widest' }, 'Vote Tally')
          ),
          // Visual bar
          totalVoters > 0 && React.createElement('div', { className: 'flex h-2 rounded-full overflow-hidden mb-3 bg-slate-700' },
            approveCount > 0 && React.createElement('div', {
              className: 'bg-emerald-500 transition-all duration-500',
              style: { width: `${(approveCount / (approveCount + againstCount + abstainCount)) * 100}%` }
            }),
            againstCount > 0 && React.createElement('div', {
              className: 'bg-red-500 transition-all duration-500',
              style: { width: `${(againstCount / (approveCount + againstCount + abstainCount)) * 100}%` }
            }),
            abstainCount > 0 && React.createElement('div', {
              className: 'bg-amber-500 transition-all duration-500',
              style: { width: `${(abstainCount / (approveCount + againstCount + abstainCount)) * 100}%` }
            })
          ),
          // Individual vote chips
          React.createElement('div', { className: 'flex flex-wrap gap-2 mb-3' },
            ...votes.map(([role, v]) => {
              const agent = AGENTS[role];
              return React.createElement('div', {
                key: role,
                className: `flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium border ${
                  v.vote === 'APPROVE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  v.vote === 'AGAINST' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                  'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`
              },
                React.createElement('span', { className: 'font-bold' }, agent?.title || role),
                React.createElement('span', { className: 'opacity-60' }, v.vote),
                React.createElement('span', { className: 'font-mono opacity-75' }, `${v.confidence}/10`)
              );
            })
          ),
          // Summary line
          React.createElement('div', { className: 'text-xs font-bold text-slate-300' },
            `Board Decision: ${approveCount}-${againstCount}${abstainCount > 0 ? `-${abstainCount}` : ''} `,
            React.createElement('span', { className: 'text-emerald-400' }, `APPROVE`),
            '/',
            React.createElement('span', { className: 'text-red-400' }, `AGAINST`),
            abstainCount > 0 ? React.createElement('span', null, '/', React.createElement('span', { className: 'text-amber-400' }, 'ABSTAIN')) : null,
            React.createElement('span', { className: 'text-quorum-muted font-normal ml-2' }, `Avg Confidence: ${avgConfidence}/10`)
          )
        );
      })()
    : null;

  // Mode badge
  const modeBadge = !isUser && !isSynthesis
    ? React.createElement('div', { className: 'absolute top-4 right-4' },
        message.mode === 'SMS'
          ? React.createElement('div', { className: 'flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-quorum-muted opacity-60' },
              React.createElement(Zap, { className: 'w-3 h-3' }), ' Brief'
            )
          : React.createElement('div', { className: 'flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-quorum-muted opacity-60' },
              React.createElement(FileText, { className: 'w-3 h-3' }), ' Report'
            )
      )
    : null;

  return React.createElement('div', {
    className: `group flex flex-col animate-slide-up mb-8 ${isUser ? 'items-end' : 'items-start'}`
  },
    React.createElement('div', {
      className: `flex items-center gap-2 mb-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`
    }, metaHeader),
    React.createElement('div', {
      className: `
        relative max-w-3xl w-full p-6 rounded-r-lg rounded-bl-lg border border-quorum-border/50 shadow-sm
        ${isUser
          ? 'bg-quorum-surface rounded-tl-lg rounded-tr-none border-l-4 border-l-slate-600'
          : `bg-quorum-panel/80 backdrop-blur-sm border-l-4 ${getBorderColor()}`}
        ${isSynthesis ? 'bg-gradient-to-b from-quorum-surface to-quorum-panel border border-quorum-gold/20 shadow-lg shadow-black/20' : ''}
      `
    },
      modeBadge,
      voteTally,
      React.createElement('div', {
        className: `prose prose-invert prose-sm max-w-none ${isSynthesis ? 'prose-headings:text-quorum-gold prose-strong:text-quorum-gold' : ''}`
      },
        React.createElement(ReactMarkdown, null, message.content),
        streamingCursor
      ),
      voteBadge
    )
  );
};
