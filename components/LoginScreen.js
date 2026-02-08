import React, { useState } from 'react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../services/authService.js';
import { Loader2 } from 'lucide-react';

const FIREBASE_ERROR_MESSAGES = {
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/invalid-credential': 'Incorrect email or password. Please try again.',
};

export const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError(null);
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized. Add it in Firebase Console → Authentication → Settings.');
      } else {
        setError('Sign-in failed. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, displayName || email.split('@')[0]);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      console.error('Email auth error:', err);
      setError(FIREBASE_ERROR_MESSAGES[err.code] || 'Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  // Floating agent indicators
  const agents = [
    { title: 'CFO', name: 'Marcus Sterling', color: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: 'PieChart', x: 'left-[8%] top-[18%]' },
    { title: 'CMO', name: 'Elena Vance', color: 'from-rose-500/20 to-rose-600/5', border: 'border-rose-500/30', text: 'text-rose-400', icon: 'TrendingUp', x: 'right-[8%] top-[22%]' },
    { title: 'CTO', name: 'David Chen', color: 'from-sky-500/20 to-sky-600/5', border: 'border-sky-500/30', text: 'text-sky-400', icon: 'Cpu', x: 'left-[12%] bottom-[22%]' },
    { title: 'General Counsel', name: 'Sarah O\'Connor', color: 'from-slate-400/20 to-slate-500/5', border: 'border-slate-400/30', text: 'text-slate-400', icon: 'Scale', x: 'right-[10%] bottom-[18%]' },
  ];

  return React.createElement('div', {
    className: 'min-h-screen bg-quorum-dark flex items-center justify-center relative overflow-hidden'
  },
    // Subtle gradient background
    React.createElement('div', {
      className: 'absolute inset-0 bg-gradient-to-br from-sky-950/30 via-quorum-dark to-slate-950/50'
    }),

    // Floating agent cards (hidden on mobile)
    ...agents.map((agent, i) =>
      React.createElement('div', {
        key: i,
        className: `absolute ${agent.x} hidden lg:block animate-fade-in`,
        style: { animationDelay: `${0.3 + i * 0.15}s`, animationFillMode: 'both' }
      },
        React.createElement('div', {
          className: `bg-gradient-to-br ${agent.color} backdrop-blur-sm border ${agent.border} rounded-xl p-4 w-44 shadow-2xl`
        },
          React.createElement('div', { className: `text-[10px] font-bold uppercase tracking-widest ${agent.text} mb-1` }, agent.title),
          React.createElement('div', { className: 'text-xs text-slate-400' }, agent.name)
        )
      )
    ),

    // Main login card
    React.createElement('div', {
      className: 'relative z-10 w-full max-w-md mx-4 animate-fade-in'
    },
      React.createElement('div', {
        className: 'bg-quorum-panel/80 backdrop-blur-xl border border-quorum-border rounded-2xl p-10 shadow-2xl shadow-black/40'
      },
        // Logo
        React.createElement('div', { className: 'flex flex-col items-center mb-10' },
          React.createElement('div', {
            className: 'w-16 h-16 bg-gradient-to-br from-quorum-accent to-blue-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-sky-500/20'
          },
            React.createElement('span', { className: 'text-2xl font-serif font-bold text-white' }, 'Q')
          ),
          React.createElement('h1', {
            className: 'text-3xl font-serif font-bold text-white tracking-tight'
          }, 'Quorum'),
          React.createElement('p', {
            className: 'text-xs text-quorum-muted uppercase tracking-[0.3em] mt-2'
          }, 'Virtual Board of Directors'),
          React.createElement('p', {
            className: 'text-sm text-slate-400 mt-4 text-center leading-relaxed max-w-xs'
          }, 'Four AI executives. One boardroom. Your decisions, debated from every angle.')
        ),

        // Sign in button
        React.createElement('button', {
          onClick: handleGoogleSignIn,
          disabled: loading,
          className: 'w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
        },
          loading
            ? React.createElement(Loader2, { className: 'w-5 h-5 animate-spin text-gray-500' })
            : React.createElement('svg', { className: 'w-5 h-5', viewBox: '0 0 24 24' },
                React.createElement('path', { d: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z', fill: '#4285F4' }),
                React.createElement('path', { d: 'M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z', fill: '#34A853' }),
                React.createElement('path', { d: 'M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z', fill: '#FBBC05' }),
                React.createElement('path', { d: 'M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z', fill: '#EA4335' })
              ),
          loading ? 'Signing in...' : 'Continue with Google'
        ),

        // Divider
        React.createElement('div', { className: 'flex items-center gap-3 my-6' },
          React.createElement('div', { className: 'flex-1 h-px bg-quorum-border' }),
          React.createElement('span', { className: 'text-xs text-quorum-muted' }, 'or continue with email'),
          React.createElement('div', { className: 'flex-1 h-px bg-quorum-border' })
        ),

        // Email form
        React.createElement('form', {
          onSubmit: handleEmailSubmit,
          className: 'space-y-3'
        },
          // Display Name (sign-up only)
          isSignUp && React.createElement('input', {
            'data-testid': 'displayname-input',
            type: 'text',
            value: displayName,
            onChange: (e) => setDisplayName(e.target.value),
            placeholder: 'Display Name',
            className: 'w-full bg-quorum-dark border border-quorum-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-quorum-accent/50'
          }),
          React.createElement('input', {
            'data-testid': 'email-input',
            type: 'email',
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: 'Email address',
            className: 'w-full bg-quorum-dark border border-quorum-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-quorum-accent/50'
          }),
          React.createElement('input', {
            'data-testid': 'password-input',
            type: 'password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            placeholder: 'Password',
            className: 'w-full bg-quorum-dark border border-quorum-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-quorum-accent/50'
          }),
          React.createElement('button', {
            'data-testid': 'email-submit',
            type: 'submit',
            disabled: loading || !email.trim() || !password.trim(),
            className: `w-full py-3 rounded-lg font-semibold text-sm transition-all ${
              email.trim() && password.trim() && !loading
                ? 'bg-quorum-accent text-white hover:bg-sky-400'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`
          }, loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In'))
        ),

        // Toggle sign-in/sign-up
        React.createElement('p', {
          className: 'mt-4 text-xs text-center'
        },
          React.createElement('span', {
            'data-testid': 'auth-toggle',
            onClick: () => { setIsSignUp(!isSignUp); setError(null); },
            className: 'text-quorum-accent hover:underline cursor-pointer'
          }, isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up")
        ),

        // Error message
        error && React.createElement('p', {
          'data-testid': 'auth-error',
          className: 'mt-4 text-xs text-red-400 text-center'
        }, error),

        // Footer
        React.createElement('p', {
          className: 'mt-8 text-[11px] text-slate-600 text-center leading-relaxed'
        }, 'Powered by Google Gemini AI. Your data stays in your browser.')
      )
    )
  );
};
