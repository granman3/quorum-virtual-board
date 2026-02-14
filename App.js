import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, LayoutDashboard, Menu, X, Key, LogOut, Plus } from 'lucide-react';
import { AgentRole } from './types.js';
import { AGENTS, DEMO_SCENARIOS } from './constants.js';
import { consultBoard, determineMode, hasApiKey, setApiKey, getApiKey, parseVoteAndConfidence } from './services/geminiService.js';
import { onAuthChange, signOut } from './services/authService.js';
import { AgentCard } from './components/AgentCard.js';
import { MessageBubble } from './components/MessageBubble.js';
import { LoginScreen } from './components/LoginScreen.js';

// Session persistence
const saveSession = (messages, topic) => {
  try {
    localStorage.setItem('quorum_session', JSON.stringify({ messages, topic, savedAt: Date.now() }));
  } catch (e) { /* quota exceeded — ignore */ }
};

const loadSession = () => {
  try {
    const raw = localStorage.getItem('quorum_session');
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.messages?.length > 0) return data;
  } catch (e) { /* corrupted — ignore */ }
  return null;
};

const clearSession = () => localStorage.removeItem('quorum_session');

// Extract topic from first user message
const extractTopic = (text) => {
  const words = text.trim().split(/\s+/).slice(0, 6);
  let topic = words.join(' ');
  if (text.trim().split(/\s+/).length > 6) topic += '...';
  return topic;
};

