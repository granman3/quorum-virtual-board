import React from 'react';
import { AgentProfile } from '../types';
import { PieChart, TrendingUp, Cpu, Scale, User, Activity, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

interface AgentCardProps {
  profile: AgentProfile;
  isActive: boolean;
  vote?: string | null;
  confidence?: number | null;
}

const IconMap: Record<string, React.ElementType> = {
  PieChart,
  TrendingUp,
  Cpu,
  Scale,
  User
};

export const AgentCard: React.FC<AgentCardProps> = ({ profile, isActive, vote, confidence }) => {
  const Icon = IconMap[profile.iconName] || User;
  const colorClass = profile.color.split(' ')[0];

  const getGlowStyle = (): React.CSSProperties => {
    if (!vote) return {};
    const color = vote === 'APPROVE' ? '16, 185, 129' : vote === 'AGAINST' ? '239, 68, 68' : '245, 158, 11';
    const conf = confidence || 5;
    const intensity = conf >= 8 ? 0.5 : conf >= 4 ? 0.3 : 0.15;
    const spread = conf >= 8 ? '12px' : conf >= 4 ? '8px' : '4px';
    return { boxShadow: `0 0 ${spread} rgba(${color}, ${intensity})` };
  };

  const getGlowRingClass = () => {
    if (!vote) return '';
    const conf = confidence || 5;
    const base = vote === 'APPROVE' ? 'ring-emerald-500' : vote === 'AGAINST' ? 'ring-red-500' : 'ring-amber-500';
    const opacity = conf >= 8 ? 'ring-opacity-60' : conf >= 4 ? 'ring-opacity-40' : 'ring-opacity-20';
    const scale = conf >= 8 ? 'scale-105' : '';
    return `ring-2 ${base} ${opacity} ${scale}`;
  };

  const VoteIcon = vote === 'APPROVE' ? ThumbsUp : vote === 'AGAINST' ? ThumbsDown : Minus;

  return (
    <div className={`
      group flex items-center gap-3 p-3 rounded-lg border transition-all duration-300
      ${isActive
        ? 'bg-quorum-surface border-quorum-border shadow-md'
        : 'bg-transparent border-transparent hover:bg-quorum-surface/50 hover:border-quorum-border/50'}
    `}>
      <div className={`
        relative p-2 rounded-md bg-quorum-dark border border-quorum-border group-hover:border-opacity-50 transition-all duration-500
        ${isActive ? 'border-opacity-100' : 'border-opacity-30'}
        ${getGlowRingClass()}
      `} style={getGlowStyle()}>
        <Icon className={`w-5 h-5 ${colorClass}`} />
        {isActive && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorClass.replace('text-', 'bg-')}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colorClass.replace('text-', 'bg-')}`}></span>
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="text-sm font-semibold text-slate-200 truncate">{profile.name.split("'")[0]}</h3>
        </div>
        <p className="text-xs text-quorum-muted uppercase tracking-wider font-medium truncate">{profile.title}</p>
      </div>

      {isActive ? (
        <Activity className="w-4 h-4 text-quorum-muted animate-pulse" />
      ) : vote ? (
        <VoteIcon className={`w-4 h-4 ${
          vote === 'APPROVE' ? 'text-emerald-400' :
          vote === 'AGAINST' ? 'text-red-400' :
          'text-amber-400'
        }`} />
      ) : null}
    </div>
  );
};