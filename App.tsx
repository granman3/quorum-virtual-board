import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Loader2, LayoutDashboard, History, Settings, Menu, X } from 'lucide-react';
import { AgentRole, Message, BoardState } from './types';
import { AGENTS } from './constants';
import { consultBoard, determineMode, parseVoteAndConfidence } from './services/geminiService';
import { AgentCard } from './components/AgentCard';
import { MessageBubble } from './components/MessageBubble';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [state, setState] = useState<BoardState>({
    messages: [],
    isConsulting: false,
    inputMode: 'SMS'
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [advisorVotes, setAdvisorVotes] = useState<Record<string, { vote: string; confidence: number }>>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  // Auto-resize textarea and detect mode
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + 'px';
    }
    const mode = determineMode(input);
    if (mode !== state.inputMode) {
      setState(prev => ({ ...prev, inputMode: mode }));
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || state.isConsulting) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: AgentRole.USER,
      content: input,
      timestamp: Date.now(),
      mode: state.inputMode
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isConsulting: true
    }));
    
    const currentInput = input;
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';

    setAdvisorVotes({});
    await consultBoard(currentInput, (newMsg) => {
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, newMsg]
      }));
      if (newMsg.vote && newMsg.role !== AgentRole.SYNTHESIS) {
        setAdvisorVotes(prev => ({
          ...prev,
          [newMsg.role]: { vote: newMsg.vote!, confidence: newMsg.confidence! }
        }));
      }
    });

    setState(prev => ({ ...prev, isConsulting: false }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-quorum-dark text-quorum-text font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 w-72 bg-quorum-panel border-r border-quorum-border transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="p-6 border-b border-quorum-border flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-quorum-accent to-blue-600 rounded-md"></div>
              Quorum
            </h1>
            <p className="text-[10px] text-quorum-muted uppercase tracking-[0.2em] mt-1 ml-8">Executive AI</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-quorum-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Board Members List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h2 className="text-xs font-bold text-quorum-muted uppercase tracking-wider mb-4 px-2">Board of Directors</h2>
            <div className="space-y-2">
              {Object.values(AGENTS).map((agent) => (
                <AgentCard
                  key={agent.id}
                  profile={agent}
                  isActive={state.isConsulting}
                  vote={advisorVotes[agent.id]?.vote || null}
                  confidence={advisorVotes[agent.id]?.confidence || null}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold text-quorum-muted uppercase tracking-wider mb-4 px-2">System Status</h2>
            <div className="px-2 py-3 bg-quorum-surface rounded-lg border border-quorum-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Board Status</span>
                <span className={`text-xs font-bold ${state.isConsulting ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {state.isConsulting ? 'DELIBERATING' : 'READY'}
                </span>
              </div>
              <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                {state.isConsulting && (
                  <div className="h-full bg-amber-500 animate-progress w-full origin-left"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-quorum-border bg-quorum-panel">
          <div className="flex items-center gap-3 text-sm text-quorum-muted hover:text-white cursor-pointer transition-colors p-2 rounded-md hover:bg-quorum-surface">
            <Settings className="w-4 h-4" />
            <span>Configuration</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-quorum-muted hover:text-white cursor-pointer transition-colors p-2 rounded-md hover:bg-quorum-surface">
            <History className="w-4 h-4" />
            <span>Session History</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-quorum-dark relative">
        
        {/* Top Bar */}
        <header className="h-16 border-b border-quorum-border bg-quorum-panel/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-quorum-muted hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm text-quorum-muted">
              <LayoutDashboard className="w-4 h-4" />
              <span className="opacity-50">/</span>
              <span className="text-slate-200 font-medium">Executive Session</span>
              <span className="opacity-50">/</span>
              <span className="text-slate-400">Current</span>
            </div>
          </div>
          <div className="text-xs font-mono text-quorum-muted">
            SECURE CONNECTION
          </div>
        </header>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-quorum-border scrollbar-track-transparent">
          <div className="max-w-4xl mx-auto">
            {state.messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center opacity-40">
                <div className="w-20 h-20 bg-quorum-surface rounded-2xl border border-quorum-border flex items-center justify-center mb-6 shadow-2xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-quorum-accent to-blue-600 rounded-md"></div>
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-300 mb-3">Quorum Executive Board</h2>
                <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                  The board is assembled and awaiting your agenda. <br/>
                  Provide a brief for quick insights, or a detailed dossier for comprehensive analysis.
                </p>
              </div>
            )}
            
            {state.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} advisorVotes={advisorVotes} />
            ))}
            
            {state.isConsulting && (
              <div className="flex items-center gap-3 text-quorum-muted animate-pulse py-4 pl-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-mono uppercase tracking-widest">Consulting Board Members...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-quorum-dark border-t border-quorum-border">
          <div className="max-w-4xl mx-auto">
            <div className={`
              relative rounded-xl border transition-all duration-300 bg-quorum-surface
              ${state.inputMode === 'SMS' 
                ? 'border-quorum-border focus-within:border-slate-500' 
                : 'border-quorum-accent/30 shadow-[0_0_20px_rgba(56,189,248,0.05)] focus-within:border-quorum-accent/60'}
            `}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Draft your executive brief..."
                className="w-full bg-transparent text-slate-200 p-4 pr-14 max-h-60 min-h-[60px] resize-none focus:outline-none text-sm md:text-base font-sans placeholder:text-slate-600"
                rows={1}
              />
              
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <button 
                  className="p-2 text-slate-500 hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-700/50"
                  title="Attach Documents"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || state.isConsulting}
                  className={`
                    p-2 rounded-lg transition-all duration-200 flex items-center justify-center
                    ${input.trim() && !state.isConsulting 
                      ? 'bg-quorum-text text-quorum-dark hover:bg-white shadow-lg shadow-white/10' 
                      : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
                  `}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-3 px-1">
              <div className="flex items-center gap-3">
                <div className={`
                  flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-colors
                  ${state.inputMode === 'SMS' 
                    ? 'bg-slate-800 border-slate-700 text-slate-400' 
                    : 'bg-quorum-accent/10 border-quorum-accent/20 text-quorum-accent'}
                `}>
                  {state.inputMode === 'SMS' ? '⚡ Quick Brief' : '📄 Full Report'}
                </div>
              </div>
              <div className="text-[10px] font-mono text-slate-600">
                {input.trim().split(/\s+/).filter(w => w.length > 0).length} WORDS
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;