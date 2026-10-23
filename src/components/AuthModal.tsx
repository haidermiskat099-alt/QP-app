
import React, { useState } from 'react';
import {
  X,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { User as UserType } from '../types';
import { sounds } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
  initialMode?: 'login' | 'signup';
}

const API_BASE_URL = 'http://127.0.0.1:8000';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [isLogin, setIsLogin] = useState<boolean>(
    initialMode === 'login'
  );
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (!isLogin && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!isLogin && password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/${isLogin ? 'login' : 'signup'}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            isLogin
              ? {
                  email: cleanEmail,
                  password,
                }
              : {
                  username: fullName.trim(),
                  email: cleanEmail,
                  password,
                }
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || 'Authentication failed.'
        );
      }

      if (!data.user || !data.access_token) {
        throw new Error('Invalid response received from the backend.');
      }

      sessionStorage.setItem('qp_access_token', data.access_token);

      const isAdmin = data.user.role === 'admin';

      const loggedInUser: UserType = {
        id: String(data.user.id),
        fullName: data.user.username,
        phone: data.user.email,
        role: isAdmin ? 'admin' : 'student',
        adminTitle: isAdmin ? 'Administrator' : undefined,
        points: 0,
        quizzesAttempted: 0,
        accuracy: 0,
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        streakDays: 0,
        badge: isAdmin ? 'Administrator' : 'New Recruit',
      };

      sounds.playCorrect();
      setSuccessMsg(
        isLogin
          ? 'Signed in successfully!'
          : 'Account created successfully!'
      );

      setTimeout(() => {
        onLoginSuccess(loggedInUser);
        onClose();
      }, 500);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong.';

      setErrorMsg(
        message.includes('Failed to fetch')
          ? 'Cannot connect to the Python backend. Check that the server is running.'
          : message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl glass-panel-glow border border-purple-500/30 overflow-hidden shadow-[0_0_50px_rgba(255,0,85,0.25)]">
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#FF0055]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-[#8A2BE2]/30 blur-3xl pointer-events-none" />

        <div className="relative p-6 pb-2 flex items-center justify-between border-b border-purple-500/15">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF0055] to-[#8A2BE2] flex items-center justify-center shadow-[0_0_12px_rgba(255,0,85,0.5)]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-white">
                {isLogin ? 'Welcome Back' : 'Join QP Community'}
              </h2>
              <p className="text-[11px] text-purple-300/80">
                {isLogin
                  ? 'Access live quizzes & practice engines'
                  : 'Unlock competitive test prep & leaderboard'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-purple-950/50 text-slate-400 hover:text-white hover:bg-purple-900/60 transition-colors cursor-pointer"
            aria-label="Close login window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 pt-4 pb-2">
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#0d021a] border border-purple-500/20">
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setIsLogin(true);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isLogin
                  ? 'bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white shadow-[0_0_12px_rgba(255,0,85,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Log In
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setIsLogin(false);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !isLogin
                  ? 'bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white shadow-[0_0_12px_rgba(255,0,85,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          {errorMsg && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs"
            >
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div
              role="status"
              className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-[11px] font-semibold text-purple-200 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-purple-200 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-purple-200 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                required
                minLength={isLogin ? undefined : 8}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-[#FF0055] via-purple-600 to-[#8A2BE2] text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(255,0,85,0.45)] hover:shadow-[0_0_25px_rgba(255,0,85,0.7)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? 'Please wait...'
              : isLogin
                ? 'Sign In to QP Community'
                : 'Create Free Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
                  
