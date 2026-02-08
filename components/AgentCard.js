import React from 'react';
import { PieChart, TrendingUp, Cpu, Scale, User, Activity, Loader2, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

const IconMap = {
  PieChart,
  TrendingUp,
  Cpu,
  Scale,
  User
};

export const AgentCard = ({ profile, isActive, isSpeaking, vote, confidence }) => {
  const Icon = IconMap[profile.iconName] || User;
  const colorClass = profile.color.split(' ')[0];

  // Emotion glow based on vote + confidence
  const getGlowStyle = () => {
    if (!vote) return {};
    const color = vote === 'APPROVE' ? '16, 185, 129' : vote === 'AGAINST' ? '239, 68, 68' : '245, 158, 11';
    const intensity = confidence >= 8 ? 0.5 : confidence >= 4 ? 0.3 : 0.15;
    const spread = confidence >= 8 ? '12px' : confidence >= 4 ? '8px' : '4px';
    return { boxShadow: `0 0 ${spread} rgba(${color}, ${intensity})` };
  };

  const getGlowRingClass = () => {
    if (!vote) return '';
    const base = vote === 'APPROVE' ? 'ring-emerald-500' : vote === 'AGAINST' ? 'ring-red-500' : 'ring-amber-500';
    const opacity = confidence >= 8 ? 'ring-opacity-60' : confidence >= 4 ? 'ring-opacity-40' : 'ring-opacity-20';
    const scale = confidence >= 8 ? 'scale-105' : '';
    return `ring-2 ${base} ${opacity} ${scale}`;
  };

  return React.createElement('div', {
    className: `
      group flex items-center gap-3 p-3 rounded-lg border transition-all duration-300
      ${isSpeaking
        ? 'bg-quorum-surface border-quorum-border shadow-md ring-1 ring-quorum-accent/20'
        : isActive
          ? 'bg-quorum-surface/50 border-quorum-border/50'
          : 'bg-transparent border-transparent hover:bg-quorum-surface/50 hover:border-quorum-border/50'}
    `
  },
    // Avatar with fallback to icon
    React.createElement('div', {
      className: `
        relative w-10 h-10 rounded-lg overflow-hidden border border-quorum-border transition-all duration-500 flex-shrink-0
        ${isSpeaking ? 'border-opacity-100 ring-1 ring-quorum-accent/30' : isActive ? 'border-opacity-50' : 'border-opacity-30'}
        ${getGlowRingClass()}
      `,
      style: getGlowStyle()
    },
      profile.avatar
        ? React.createElement('img', {
            src: profile.avatar,
            alt: profile.name,
            className: 'w-full h-full object-cover bg-quorum-dark'
          })
        : React.createElement('div', {
            className: 'w-full h-full flex items-center justify-center bg-quorum-dark'
          },
            React.createElement(Icon, { className: `w-5 h-5 ${colorClass}` })
          ),
      (isActive || isSpeaking) && React.createElement('span', {
        className: 'absolute -top-1 -right-1 flex h-2.5 w-2.5'
      },
        React.createElement('span', {
          className: `animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorClass.replace('text-', 'bg-')}`
        }),
        React.createElement('span', {
          className: `relative inline-flex rounded-full h-2.5 w-2.5 ${colorClass.replace('text-', 'bg-')}`
        })
      )
    ),
    React.createElement('div', { className: 'flex-1 min-w-0' },
      React.createElement('div', { className: 'flex justify-between items-baseline' },
        React.createElement('h3', {
          className: 'text-sm font-semibold text-slate-200 truncate'
        }, profile.name.split("'")[0].trim())
      ),
      React.createElement('p', {
        className: 'text-xs text-quorum-muted uppercase tracking-wider font-medium truncate'
      }, profile.title)
    ),
    isSpeaking
      ? React.createElement(Loader2, { className: 'w-4 h-4 text-quorum-accent animate-spin' })
      : isActive
        ? React.createElement(Activity, { className: 'w-4 h-4 text-quorum-muted animate-pulse' })
        : vote
          ? React.createElement(
              vote === 'APPROVE' ? ThumbsUp : vote === 'AGAINST' ? ThumbsDown : Minus,
              { className: `w-4 h-4 ${
                vote === 'APPROVE' ? 'text-emerald-400' :
                vote === 'AGAINST' ? 'text-red-400' :
                'text-amber-400'
              }` }
            )
          : null
  );
};
