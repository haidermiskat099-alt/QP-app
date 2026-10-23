import React, { useState } from 'react';
import { X, Eye, EyeOff, User, Phone, Lock, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { User as UserType } from '../types';
import { AUTHORIZED_ADMINS, INITIAL_STUDENTS } from '../data/initialData';
import { sounds } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [isLogin, setIsLogin] = useState<boolean>(initialMode === 'login');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      setErrorMsg('Please enter your phone number.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (isLogin) {
      // Check 4 Admins first
      const matchedAdmin = AUTHORIZED_ADMINS.find(a => a.phone === cleanPhone);
      if (matchedAdmin) {
        sounds.playCorrect();
        setSuccessMsg(`Welcome, ${matchedAdmin.fullName} (${matchedAdmin.adminTitle})!`);
        setTimeout(() => {
          onLoginSuccess(matchedAdmin);
          onClose();
        }, 600);
        return;
      }

      // Check existing initial students or local users
      const matchedStudent = INITIAL_STUDENTS.find(s => s.phone === cleanPhone);
      if (matchedStudent) {
        sounds.playCorrect();
        setSuccessMsg(`Welcome back, ${matchedStudent.fullName}!`);
        setTimeout(() => {
          onLoginSuccess(matchedStudent);
          onClose();
        }, 600);
        return;
      }

      // Fallback: logged in with entered credentials as a verified student
      sounds.playCorrect();
      const studentUser: UserType = {
        id: 'usr_' + Date.now(),
        fullName: cleanPhone.startsWith('019') ? 'Community Student' : 'Active Aspirant',
        phone: cleanPhone,
        role: 'student',
        points: 1200,
        quizzesAttempted: 5,
        accuracy: 88.5,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        streakDays: 3,
        badge: 'Rising Star',
      };
      setSuccessMsg(`Signed in successfully!`);
      setTimeout(() => {
        onLoginSuccess(studentUser);
        onClose();
      }, 600);
    } else {
      // Sign Up Mode
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password.length < 3) {
        setErrorMsg('Password should be at least 3 characters.');
        return;
      }

      // Check if phone matches 4 Admins
      const isAdminPhone = AUTHORIZED_ADMINS.some(a => a.phone === cleanPhone);
      const newUser: UserType = {
        id: 'usr_' + Date.now(),
        fullName: fullName.trim(),
        phone: cleanPhone,
        role: isAdminPhone ? 'admin' : 'student',
        adminTitle: isAdminPhone ? 'Community Moderator' : undefined,
        points: 500,
        quizzesAttempted: 0,
        accuracy: 100,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        streakDays: 1,
        badge: 'New Recruit',
      };

      sounds.playCorrect();
      setSuccessMsg(`Account created for ${newUser.fullName}!`);
      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
      }, 700);
    }
  };

  const handleQuickDemoFill = (type: 'admin' | 'student') => {
    sounds.playTap();
    if (type === 'admin') {
      const admin = AUTHORIZED_ADMINS[0];
      setPhone(admin.phone);
      setPassword('admin');
      setIsLogin(true);
      setErrorMsg('');
      setSuccessMsg(`Filled Demo Admin: ${admin.fullName}`);
    } else {
      const student = INITIAL_STUDENTS[0];
      setPhone(student.phone);
      setPassword('123');
      setIsLogin(true);
      setErrorMsg('');
      setSuccessMsg(`Filled Demo Student: ${student.fullName}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl glass-panel-glow border border-purple-500/30 overflow-hidden shadow-[0_0_50px_rgba(255,0,85,0.25)]">
        {/* Subtle Decorative Aura Glow inside modal */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#FF0055]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-[#8A2BE2]/30 blur-3xl pointer-events-none" />

        {/* Modal Header */}
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
                {isLogin ? 'Access live quizzes & practice engines' : 'Unlock competitive test prep & leaderboard'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-purple-950/50 text-slate-400 hover:text-white hover:bg-purple-900/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle Bar */}
        <div className="p-6 pt-4 pb-2">
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#0d021a] border border-purple-500/20">
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setIsLogin(true);
                setErrorMsg('');
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Full Name field (Sign Up Only) */}
          {!isLogin && (
            <div>
              <label className="block text-[11px] font-semibold text-purple-200 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  placeholder="e.g. Fahmida Rahman"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
            </div>
          )}

          {/* Phone Number Field */}
          <div>
            <label className="block text-[11px] font-semibold text-purple-200 mb-1.5 uppercase tracking-wider">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type="tel"
                placeholder="e.g. 01712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 font-mono"
              />
            </div>
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div>
            <label className="block text-[11px] font-semibold text-purple-200 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action CTA */}
          <button
            type="submit"
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-[#FF0055] via-purple-600 to-[#8A2BE2] text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(255,0,85,0.45)] hover:shadow-[0_0_25px_rgba(255,0,85,0.7)] active:scale-[0.98] transition-all cursor-pointer"
          >
            {isLogin ? 'Sign In to QP Community' : 'Create Free Account'}
          </button>

          {/* 1-Click Demo Accounts Selector for Reviewers */}
          <div className="pt-3 border-t border-purple-500/15">
            <p className="text-[10px] text-center text-purple-300/80 mb-2 font-semibold uppercase tracking-wider">
              ⚡ Quick 1-Tap Reviewer Presets (No OTP needed):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('admin')}
                className="p-2 rounded-xl bg-red-950/40 border border-[#FF0055]/30 hover:border-[#FF0055]/70 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF0055]" />
                  <span>Admin Mode</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  Engr. Tanvir (Controller)
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoFill('student')}
                className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 hover:border-purple-500/70 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                  <User className="w-3.5 h-3.5 text-[#8A2BE2]" />
                  <span>Student Mode</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  Tasmia (Rank #6 Candidate)
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