const App = () => {
  // Auth state
  const [currentUser, setCurrentUser] = useState(undefined); // undefined = loading, null = signed out
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConsulting, setIsConsulting] = useState(false);
  const [inputMode, setInputMode] = useState('SMS');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [speakingAgent, setSpeakingAgent] = useState(null);
  const [streamingMessages, setStreamingMessages] = useState({});
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getApiKey());
  const [sessionTopic, setSessionTopic] = useState(null);
  const [advisorVotes, setAdvisorVotes] = useState({});

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      if (user && !hasApiKey()) {
        setShowApiKeyModal(true);
      }
    });
    return unsubscribe;
  }, []);

  // Load saved session on auth
  useEffect(() => {
    if (currentUser) {
      const saved = loadSession();
      if (saved) {
        setMessages(saved.messages);
        setSessionTopic(saved.topic || null);
      }
    }
  }, [currentUser]);

  // Save session when messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveSession(messages, sessionTopic);
    }
  }, [messages, sessionTopic]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessages, scrollToBottom]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + 'px';
    }
    const mode = determineMode(input);
    if (mode !== inputMode) {
      setInputMode(mode);
    }
  }, [input]);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setShowApiKeyModal(false);
    }
  };

  const handleNewSession = () => {
    setMessages([]);
    setSessionTopic(null);
    setStreamingMessages({});
    setIsConsulting(false);
    setSpeakingAgent(null);
    setAdvisorVotes({});
    clearSession();
  };

  const handleSignOut = async () => {
    await signOut();
    handleNewSession();
    setCurrentUser(null);
  };

  const handleSend = async (overrideInput) => {
    const text = overrideInput || input;
    if (!text.trim() || isConsulting) return;

    // Set topic from first message
    if (messages.length === 0) {
      setSessionTopic(extractTopic(text));
    }

    const userMsg = {
      id: crypto.randomUUID(),
      role: AgentRole.USER,
      content: text,
      timestamp: Date.now(),
      mode: determineMode(text)
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsConsulting(true);
    setInput('');
    setStreamingMessages({});
    setAdvisorVotes({});
    if (inputRef.current) inputRef.current.style.height = 'auto';

    try {
      await consultBoard(
        text,
        updatedMessages,
        (role, partialText, isStreaming) => {
          setSpeakingAgent(role);
          if (partialText) {
            setStreamingMessages(prev => ({ ...prev, [role]: partialText }));
          }
        },
        (completedMsg) => {
          setStreamingMessages(prev => {
            const next = { ...prev };
            delete next[completedMsg.role];
            return next;
          });
          setMessages(prev => [...prev, completedMsg]);
          setSpeakingAgent(null);
          // Track advisor votes
          if (completedMsg.vote && completedMsg.role !== AgentRole.SYNTHESIS) {
            setAdvisorVotes(prev => ({
              ...prev,
              [completedMsg.role]: { vote: completedMsg.vote, confidence: completedMsg.confidence }
            }));
          }
        }
      );
    } catch (err) {
      console.error('Board consultation error:', err);
    }

    setIsConsulting(false);
    setSpeakingAgent(null);
    setStreamingMessages({});
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDemoClick = (question) => {
    handleSend(question);
  };

  // Auth loading state
  if (currentUser === undefined) {
    return React.createElement('div', {
      className: 'min-h-screen bg-quorum-dark flex items-center justify-center'
    },
      React.createElement(Loader2, { className: 'w-8 h-8 text-quorum-accent animate-spin' })
    );
  }

  // Not signed in — show login screen
  if (!currentUser) {
    return React.createElement(LoginScreen);
  }

  // Build streaming message bubbles
  const streamingBubbles = Object.entries(streamingMessages).map(([role, text]) => ({
    id: `streaming-${role}`,
    role: role,
    content: text,
    timestamp: Date.now(),
    mode: inputMode,
    isStreaming: true
  }));

  // API Key Modal
  const apiKeyModal = showApiKeyModal ? React.createElement('div', {
    className: 'fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'
  },
    React.createElement('div', {
      className: 'bg-quorum-panel border border-quorum-border rounded-xl p-8 max-w-md w-full shadow-2xl'
    },
      React.createElement('div', { className: 'flex items-center gap-3 mb-6' },
        React.createElement('div', { className: 'p-2 bg-quorum-accent/10 rounded-lg border border-quorum-accent/20' },
          React.createElement(Key, { className: 'w-5 h-5 text-quorum-accent' })
        ),
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-lg font-serif font-bold text-white' }, 'API Key Required'),
          React.createElement('p', { className: 'text-xs text-quorum-muted' }, 'Enter your DeepSeek API key to activate the board')
        )
      ),
      React.createElement('input', {
        'data-testid': 'api-key-input',
        type: 'password',
        value: apiKeyInput,
        onChange: (e) => setApiKeyInput(e.target.value),
        onKeyDown: (e) => e.key === 'Enter' && handleSaveApiKey(),
        placeholder: 'sk-...',
        className: 'w-full bg-quorum-dark border border-quorum-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-quorum-accent/50 mb-4 font-mono'
      }),
      React.createElement('p', { className: 'text-xs text-quorum-muted mb-4 leading-relaxed' },
        'Get a free API key from ',
        React.createElement('a', {
          href: 'https://platform.deepseek.com/api_keys',
          target: '_blank',
          rel: 'noopener',
          className: 'text-quorum-accent hover:underline'
        }, 'DeepSeek Platform'),
        '. Your key is stored locally in your browser.'
      ),
      React.createElement('button', {
        'data-testid': 'activate-board-button',
        onClick: handleSaveApiKey,
        disabled: !apiKeyInput.trim(),
        className: `w-full py-3 rounded-lg font-semibold text-sm transition-all ${
          apiKeyInput.trim()
            ? 'bg-quorum-accent text-white hover:bg-sky-400'
            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
        }`
      }, 'Activate Board')
    )
  ) : null;

  // Empty state with demo scenarios
  const emptyState = messages.length === 0 && !isConsulting
    ? React.createElement('div', {
        className: 'flex flex-col items-center justify-center h-[60vh] text-center'
      },
        React.createElement('div', { className: 'opacity-40 mb-8' },
          React.createElement('div', {
            className: 'w-20 h-20 bg-quorum-surface rounded-2xl border border-quorum-border flex items-center justify-center mb-6 shadow-2xl mx-auto'
          },
            React.createElement('div', {
              className: 'w-10 h-10 bg-gradient-to-br from-quorum-accent to-blue-600 rounded-md flex items-center justify-center'
            },
              React.createElement('span', { className: 'text-lg font-serif font-bold text-white' }, 'Q')
            )
          ),
          React.createElement('h2', { className: 'text-2xl font-serif font-bold text-slate-300 mb-3' }, 'Quorum Executive Board'),
          React.createElement('p', { className: 'text-sm text-slate-400 max-w-md leading-relaxed' },
            'The board is assembled and awaiting your agenda. Choose a scenario below or draft your own brief.'
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl w-full px-4' },
          ...DEMO_SCENARIOS.map((scenario, i) =>
            React.createElement('button', {
              key: i,
              onClick: () => handleDemoClick(scenario.question),
              className: 'text-left p-4 rounded-lg border border-quorum-border/50 bg-quorum-surface/50 hover:bg-quorum-surface hover:border-quorum-border transition-all group'
            },
              React.createElement('div', { className: 'text-xs font-bold text-quorum-accent uppercase tracking-wider mb-2' },
                scenario.title
              ),
              React.createElement('p', { className: 'text-xs text-quorum-muted group-hover:text-slate-300 transition-colors line-clamp-2 leading-relaxed' },
                scenario.question.substring(0, 80) + (scenario.question.length > 80 ? '...' : '')
              )
            )
          )
        )
      )
    : null;

  return React.createElement('div', {
    className: 'flex h-screen bg-quorum-dark text-quorum-text font-sans overflow-hidden'
  },
    apiKeyModal,

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
          React.createElement('p', { className: 'text-[10px] text-quorum-muted uppercase tracking-[0.2em] mt-1 ml-8' }, 'Executive AI')
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
                isActive: isConsulting,
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
                'data-testid': 'board-status',
                className: `text-xs font-bold ${isConsulting ? 'text-amber-500' : 'text-emerald-500'}`
              }, isConsulting ? 'DELIBERATING' : 'READY')
            ),
            React.createElement('div', { className: 'w-full bg-slate-700 h-1 rounded-full overflow-hidden' },
              isConsulting && React.createElement('div', {
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

      // Sidebar Footer — user profile + actions
      React.createElement('div', { className: 'p-4 border-t border-quorum-border bg-quorum-panel space-y-1' },
        // Signed-in user info
        currentUser && React.createElement('div', {
          className: 'flex items-center gap-3 p-2 mb-2'
        },
          currentUser.photoURL
            ? React.createElement('img', {
                src: currentUser.photoURL,
                alt: currentUser.displayName,
                className: 'w-8 h-8 rounded-full border border-quorum-border'
              })
            : React.createElement('div', {
                className: 'w-8 h-8 rounded-full bg-quorum-accent/20 border border-quorum-accent/30 flex items-center justify-center text-xs font-bold text-quorum-accent'
              }, currentUser.displayName?.[0] || '?'),
          React.createElement('div', { className: 'flex-1 min-w-0' },
            React.createElement('p', { className: 'text-sm text-white truncate' }, currentUser.displayName),
            React.createElement('p', { className: 'text-[10px] text-quorum-muted truncate' }, currentUser.email)
          )
        ),
        React.createElement('div', {
          'data-testid': 'api-key-button',
          onClick: () => setShowApiKeyModal(true),
          className: 'flex items-center gap-3 text-sm text-quorum-muted hover:text-white cursor-pointer transition-colors p-2 rounded-md hover:bg-quorum-surface'
        },
          React.createElement(Key, { className: 'w-4 h-4' }),
          React.createElement('span', null, 'API Key')
        ),
        React.createElement('div', {
          'data-testid': 'sign-out-button',
          onClick: handleSignOut,
          className: 'flex items-center gap-3 text-sm text-quorum-muted hover:text-red-400 cursor-pointer transition-colors p-2 rounded-md hover:bg-quorum-surface'
        },
          React.createElement(LogOut, { className: 'w-4 h-4' }),
          React.createElement('span', null, 'Sign Out')
        )
      )
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
            'data-testid': 'sidebar-toggle',
            onClick: () => setSidebarOpen(true),
            className: 'md:hidden text-quorum-muted hover:text-white'
          }, React.createElement(Menu, { className: 'w-5 h-5' })),
          React.createElement('div', { className: 'flex items-center gap-2 text-sm text-quorum-muted' },
            React.createElement(LayoutDashboard, { className: 'w-4 h-4' }),
            React.createElement('span', { className: 'opacity-50' }, '/'),
            React.createElement('span', { className: 'text-slate-200 font-medium' }, 'Executive Session'),
            sessionTopic && React.createElement('span', { className: 'opacity-50' }, '/'),
            sessionTopic && React.createElement('span', {
              className: 'text-slate-400 truncate max-w-[200px]'
            }, sessionTopic)
          )
        ),
        React.createElement('div', { className: 'flex items-center gap-2' },
          messages.length > 0 && React.createElement('button', {
            'data-testid': 'new-session-button',
            onClick: handleNewSession,
            className: 'flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-quorum-muted hover:text-white border border-quorum-border hover:border-slate-500 rounded-lg transition-all hover:bg-quorum-surface'
          },
            React.createElement(Plus, { className: 'w-3.5 h-3.5' }),
            'New Session'
          ),
          React.createElement('div', { className: 'text-[10px] font-mono text-slate-600 hidden sm:block' },
            'DeepSeek V3'
          )
        )
      ),

      // Chat Feed
      React.createElement('div', {
        className: 'flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-quorum-border scrollbar-track-transparent'
      },
        React.createElement('div', { className: 'max-w-4xl mx-auto' },
          emptyState,
          ...messages.map(msg =>
            React.createElement(MessageBubble, { key: msg.id, message: msg, currentUser: currentUser, advisorVotes: advisorVotes })
          ),
          ...streamingBubbles.map(msg =>
            React.createElement(MessageBubble, { key: msg.id, message: msg, currentUser: currentUser, advisorVotes: advisorVotes })
          ),
          isConsulting && !speakingAgent && React.createElement('div', {
            className: 'flex items-center gap-3 text-quorum-muted animate-pulse py-4 pl-2'
          },
            React.createElement(Loader2, { className: 'w-4 h-4 animate-spin' }),
            React.createElement('span', { className: 'text-xs font-mono uppercase tracking-widest' }, 'Consulting Board Members...')
          ),
          React.createElement('div', { ref: messagesEndRef })
        )
      ),

      // Input Area
      React.createElement('div', { className: 'p-6 bg-quorum-dark border-t border-quorum-border' },
        React.createElement('div', { className: 'max-w-4xl mx-auto' },
          React.createElement('div', {
            className: `relative rounded-xl border transition-all duration-300 bg-quorum-surface ${
              inputMode === 'SMS'
                ? 'border-quorum-border focus-within:border-slate-500'
                : 'border-quorum-accent/30 shadow-[0_0_20px_rgba(56,189,248,0.05)] focus-within:border-quorum-accent/60'
            }`
          },
            React.createElement('textarea', {
              'data-testid': 'chat-input',
              ref: inputRef,
              value: input,
              onChange: (e) => setInput(e.target.value),
              onKeyDown: handleKeyDown,
              placeholder: 'Draft your executive brief...',
              className: 'w-full bg-transparent text-slate-200 p-4 pr-14 max-h-60 min-h-[60px] resize-none focus:outline-none text-sm md:text-base font-sans placeholder:text-slate-600',
              rows: 1
            }),
            React.createElement('div', { className: 'absolute bottom-2 right-2 flex items-center gap-1' },
              React.createElement('button', {
                'data-testid': 'send-button',
                onClick: () => handleSend(),
                disabled: !input.trim() || isConsulting,
                className: `p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  input.trim() && !isConsulting
                    ? 'bg-quorum-text text-quorum-dark hover:bg-white shadow-lg shadow-white/10'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`
              }, React.createElement(Send, { className: 'w-4 h-4' }))
            )
          ),
          React.createElement('div', { className: 'flex justify-between items-center mt-3 px-1' },
            React.createElement('div', { className: 'flex items-center gap-3' },
              React.createElement('div', {
                className: `flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                  inputMode === 'SMS'
                    ? 'bg-slate-800 border-slate-700 text-slate-400'
                    : 'bg-quorum-accent/10 border-quorum-accent/20 text-quorum-accent'
                }`
              }, inputMode === 'SMS' ? '\u26A1 Quick Brief' : '\uD83D\uDCC4 Full Report')
            ),
            React.createElement('div', { className: 'text-[10px] font-mono text-slate-600' },
              `${input.trim().split(/\s+/).filter(w => w.length > 0).length} WORDS`
            )
          )
        )
      )
    )
  );
};

export default App;
