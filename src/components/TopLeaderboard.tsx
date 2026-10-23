import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Flame, 
  Crown, 
  Medal, 
  TrendingUp, 
  Brain, 
  RefreshCw, 
  CheckCircle2, 
  Target, 
  Zap,
  ShieldCheck
} from 'lucide-react';
import { LeaderboardUser } from '../types';
import { sounds } from '../utils/audio';

interface TopLeaderboardProps {
  leaderboardData: LeaderboardUser[];
  onChallengePerformer?: (user: LeaderboardUser) => void;
}

export const TopLeaderboard: React.FC<TopLeaderboardProps> = ({
  leaderboardData,
  onChallengePerformer,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all_time' | 'weekly' | 'today'>('all_time');
  const [aiInsights, setAiInsights] = useState<{
    summary: string;
    tacticalTips: string[];
    coachCommentary: string;
    mvpHighlight: string;
  } | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);

  // Fetch or refresh AI insights
  const fetchAIInsights = async () => {
    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/ai/leaderboard-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topPerformers: leaderboardData.slice(0, 5),
          communityStats: {
            totalRegistered: 1482,
            averageAccuracy: '94.6%',
            negativeMarkingRate: '-0.25'
          }
        }),
      });
      const data = await res.json();
      setAiInsights(data);
    } catch (err) {
      console.error(err);
      setAiInsights({
        summary: "The top 5 leaders exhibit blistering speed (<12s avg) and 95%+ precision under negative marking pressure.",
        tacticalTips: [
          "Eliminate 2 false options first before committing to risky choices to avoid -0.25 penalty.",
          "Prioritize high-weight conceptual science and general knowledge questions within the first 10 seconds.",
          "Practice daily timed micro-sprints to build lightning cognitive reflexes for the Live Cup."
        ],
        coachCommentary: "Mastery in QP Community comes not from guessing, but from disciplined risk calculation and lightning pattern recognition.",
        mvpHighlight: "Nafis Chowdhury is holding dominant reign with exceptional consistency!"
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, []);

  const top5 = leaderboardData.slice(0, 5);
  const numberOne = top5[0];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Hall of Champions</span>
          </div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-white">
            TOP 5 Performers
          </h2>
          <p className="text-xs text-purple-200">
            AI-monitored ranking of QP COMMUNITY elite test takers
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center p-1 rounded-xl bg-purple-950/50 border border-purple-500/20">
          {[
            { id: 'all_time', label: 'All-Time' },
            { id: 'weekly', label: 'Weekly Cup' },
            { id: 'today', label: "Today's Blitz" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playTap();
                setActiveFilter(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white shadow-[0_0_10px_rgba(255,0,85,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* #1 SPOTLIGHT HERO CARD */}
      {numberOne && (
        <div className="relative p-5 rounded-3xl glass-panel-red border border-[#FF0055]/50 shadow-[0_0_35px_rgba(255,0,85,0.25)] overflow-hidden">
          {/* Glowing Aura inside spotlight */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#FF0055]/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar with Royal Crown */}
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-[#FF0055] via-amber-400 to-[#8A2BE2] shadow-[0_0_20px_#FF0055]">
                  <img
                    src={numberOne.avatar}
                    alt={numberOne.name}
                    className="w-full h-full rounded-[14px] object-cover"
                  />
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-[0_0_10px_#f59e0b]">
                  <Crown className="w-4 h-4 fill-slate-950" />
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-[#FF0055] text-white font-mono text-[9px] font-black border border-white/20">
                  #1
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                    Grandmaster Sovereign
                  </span>
                  <span className="text-[10px] text-purple-300 flex items-center gap-1 font-mono-num">
                    <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
                    {numberOne.streakDays}d Streak
                  </span>
                </div>
                <h3 className="font-display font-black text-lg sm:text-xl text-white mt-1">
                  {numberOne.name}
                </h3>
                <p className="text-xs text-purple-200 mt-0.5">
                  {numberOne.specialty}
                </p>
              </div>
            </div>

            {/* Score & Accuracy KPI badge */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Points</div>
                <div className="text-xl font-display font-black text-white font-mono-num">
                  {numberOne.totalScore}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold font-mono-num">
                  {numberOne.accuracy}% Precision
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOP 2 to 5 LEADERBOARD LIST */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] to-purple-300">
          Rank #2 to #5 Elite Challengers
        </h3>

        <div className="space-y-2">
          {top5.slice(1).map((performer) => {
            const rankColors = {
              2: {
                badge: 'bg-slate-300 text-slate-950',
                border: 'border-slate-300/40',
                text: 'Silver Titan',
              },
              3: {
                badge: 'bg-amber-600 text-white',
                border: 'border-amber-600/40',
                text: 'Bronze Vanguard',
              },
              4: {
                badge: 'bg-purple-600 text-white',
                border: 'border-purple-500/30',
                text: 'Ruby Sentinel',
              },
              5: {
                badge: 'bg-emerald-600 text-white',
                border: 'border-emerald-500/30',
                text: 'Emerald Ace',
              },
            }[performer.rank] || {
              badge: 'bg-purple-900 text-white',
              border: 'border-purple-500/20',
              text: 'Aspirant',
            };

            return (
              <div
                key={performer.id}
                className="p-3.5 rounded-2xl glass-panel border border-purple-500/20 hover:border-purple-400/50 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank Badge */}
                  <span className={`w-7 h-7 rounded-xl font-mono text-xs font-black flex items-center justify-center shrink-0 ${rankColors.badge}`}>
                    #{performer.rank}
                  </span>

                  {/* Avatar */}
                  <img
                    src={performer.avatar}
                    alt={performer.name}
                    className="w-10 h-10 rounded-xl object-cover border border-purple-400/30 shrink-0"
                  />

                  {/* Name & Specialty */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {performer.name}
                      </h4>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30 truncate hidden sm:inline">
                        {rankColors.text}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {performer.specialty}
                    </div>
                  </div>
                </div>

                {/* Score & Accuracy */}
                <div className="text-right shrink-0">
                  <div className="text-sm font-display font-black text-white font-mono-num">
                    {performer.totalScore} pts
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono-num font-semibold">
                    {performer.accuracy}% ({performer.quizzesTaken} tests)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI-POWERED DYNAMIC MASTER COACH INSIGHTS (Feature 4 AI) */}
      <div className="p-4 sm:p-5 rounded-3xl glass-panel-glow border border-purple-500/35 space-y-3.5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF0055] to-[#8A2BE2] flex items-center justify-center shadow-[0_0_12px_#FF0055]">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm sm:text-base text-white">
                  Gemini AI Chief Analyst Insights
                </h3>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#FF0055] bg-red-950/60 px-2 py-0.5 rounded border border-[#FF0055]/30">
                  Real-Time AI
                </span>
              </div>
              <p className="text-[10px] text-purple-300/80">
                Cognitive telemetry breakdown & tactical advice to crack the Top 5
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              fetchAIInsights();
            }}
            disabled={isLoadingAI}
            className="p-1.5 rounded-xl bg-purple-950/50 text-slate-400 hover:text-white border border-purple-500/20 transition-all cursor-pointer disabled:opacity-40"
            title="Refresh AI Analysis"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingAI ? 'animate-spin text-[#FF0055]' : ''}`} />
          </button>
        </div>

        {aiInsights ? (
          <div className="space-y-3 text-xs">
            {/* Executive Summary */}
            <div className="p-3 rounded-2xl bg-[#0f0322]/80 border border-purple-500/20 text-slate-200 leading-relaxed">
              <span className="font-bold text-[#FF0055] mr-1">Current Meta:</span>
              {aiInsights.summary}
            </div>

            {/* Tactical Tips to Break into Top 5 */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#FF0055]" />
                <span>Tactical Directives for Aspiring Top 5 Candidates:</span>
              </span>
              <div className="grid grid-cols-1 gap-2">
                {aiInsights.tacticalTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-start gap-2.5 text-slate-300"
                  >
                    <span className="w-5 h-5 rounded-md bg-[#FF0055]/20 text-[#FF0055] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <span className="leading-snug text-[11px]">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coach Commentary */}
            <div className="pt-2 border-t border-purple-500/15 flex items-start gap-2 text-[11px] text-purple-300 italic">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
              <span>"{aiInsights.coachCommentary}"</span>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-purple-300 animate-pulse">
            Generating real-time AI strategic breakdown for Top 5...
          </div>
        )}
      </div>
    </div>
  );
};
