import React from 'react';
import { 
  User as UserIcon, 
  Flame, 
  Award, 
  Target, 
  ShieldCheck, 
  LogOut, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { User, QuizResult } from '../types';
import { sounds } from '../utils/audio';

interface UserProfileProps {
  user: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  recentResults: QuizResult[];
  onOpenAdminPanel: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onLogout,
  onOpenAuth,
  recentResults,
  onOpenAdminPanel,
}) => {
  if (!user) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mb-4">
          <UserIcon className="w-8 h-8 text-purple-300" />
        </div>
        <h3 className="font-display font-black text-xl text-white">
          Guest Aspirant
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mb-5">
          Sign in or create an account to track your question accuracy, climb the Top 5 leaderboard, and participate in live timed quizzes.
        </p>
        <button
          onClick={() => {
            sounds.playTap();
            onOpenAuth();
          }}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white text-xs font-bold shadow-[0_0_20px_rgba(255,0,85,0.4)] hover:shadow-[0_0_25px_rgba(255,0,85,0.7)] transition-all cursor-pointer"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 animate-fadeIn">
      {/* Profile Header Card */}
      <div className="relative p-5 rounded-3xl glass-panel-glow border border-purple-500/35 overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#FF0055]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-400/60 shadow-[0_0_15px_rgba(138,43,226,0.4)]"
              />
              <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-500 border border-slate-950">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  isAdmin 
                    ? 'bg-red-950/70 border border-[#FF0055]/50 text-[#FF0055]' 
                    : 'bg-purple-950/70 border border-purple-500/40 text-purple-300'
                }`}>
                  {isAdmin ? 'QP Admin' : 'Active Student'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono-num">{user.phone}</span>
              </div>
              <h2 className="font-display font-black text-lg sm:text-xl text-white mt-1">
                {user.fullName}
              </h2>
              <p className="text-xs text-purple-300 font-medium">
                {user.adminTitle || user.badge || 'Verified Community Member'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              onLogout();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs text-slate-300 hover:text-white hover:border-red-500/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>

        {isAdmin && (
          <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center justify-between">
            <span className="text-xs text-red-300 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FF0055]" />
              <span>Full Administrative Privileges Active</span>
            </span>
            <button
              onClick={() => {
                sounds.playTap();
                onOpenAdminPanel();
              }}
              className="text-xs font-bold text-[#FF0055] hover:underline cursor-pointer"
            >
              Open Admin Studio →
            </button>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-2xl glass-panel border border-purple-500/20 text-center">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Points</div>
          <div className="text-xl font-display font-black text-white font-mono-num mt-0.5">
            {user.points}
          </div>
          <div className="text-[9px] text-purple-300 mt-0.5">Community Score</div>
        </div>

        <div className="p-3.5 rounded-2xl glass-panel border border-purple-500/20 text-center">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Drills Attempted</div>
          <div className="text-xl font-display font-black text-white font-mono-num mt-0.5">
            {user.quizzesAttempted}
          </div>
          <div className="text-[9px] text-purple-300 mt-0.5">Speed Sprints</div>
        </div>

        <div className="p-3.5 rounded-2xl glass-panel border border-purple-500/20 text-center">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Net Accuracy</div>
          <div className="text-xl font-display font-black text-emerald-400 font-mono-num mt-0.5">
            {user.accuracy}%
          </div>
          <div className="text-[9px] text-emerald-400 mt-0.5">Under Negative Mark</div>
        </div>

        <div className="p-3.5 rounded-2xl glass-panel border border-purple-500/20 text-center">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Current Streak</div>
          <div className="text-xl font-display font-black text-orange-400 font-mono-num mt-0.5 flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 fill-orange-400" />
            <span>{user.streakDays}d</span>
          </div>
          <div className="text-[9px] text-orange-300 mt-0.5">Daily Question Run</div>
        </div>
      </div>

      {/* Recent Drill Activity History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] to-purple-300">
            Recent Practice History
          </h3>
          <span className="text-[11px] text-slate-400 font-mono-num">
            {recentResults.length} Sprints
          </span>
        </div>

        {recentResults.length === 0 ? (
          <div className="p-6 rounded-2xl glass-panel text-center text-xs text-slate-400 space-y-1">
            <p>No recent quiz runs recorded in this session.</p>
            <p className="text-[11px] text-purple-300">
              Jump into the "Live Quizzes" tab to test your reflexes!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentResults.map((res, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl glass-panel border border-purple-500/20 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-white truncate">{res.quizTitle}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                    <span>{res.correctAnswers} / {res.totalQuestions} Correct</span>
                    <span>·</span>
                    <span>{res.timeTakenSeconds}s elapsed</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">{res.accuracy}% Accuracy</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-display font-black text-white font-mono-num">
                    +{res.score} pts
                  </div>
                  <div className="text-[9px] text-purple-300">Net Score</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
