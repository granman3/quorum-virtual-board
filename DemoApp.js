import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Menu, X, LayoutDashboard, Loader2, SkipForward, RotateCcw } from 'lucide-react';
import { AgentRole } from './types.js';
import { AGENTS } from './constants.js';
import { MINDSMITH_SCENARIOS, getMockMessages } from './mockData.js';
import { AgentCard } from './components/AgentCard.js';
import { MessageBubble } from './components/MessageBubble.js';

const MOCK_USER = { displayName: 'CEO', photoURL: null };

const CHARS_PER_TICK = 15;
const TICK_MS = 20;

const DemoApp = () => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [advisorVotes, setAdvisorVotes] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [speakingAgent, setSpeakingAgent] = useState(null);
  const [streamingText, setStreamingText] = useState('');
  const [isRevealing, setIsRevealing] = useState(false);

  const intervalRef = useRef(null);
  const pendingMessagesRef = useRef([]);
  const currentMsgIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, scrollToBottom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const clearTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const revealNextMessage = useCallback(() => {
    const idx = currentMsgIndexRef.current + 1;
    const pending = pendingMessagesRef.current;

    if (idx >= pending.length) {
      // All messages revealed
      setIsRevealing(false);
      setSpeakingAgent(null);
      clearTimers();
      return;
    }

    currentMsgIndexRef.current = idx;
    charIndexRef.current = 0;
    const msg = pending[idx];
    setSpeakingAgent(msg.role);
    setStreamingText('');

    // Start typing interval
    clearTimers();
    intervalRef.current = setInterval(() => {
      charIndexRef.current += CHARS_PER_TICK;
      const content = msg.content;
      if (charIndexRef.current >= content.length) {
        // Done with this message — commit and move to next
        clearTimers();
        // Commit
        setMessages(prev => [...prev, msg]);
        setStreamingText('');
        setSpeakingAgent(null);

        if (msg.vote && msg.role !== AgentRole.SYNTHESIS) {
          setAdvisorVotes(prev => ({
            ...prev,
            [msg.role]: { vote: msg.vote, confidence: msg.confidence }
          }));
        }

        // Brief pause before next advisor
        const nextIdx = currentMsgIndexRef.current + 1;
        if (nextIdx < pending.length) {
          intervalRef.current = setTimeout(() => {
            revealNextMessage();
          }, 400);
        } else {
          setIsRevealing(false);
        }
      } else {
        setStreamingText(content.substring(0, charIndexRef.current));
      }
    }, TICK_MS);
  }, []);

  const handleScenarioClick = (index) => {
    // Reset state
    clearTimers();
    setMessages([]);
    setAdvisorVotes({});
    setSpeakingAgent(null);
    setStreamingText('');
    setSelectedScenario(index);
    setIsRevealing(true);

    const allMessages = getMockMessages(index);
    pendingMessagesRef.current = allMessages;

    // Show user message immediately
    currentMsgIndexRef.current = 0;
    setMessages([allMessages[0]]);

    // Start revealing advisor responses after a short delay
    setTimeout(() => {
      revealNextMessage();
    }, 600);
  };

  const handleSkip = () => {
    clearTimers();
    const pending = pendingMessagesRef.current;
    // Commit all remaining messages
    const votes = {};
    const allMsgs = pending.map(msg => {
      if (msg.vote && msg.role !== AgentRole.SYNTHESIS) {
        votes[msg.role] = { vote: msg.vote, confidence: msg.confidence };
      }
      return msg;
    });

    setMessages(allMsgs);
    setAdvisorVotes(votes);
    setStreamingText('');
    setSpeakingAgent(null);
    setIsRevealing(false);
  };

  const handleTryAnother = () => {
    clearTimers();
    setSelectedScenario(null);
    setMessages([]);
    setAdvisorVotes({});
    setSpeakingAgent(null);
    setStreamingText('');
    setIsRevealing(false);
    pendingMessagesRef.current = [];
    currentMsgIndexRef.current = 0;
    charIndexRef.current = 0;
  };

  // Build streaming bubble for the currently typing advisor
  const streamingBubbles = speakingAgent && streamingText
    ? [{
        id: `streaming-${speakingAgent}`,
        role: speakingAgent,
        content: streamingText,
        timestamp: Date.now(),
        mode: 'DASHBOARD',
        isStreaming: true
      }]
    : [];

  // Scenario selection screen
  if (selectedScenario === null) {
    return React.createElement('div', {
      className: 'min-h-screen bg-quorum-dark text-quorum-text font-sans'
    },
      // Demo mode banner
      React.createElement('div', {
        className: 'bg-gradient-to-r from-quorum-accent/20 to-blue-600/20 border-b border-quorum-accent/30'
      },
        React.createElement('div', {
          className: 'max-w-5xl mx-auto px-6 py-3 flex items-center justify-between'
        },
          React.createElement('div', { className: 'flex items-center gap-3' },
            React.createElement('div', {
              className: 'px-2.5 py-1 bg-quorum-accent/20 border border-quorum-accent/40 rounded-md text-xs font-bold text-quorum-accent uppercase tracking-wider'
            }, 'Demo Mode'),
            React.createElement('span', { className: 'text-sm text-quorum-muted' },
              'Pre-recorded board sessions \u2014 no sign-up required'
            )
          ),
        )
      ),

      // Main content
      React.createElement('div', {
        className: 'flex flex-col items-center justify-center min-h-[calc(100vh-52px)] px-6 py-12'
      },
        // Logo & title
        React.createElement('div', { className: 'text-center mb-12' },
          React.createElement('div', {
            className: 'w-16 h-16 bg-quorum-surface rounded-2xl border border-quorum-border flex items-center justify-center mb-6 shadow-2xl mx-auto'
          },
            React.createElement('div', {
              className: 'w-9 h-9 bg-gradient-to-br from-quorum-accent to-blue-600 rounded-md flex items-center justify-center'
            },
              React.createElement('span', { className: 'text-lg font-serif font-bold text-white' }, 'Q')
            )
          ),
          React.createElement('h1', { className: 'text-3xl md:text-4xl font-serif font-bold text-white mb-3' },
            'Quorum Interactive Demo'
          ),
          React.createElement('p', { className: 'text-quorum-muted text-base max-w-lg mx-auto leading-relaxed' },
            'Choose a scenario to see the board deliberate. Each scenario features real advisor responses with votes, confidence scores, and a synthesized resolution.'
          )
        ),

        // Scenario cards
        React.createElement('div', {
          className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full'
        },
          ...MINDSMITH_SCENARIOS.map((scenario, i) =>
            React.createElement('button', {
              key: i,
              onClick: () => handleScenarioClick(i),
              className: 'text-left p-5 rounded-xl border border-quorum-border/50 bg-quorum-panel hover:bg-quorum-surface hover:border-quorum-border transition-all group cursor-pointer'
            },
              React.createElement('div', { className: 'text-xs font-bold text-quorum-accent uppercase tracking-wider mb-2' },
                scenario.title
              ),
              React.createElement('p', { className: 'text-sm text-quorum-muted group-hover:text-slate-300 transition-colors leading-relaxed line-clamp-3' },
                scenario.question.substring(0, 120) + (scenario.question.length > 120 ? '...' : '')
              )
            )
          )
        ),

      )
    );
  }

  // Active demo session (sidebar + chat layout)
  return React.createElement('div', {
    className: 'flex h-screen bg-quorum-dark text-quorum-text font-sans overflow-hidden'
  },
    // Mobile Sidebar Overlay
    sidebarOpen && React.createElement('div', {
      className: 'fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm',
      onClick: () => setSidebarOpen(false)
    }),

    // Sidebar
    React.createElement('aside', {
      className: `fixed md:static inset-y-0 left-0 z-30 w-72 bg-quorum-panel border-r border-quorum-border transform transition-transform duration-300 ease-in-out flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`
    },
      // Brand
      React.createElement('div', { className: 'p-6 border-b border-quorum-border flex items-center justify-between' },
        React.createElement('div', null,
          React.createElement('h1', {
            className: 'text-xl font-serif font-bold text-white tracking-tight flex items-center gap-2'
          },
            React.createElement('div', {
              className: 'w-6 h-6 bg-gradient-to-br from-quorum-accent to-blue-600 rounded-md flex items-center justify-center'
            },
              React.createElement('span', { className: 'text-xs font-serif font-bold text-white' }, 'Q')
            ),
            'Quorum'
          ),
          React.createElement('p', { className: 'text-[10px] text-quorum-accent uppercase tracking-[0.2em] mt-1 ml-8 font-bold' }, 'Demo Mode')
        ),
        React.createElement('button', {
          onClick: () => setSidebarOpen(false),
          className: 'md:hidden text-quorum-muted'
        }, React.createElement(X, { className: 'w-5 h-5' }))
      ),

      // Board Members
      React.createElement('div', { className: 'flex-1 overflow-y-auto p-4 space-y-6' },
        React.createElement('div', null,
          React.createElement('h2', {
            className: 'text-xs font-bold text-quorum-muted uppercase tracking-wider mb-4 px-2'
          }, 'Board of Directors'),
          React.createElement('div', { className: 'space-y-2' },
            ...Object.values(AGENTS).map(agent =>
              React.createElement(AgentCard, {
                key: agent.id,
                profile: agent,
                isActive: isRevealing,
                isSpeaking: speakingAgent === agent.id,
                vote: advisorVotes[agent.id]?.vote || null,
                confidence: advisorVotes[agent.id]?.confidence || null
              })
            )
          )
        ),
        // System Status
        React.createElement('div', null,
          React.createElement('h2', {
            className: 'text-xs font-bold text-quorum-muted uppercase tracking-wider mb-4 px-2'
          }, 'System Status'),
          React.createElement('div', {
            className: 'px-2 py-3 bg-quorum-surface rounded-lg border border-quorum-border/50'
          },
            React.createElement('div', { className: 'flex items-center justify-between mb-2' },
              React.createElement('span', { className: 'text-xs text-slate-400' }, 'Board Status'),
              React.createElement('span', {
                className: `text-xs font-bold ${isRevealing ? 'text-amber-500' : 'text-emerald-500'}`
              }, isRevealing ? 'DELIBERATING' : 'READY')
            ),
            React.createElement('div', { className: 'w-full bg-slate-700 h-1 rounded-full overflow-hidden' },
              isRevealing && React.createElement('div', {
                className: 'h-full bg-amber-500 animate-progress w-full origin-left'
              })
            ),
            speakingAgent && AGENTS[speakingAgent] && React.createElement('div', {
              className: 'mt-2 flex items-center gap-2'
            },
              React.createElement('div', {
                className: `w-1.5 h-1.5 rounded-full animate-pulse ${AGENTS[speakingAgent].color.split(' ')[0].replace('text-', 'bg-')}`
              }),
              React.createElement('span', { className: 'text-[10px] text-slate-400 font-mono' },
                `${AGENTS[speakingAgent].title} speaking...`
              )
            )
          )
        )
      ),

    ),

    // Main Content Area
    React.createElement('main', {
      className: 'flex-1 flex flex-col min-w-0 bg-quorum-dark relative'
    },
      // Top Bar
      React.createElement('header', {
        className: 'h-16 border-b border-quorum-border bg-quorum-panel/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10'
      },
        React.createElement('div', { className: 'flex items-center gap-4' },
          React.createElement('button', {
            onClick: () => setSidebarOpen(true),
            className: 'md:hidden text-quorum-muted hover:text-white'
          }, React.createElement(Menu, { className: 'w-5 h-5' })),
          React.createElement('div', { className: 'flex items-center gap-2 text-sm text-quorum-muted' },
            React.createElement(LayoutDashboard, { className: 'w-4 h-4' }),
            React.createElement('span', { className: 'opacity-50' }, '/'),
            React.createElement('span', { className: 'text-slate-200 font-medium' }, 'Demo Session'),
            React.createElement('span', { className: 'opacity-50' }, '/'),
            React.createElement('span', { className: 'text-slate-400 truncate max-w-[200px]' },
              MINDSMITH_SCENARIOS[selectedScenario]?.title
            )
          )
        ),
        React.createElement('div', { className: 'flex items-center gap-2' },
          isRevealing && React.createElement('button', {
            onClick: handleSkip,
            className: 'flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-quorum-accent hover:text-white border border-quorum-accent/30 hover:border-quorum-accent rounded-lg transition-all hover:bg-quorum-accent/10'
          },
            React.createElement(SkipForward, { className: 'w-3.5 h-3.5' }),
            'Skip'
          ),
          !isRevealing && messages.length > 0 && React.createElement('button', {
            onClick: handleTryAnother,
            className: 'flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-quorum-muted hover:text-white border border-quorum-border hover:border-slate-500 rounded-lg transition-all hover:bg-quorum-surface'
          },
            React.createElement(RotateCcw, { className: 'w-3.5 h-3.5' }),
            'Try Another Scenario'
          ),
          React.createElement('div', { className: 'px-2.5 py-1 bg-quorum-accent/10 border border-quorum-accent/30 rounded-md text-[10px] font-bold text-quorum-accent uppercase tracking-wider hidden sm:block' },
            'Demo'
          )
        )
      ),

      // Chat Feed
      React.createElement('div', {
        className: 'flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-quorum-border scrollbar-track-transparent'
      },
        React.createElement('div', { className: 'max-w-4xl mx-auto' },
          ...messages.map(msg =>
            React.createElement(MessageBubble, {
              key: msg.id,
              message: msg,
              currentUser: MOCK_USER,
              advisorVotes: advisorVotes
            })
          ),
          ...streamingBubbles.map(msg =>
            React.createElement(MessageBubble, {
              key: msg.id,
              message: msg,
              currentUser: MOCK_USER,
              advisorVotes: advisorVotes
            })
          ),
          isRevealing && !speakingAgent && React.createElement('div', {
            className: 'flex items-center gap-3 text-quorum-muted animate-pulse py-4 pl-2'
          },
            React.createElement(Loader2, { className: 'w-4 h-4 animate-spin' }),
            React.createElement('span', { className: 'text-xs font-mono uppercase tracking-widest' }, 'Consulting Board Members...')
          ),
          React.createElement('div', { ref: messagesEndRef })
        )
      ),

      // Input Area (disabled in demo)
      React.createElement('div', { className: 'p-6 bg-quorum-dark border-t border-quorum-border' },
        React.createElement('div', { className: 'max-w-4xl mx-auto' },
          React.createElement('div', {
            className: 'relative rounded-xl border border-quorum-border bg-quorum-surface/50 opacity-60 cursor-not-allowed'
          },
            React.createElement('div', {
              className: 'w-full p-4 text-sm text-slate-500 select-none'
            }, 'Demo mode \u2014 sign up to ask your own questions'),
          ),
          React.createElement('div', { className: 'flex justify-between items-center mt-3 px-1' },
            React.createElement('div', { className: 'flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border bg-quorum-accent/10 border-quorum-accent/20 text-quorum-accent' },
              '\uD83D\uDCC4 Full Report'
            )
          )
        )
      )
    )
  );
};

export default DemoApp;
