import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Send, 
  PlusCircle, 
  Users, 
  BookOpen, 
  Award, 
  Sparkles, 
  CheckCircle, 
  Lock, 
  Radio, 
  Flame, 
  Activity,
  Layers,
  Clock,
  FileText,
  Calendar,
  Database,
  Trash2,
  Play,
  ArrowRight
} from 'lucide-react';
import { User, BroadcastAnnouncement, Quiz } from '../types';
import { AUTHORIZED_ADMINS } from '../data/initialData';
import { BulkQuizImportStudio } from './BulkQuizImportStudio';
import { sounds } from '../utils/audio';

interface AdminPanelProps {
  currentUser: User | null;
  onLoginAsAdmin: (admin: User) => void;
  onSendBroadcast: (announcement: BroadcastAnnouncement) => void;
  onOpenQuizCreator: () => void;
  quizzes: Quiz[];
  onLaunchQuizImmediately: (quizId: string) => void;
  onSaveImportedQuiz?: (quiz: Quiz) => void;
  onDeleteQuiz?: (quizId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  onLoginAsAdmin,
  onSendBroadcast,
  onOpenQuizCreator,
  quizzes,
  onLaunchQuizImmediately,
  onSaveImportedQuiz,
  onDeleteQuiz,
}) => {
  const isAdmin = currentUser?.role === 'admin';

  // Admin Active Tab Section
  const [adminSection, setAdminSection] = useState<'bulk_import' | 'broadcast' | 'database'>('bulk_import');

  // Broadcast announcement form state
  const [broadcastTitle, setBroadcastTitle] = useState('⚡ Live Quiz starts at 8:00 PM!');
  const [broadcastMessage, setBroadcastMessage] = useState(
    'BCS & Admission sprint starting in 15 minutes! 30s per question with negative marking. Get ready!'
  );
  const [urgency, setUrgency] = useState<'live_event' | 'urgent' | 'academic'>('live_event');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  // Auto-schedule countdown ticker state
  const [nowTimestamp, setNowTimestamp] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    setIsSending(true);
    sounds.playTap();

    setTimeout(() => {
      const newAnnouncement: BroadcastAnnouncement = {
        id: 'bc_' + Date.now(),
        title: broadcastTitle.trim(),
        message: broadcastMessage.trim(),
        urgency,
        createdAt: 'Just now',
        authorName: currentUser?.fullName || 'Haider',
        authorRole: currentUser?.adminTitle || 'Owner',
        active: true,
      };

      sounds.playBroadcastNotification();
      onSendBroadcast(newAnnouncement);
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 4000);
    }, 450);
  };

  const formatCountdown = (targetDateStr: string) => {
    const diffMs = new Date(targetDateStr).getTime() - nowTimestamp;
    if (diffMs <= 0) return 'Triggering Live...';
    const totalSecs = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
    return `${mins}m ${secs}s`;
  };

  // If user is not yet logged in as one of the 4 admins, display the Secret Admin Access Gate
  if (!isAdmin) {
    return (
      <div className="flex-1 p-4 sm:p-6 flex flex-col items-center justify-center text-center animate-fadeIn">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel-red border border-[#FF0055]/40 shadow-[0_0_50px_rgba(255,0,85,0.25)] space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF0055] to-[#8A2BE2] mx-auto flex items-center justify-center shadow-[0_0_20px_#FF0055]">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/70 border border-[#FF0055]/40 text-[#FF0055] text-[11px] font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Restricted Access</span>
            </div>
            <h2 className="font-display font-black text-2xl text-white">
              Secret Admin Studio
            </h2>
            <p className="text-xs text-purple-300/80 mt-1.5 leading-relaxed">
              This control center is strictly reserved for the <strong>4 Authorized Administrators</strong> of QP COMMUNITY.
            </p>
          </div>

          <div className="pt-2 border-t border-purple-500/20 text-left space-y-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Verify & Sign In as Authorized Admin:
            </span>

            <div className="grid grid-cols-1 gap-2 pt-1">
              {AUTHORIZED_ADMINS.map((admin) => (
                <button
                  key={admin.id}
                  onClick={() => {
                    sounds.playCorrect();
                    onLoginAsAdmin(admin);
                  }}
                  className="w-full p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/25 hover:border-[#FF0055] hover:bg-purple-900/40 flex items-center gap-3 transition-all text-left cursor-pointer group"
                >
                  <img
                    src={admin.avatar}
                    alt={admin.fullName}
                    className="w-9 h-9 rounded-lg object-cover border border-purple-400/40 group-hover:border-[#FF0055]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-[#FF0055] transition-colors truncate">
                      {admin.fullName}
                    </div>
                    <div className="text-[10px] text-purple-300/80 truncate">
                      {admin.adminTitle}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-500/30">
                    Phone: {admin.phone.slice(0, 3)}...{admin.phone.slice(-3)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard UI
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 animate-fadeIn">
      {/* Admin Profile Welcome Strip */}
      <div className="p-4 sm:p-5 rounded-3xl glass-panel-glow border border-purple-500/35 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#FF0055]/30 to-transparent blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.fullName}
                className="w-13 h-13 rounded-2xl object-cover border-2 border-[#FF0055] shadow-[0_0_15px_#FF0055]"
              />
              <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-500 border border-slate-950">
                <CheckCircle className="w-3 h-3 text-white" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-950/70 border border-[#FF0055]/50 text-[#FF0055]">
                  Admin: {currentUser.adminTitle}
                </span>
                <span className="text-[10px] text-purple-300 font-mono-num">ID: {currentUser.phone}</span>
              </div>
              <h2 className="font-display font-black text-lg sm:text-xl text-white mt-0.5">
                {currentUser.fullName}
              </h2>
              <p className="text-xs text-purple-200 font-medium">
                Authorized QP Community Administration & Auto-Scheduling Control
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playTap();
                setAdminSection('bulk_import');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white text-xs font-bold shadow-[0_0_15px_rgba(255,0,85,0.4)] hover:shadow-[0_0_20px_rgba(255,0,85,0.7)] cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Bulk MCQ Import</span>
            </button>

            <button
              onClick={() => {
                sounds.playTap();
                onOpenQuizCreator();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 hover:text-white text-xs font-semibold cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#FF0055]" />
              <span className="hidden sm:inline">Single Creator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Section Switcher Sub-Tabs */}
      <div className="flex items-center p-1 rounded-2xl bg-purple-950/50 border border-purple-500/20 overflow-x-auto">
        <button
          onClick={() => {
            sounds.playTap();
            setAdminSection('bulk_import');
          }}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            adminSection === 'bulk_import'
              ? 'bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white shadow-[0_0_12px_rgba(255,0,85,0.4)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Bulk Import & Auto-Scheduler</span>
        </button>

        <button
          onClick={() => {
            sounds.playTap();
            setAdminSection('database');
          }}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            adminSection === 'database'
              ? 'bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white shadow-[0_0_12px_rgba(255,0,85,0.4)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Quiz Sets Database ({quizzes.length})</span>
        </button>

        <button
          onClick={() => {
            sounds.playTap();
            setAdminSection('broadcast');
          }}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            adminSection === 'broadcast'
              ? 'bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white shadow-[0_0_12px_rgba(255,0,85,0.4)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Broadcast Siren Studio</span>
        </button>
      </div>

      {/* Real-Time Platform Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-2xl glass-panel border border-purple-500/20">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Active Students</span>
            <Users className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-display font-black text-white font-mono-num">
            1,482
          </div>
          <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
            +14.8% active this week
          </div>
        </div>

        <div className="p-3.5 rounded-2xl glass-panel border border-purple-500/20">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Stored Quiz Sets</span>
            <Database className="w-3.5 h-3.5 text-[#FF0055]" />
          </div>
          <div className="text-xl font-display font-black text-white font-mono-num">
            {quizzes.length} Sets
          </div>
          <div className="text-[10px] text-purple-300 font-medium mt-0.5">
            {quizzes.filter(q => q.isLive).length} Live · {quizzes.filter(q => !q.isLive).length} Scheduled
          </div>
        </div>

        <div className="p-3.5 rounded-2xl glass-panel border border-purple-500/20">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Total MCQs in DB</span>
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-display font-black text-white font-mono-num">
            {quizzes.reduce((acc, q) => acc + q.questions.length, 0)} Questions
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
            All 4 Options & Verified Keys
          </div>
        </div>

        <div className="p-3.5 rounded-2xl glass-panel border border-purple-500/20">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Auto-Schedule Engine</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-display font-black text-emerald-400 font-mono-num">
            Active
          </div>
          <div className="text-[10px] text-cyan-300 font-medium mt-0.5">
            Precision Auto-Trigger Sync
          </div>
        </div>
      </div>

      {/* SECTION 1: Advanced Bulk Quiz Import & Auto-Scheduler */}
      {adminSection === 'bulk_import' && (
        <BulkQuizImportStudio
          currentUser={currentUser}
          onSaveAndScheduleQuiz={(newQuiz) => {
            if (onSaveImportedQuiz) onSaveImportedQuiz(newQuiz);
            setAdminSection('database');
          }}
        />
      )}

      {/* SECTION 2: Broadcast Announcement Studio */}
      {adminSection === 'broadcast' && (
        <div className="p-4 sm:p-5 rounded-3xl glass-panel-red border border-[#FF0055]/35 shadow-[0_0_30px_rgba(255,0,85,0.15)] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FF0055] flex items-center justify-center shadow-[0_0_10px_#FF0055]">
                <Radio className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm sm:text-base text-white">
                  Broadcast Announcement Studio
                </h3>
                <p className="text-[11px] text-purple-300/80">
                  Instantly sirens push alert to all connected student applets
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold text-[#FF0055] bg-red-950/70 border border-[#FF0055]/40 px-2 py-0.5 rounded-full">
              Direct Siren API
            </span>
          </div>

          {sentSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Broadcast Notification published and pushed to all active members!</span>
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Announcement Title / Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Live Quiz starts at 8 PM!"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Notification Body Message
              </label>
              <textarea
                rows={3}
                placeholder="Write the broadcast message to students..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500 resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase mr-1">
                  Type:
                </span>
                {[
                  { id: 'live_event', label: '⚡ Live Quiz Siren' },
                  { id: 'urgent', label: '🔥 Urgent Alert' },
                  { id: 'academic', label: '📘 Academic Note' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setUrgency(t.id as any);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      urgency === t.id
                        ? 'bg-[#FF0055] text-white shadow-[0_0_8px_#FF0055]'
                        : 'bg-purple-950/40 text-slate-400 hover:text-white border border-purple-500/20'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white text-xs font-bold shadow-[0_0_15px_rgba(255,0,85,0.4)] hover:shadow-[0_0_20px_rgba(255,0,85,0.7)] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Transmitting Siren...' : 'Send Broadcast Notification'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 3: Stored Quiz Sets Database & Auto-Scheduling Live Directory */}
      <div className="p-4 rounded-3xl glass-panel border border-purple-500/25 space-y-3.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] to-purple-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#FF0055]" />
              <span>Quiz Sets Database & Auto-Schedule Queue</span>
            </h3>
            <p className="text-[11px] text-purple-300">
              Quizzes automatically trigger live without manual action when their countdown reaches zero.
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono-num font-bold">
            {quizzes.length} Sets in Database
          </span>
        </div>

        <div className="space-y-2.5">
          {quizzes.map((quiz) => {
            const isLive = quiz.isLive;
            const scheduledDate = new Date(quiz.scheduledAt);
            const countdownText = formatCountdown(quiz.scheduledAt);

            return (
              <div
                key={quiz.id}
                className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                  isLive
                    ? 'glass-panel-red border-[#FF0055]/50 shadow-[0_0_20px_rgba(255,0,85,0.2)]'
                    : 'bg-[#140529]/80 border-purple-500/20 hover:border-purple-400/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isLive ? (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#FF0055] text-white shadow-[0_0_8px_#FF0055] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          LIVE BATTLE ACTIVE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-950/80 text-purple-200 border border-purple-500/40 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#FF0055]" />
                          <span>Auto-Trigger: {countdownText}</span>
                        </span>
                      )}

                      <span className="text-[10px] text-purple-300 font-semibold">
                        {quiz.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {quiz.title}
                    </h4>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 flex-wrap">
                      <span className="font-semibold text-slate-300">{quiz.questions.length} MCQs</span>
                      <span>·</span>
                      <span>{quiz.timeLimitPerQuestionSeconds}s / question</span>
                      <span>·</span>
                      <span>Penalty: -{quiz.negativeMarking}</span>
                      <span>·</span>
                      <span className="font-mono text-slate-400">
                        Scheduled: {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({scheduledDate.toLocaleDateString([], { month: 'short', day: 'numeric' })})
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!isLive && (
                      <button
                        onClick={() => {
                          sounds.playTap();
                          onLaunchQuizImmediately(quiz.id);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-[10px] font-bold text-white shadow-[0_0_10px_rgba(255,0,85,0.3)] hover:shadow-[0_0_15px_rgba(255,0,85,0.6)] cursor-pointer"
                        title="Override schedule and launch now"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Trigger Live Now</span>
                      </button>
                    )}

                    {onDeleteQuiz && (
                      <button
                        onClick={() => {
                          sounds.playTap();
                          if (confirm(`Delete quiz set "${quiz.title}" from database?`)) {
                            onDeleteQuiz(quiz.id);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-colors cursor-pointer"
                        title="Delete from database"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
