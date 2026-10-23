import React from 'react';
import { 
  Flame, 
  Calendar, 
  Clock, 
  Play, 
  Users, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Trophy,
  CheckCircle,
  Bell
} from 'lucide-react';
import { Quiz, BroadcastAnnouncement, User } from '../types';
import { sounds } from '../utils/audio';

interface HomeFeedProps {
  quizzes: Quiz[];
  announcements: BroadcastAnnouncement[];
  onStartQuiz: (quiz: Quiz) => void;
  onOpenAnnouncements: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenLeaderboard: () => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  quizzes,
  announcements,
  onStartQuiz,
  onOpenAnnouncements,
  currentUser,
  onOpenAuth,
  onOpenLeaderboard,
}) => {
  const latestAnnouncement = announcements.find((a) => a.active);
  const liveQuizzes = quizzes.filter((q) => q.isLive);
  const scheduledQuizzes = quizzes.filter((q) => !q.isLive);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 animate-fadeIn">
      {/* Live Broadcast Announcement Ticker Banner */}
      {latestAnnouncement && (
        <div 
          onClick={() => {
            sounds.playTap();
            onOpenAnnouncements();
          }}
          className="p-3 rounded-2xl glass-panel-red border border-[#FF0055]/40 flex items-center justify-between gap-3 shadow-[0_0_20px_rgba(255,0,85,0.2)] cursor-pointer hover:border-[#FF0055] transition-all group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-1.5 rounded-lg bg-[#FF0055] text-white shrink-0 shadow-[0_0_8px_#FF0055]">
              <Bell className="w-3.5 h-3.5 animate-bounce" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#FF0055]">
                  Live Broadcast Alert
                </span>
                <span className="text-[10px] text-slate-400 font-mono-num">{latestAnnouncement.createdAt}</span>
              </div>
              <p className="text-xs font-bold text-white truncate group-hover:text-[#FF0055] transition-colors">
                {latestAnnouncement.title}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
      )}

      {/* Hero Welcome Card for QP COMMUNITY */}
      <div className="relative p-5 rounded-3xl glass-panel-glow border border-purple-500/35 overflow-hidden">
        {/* Blurry aura orbs inside card */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#FF0055]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#8A2BE2]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-950/70 border border-[#FF0055]/50 text-[#FF0055]">
              Question Practice Community
            </span>
            <span className="text-xs text-purple-300 font-semibold">
              Live Battle Engine
            </span>
          </div>

          <h2 className="font-display font-black text-xl sm:text-2xl text-white leading-tight">
            Master Speed & Accuracy <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] via-purple-300 to-[#8A2BE2]">
              Under Negative Marking Pressure
            </span>
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
            Timed MCQs with 4 options, automated countdown clocks, negative penalty calculation, and real-time AI Top 5 Leaderboard standings.
          </p>

          <div className="flex items-center gap-3 pt-1">
            {liveQuizzes.length > 0 ? (
              <button
                onClick={() => {
                  sounds.playTap();
                  onStartQuiz(liveQuizzes[0]);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0055] via-purple-600 to-[#8A2BE2] text-white text-xs font-bold shadow-[0_0_20px_rgba(255,0,85,0.5)] hover:shadow-[0_0_25px_rgba(255,0,85,0.7)] active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Enter Live Quiz Now</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playTap();
                  if (quizzes.length > 0) onStartQuiz(quizzes[0]);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white text-xs font-bold shadow-[0_0_15px_rgba(255,0,85,0.4)] transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Start Practice Sprint</span>
              </button>
            )}

            <button
              onClick={() => {
                sounds.playTap();
                onOpenLeaderboard();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-950/50 border border-purple-500/30 text-purple-200 text-xs font-bold hover:text-white hover:border-purple-400 transition-all cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>View Top 5</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION: LIVE ACTIVE QUIZZES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF0055] shadow-[0_0_8px_#FF0055] animate-ping" />
            <h3 className="font-display font-bold text-sm sm:text-base text-white">
              Currently Live Quizzes
            </h3>
          </div>
          <span className="text-[11px] text-purple-300 font-mono-num font-semibold">
            {liveQuizzes.length} In Session
          </span>
        </div>

        {liveQuizzes.length === 0 ? (
          <div className="p-6 rounded-2xl glass-panel text-center text-xs text-slate-400">
            No quiz is active right this second. Check the scheduled queue below!
          </div>
        ) : (
          liveQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-4 sm:p-5 rounded-3xl glass-panel-red border border-[#FF0055]/50 shadow-[0_0_25px_rgba(255,0,85,0.2)] space-y-3 hover:border-[#FF0055] transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#FF0055] text-white shadow-[0_0_6px_#FF0055]">
                      LIVE BATTLE
                    </span>
                    <span className="text-[10px] text-purple-300 font-semibold">
                      {quiz.category}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {quiz.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {quiz.description}
                  </p>
                </div>
              </div>

              {/* Quiz Parameters Strip */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-[#0c0218]/80 border border-purple-500/20 text-center">
                <div>
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">Questions</div>
                  <div className="text-xs font-bold text-white font-mono-num mt-0.5">
                    {quiz.questions.length} MCQs
                  </div>
                </div>

                <div>
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">Pace</div>
                  <div className="text-xs font-bold text-purple-300 font-mono-num mt-0.5">
                    {quiz.timeLimitPerQuestionSeconds}s / Q
                  </div>
                </div>

                <div>
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">Negative Mark</div>
                  <div className="text-xs font-bold text-[#FF0055] font-mono-num mt-0.5">
                    -{quiz.negativeMarking}
                  </div>
                </div>
              </div>

              {/* Action Button: Participate in Quiz */}
              <button
                onClick={() => {
                  sounds.playTap();
                  onStartQuiz(quiz);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF0055] via-purple-600 to-[#8A2BE2] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,0,85,0.4)] hover:shadow-[0_0_20px_rgba(255,0,85,0.7)] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Participate in Quiz (Live Engine)</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* SECTION: SCHEDULED UPCOMING QUIZZES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <h3 className="font-display font-bold text-sm sm:text-base text-white">
              Scheduled Live Quiz Queue
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono-num">
            {scheduledQuizzes.length} Upcoming
          </span>
        </div>

        <div className="space-y-2.5">
          {scheduledQuizzes.map((quiz) => {
            const scheduledTimeStr = new Date(quiz.scheduledAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            const scheduledDateStr = new Date(quiz.scheduledAt).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={quiz.id}
                className="p-4 rounded-2xl glass-panel border border-purple-500/20 hover:border-purple-400/40 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-950/70 text-purple-300 border border-purple-500/30">
                        {quiz.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-400" />
                        {scheduledDateStr} at {scheduledTimeStr}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {quiz.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playTap();
                      onStartQuiz(quiz);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-200 text-xs font-semibold hover:text-white hover:border-[#FF0055] transition-all cursor-pointer shrink-0"
                  >
                    Preview Drill
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-purple-500/10">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-500" />
                    <span>{quiz.totalParticipants} Registered Aspirants</span>
                  </span>
                  <span>Penalty: -{quiz.negativeMarking} · {quiz.timeLimitPerQuestionSeconds}s/Q</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
