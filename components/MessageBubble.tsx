import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, AgentRole } from '../types';
import { AGENTS } from '../constants';
import { User, Gavel, Clock, FileText, Zap, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  advisorVotes?: Record<string, { vote: string; confidence: number }>;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, advisorVotes }) => {
  const isUser = message.role === AgentRole.USER;
  const isSynthesis = message.role === AgentRole.SYNTHESIS;
  
  let agentProfile = null;
  if (!isUser && !isSynthesis) {
    agentProfile = AGENTS[message.role as keyof typeof AGENTS];
  }

  // Determine border color based on role
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

  return (
    <div className={`group flex flex-col animate-slide-up mb-8 ${isUser ? 'items-end' : 'items-start'}`}>
      
      {/* Meta Header */}
      <div className={`flex items-center gap-2 mb-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {isUser ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-quorum-muted">{new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">CEO</span>
            <div className="p-1.5 bg-slate-700 rounded-full">
              <User className="w-3 h-3 text-white" />
            </div>
          </div>
        ) : isSynthesis ? (
          <div className="flex items-center gap-2 w-full">
            <div className="p-1.5 bg-quorum-gold/20 rounded-full border border-quorum-gold/50">
              <Gavel className="w-3 h-3 text-quorum-gold" />
            </div>
            <span className="text-xs font-bold text-quorum-gold uppercase tracking-widest">Board Resolution</span>
            <div className="h-px flex-1 bg-gradient-to-r from-quorum-gold/30 to-transparent"></div>
            <span className="text-xs font-mono text-quorum-muted">{new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${agentProfile?.color.replace('text-', 'bg-')}`}></div>
            <span className={`text-xs font-bold uppercase tracking-wider ${agentProfile?.color}`}>
              {agentProfile?.title}
            </span>
            <span className="text-xs text-quorum-muted font-medium">
              &mdash; {agentProfile?.name}
            </span>
            <span className="text-xs font-mono text-quorum-muted opacity-0 group-hover:opacity-50 transition-opacity">
              {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        )}
      </div>

      {/* Content Card */}
      <div className={`
        relative max-w-3xl w-full p-6 rounded-r-lg rounded-bl-lg border border-quorum-border/50 shadow-sm
        ${isUser 
          ? 'bg-quorum-surface rounded-tl-lg rounded-tr-none border-l-4 border-l-slate-600' 
          : `bg-quorum-panel/80 backdrop-blur-sm border-l-4 ${getBorderColor()}`
        }
        ${isSynthesis ? 'bg-gradient-to-b from-quorum-surface to-quorum-panel border border-quorum-gold/20 shadow-lg shadow-black/20' : ''}
      `}>
        
        {/* Mode Badge for Agents */}
        {!isUser && !isSynthesis && (
          <div className="absolute top-4 right-4">
            {message.mode === 'SMS' ? (
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-quorum-muted opacity-60">
                <Zap className="w-3 h-3" /> Brief
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-quorum-muted opacity-60">
                <FileText className="w-3 h-3" /> Report
              </div>
            )}
          </div>
        )}

        {/* Vote tally for synthesis */}
        {isSynthesis && advisorVotes && Object.keys(advisorVotes).length > 0 && (() => {
          const votes = Object.entries(advisorVotes);
          const approveCount = votes.filter(([, v]) => v.vote === 'APPROVE').length;
          const againstCount = votes.filter(([, v]) => v.vote === 'AGAINST').length;
          const abstainCount = votes.filter(([, v]) => v.vote === 'ABSTAIN').length;
          const totalConfidence = votes.reduce((sum, [, v]) => sum + (v.confidence || 0), 0);
          const avgConfidence = votes.length > 0 ? (totalConfidence / votes.length).toFixed(1) : '0';
          return (
            <div className="mb-4 p-4 rounded-lg bg-quorum-dark/50 border border-quorum-gold/20">
              <div className="text-[10px] font-bold text-quorum-gold uppercase tracking-widest mb-3">Vote Tally</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {votes.map(([role, v]) => {
                  const agent = AGENTS[role as keyof typeof AGENTS];
                  return (
                    <div key={role} className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium border ${
                      v.vote === 'APPROVE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                      v.vote === 'AGAINST' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                      'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                      <span className="font-bold">{agent?.title || role}</span>
                      <span className="opacity-60">{v.vote}</span>
                      <span className="font-mono opacity-75">{v.confidence}/10</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-xs font-bold text-slate-300">
                Board Decision: {approveCount}-{againstCount}{abstainCount > 0 ? `-${abstainCount}` : ''}{' '}
                <span className="text-quorum-muted font-normal ml-2">Avg Confidence: {avgConfidence}/10</span>
              </div>
            </div>
          );
        })()}

        <div className={`prose prose-invert prose-sm max-w-none ${isSynthesis ? 'prose-headings:text-quorum-gold prose-strong:text-quorum-gold' : ''}`}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>

        {/* Vote badge for advisor messages */}
        {!isUser && !isSynthesis && message.vote && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-quorum-border/30">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
              message.vote === 'APPROVE' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
              message.vote === 'AGAINST' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
              'bg-amber-500/15 text-amber-400 border border-amber-500/30'
            }`}>
              {message.vote === 'APPROVE' ? <ThumbsUp className="w-3 h-3" /> :
               message.vote === 'AGAINST' ? <ThumbsDown className="w-3 h-3" /> :
               <Minus className="w-3 h-3" />}
              {message.vote}
            </div>
            {message.confidence != null && (
              <div className="flex items-center gap-2 flex-1">
                <span className="text-[10px] font-mono text-quorum-muted uppercase tracking-wider">Confidence</span>
                <div className="flex-1 max-w-[120px] h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${
                    message.confidence >= 8 ? 'bg-emerald-400' : message.confidence >= 5 ? 'bg-quorum-accent' : 'bg-amber-400'
                  }`} style={{ width: `${(message.confidence / 10) * 100}%` }} />
                </div>
                <span className={`text-xs font-bold font-mono ${
                  message.confidence >= 8 ? 'text-emerald-400' : message.confidence >= 5 ? 'text-quorum-accent' : 'text-amber-400'
                }`}>{message.confidence}/10</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};