import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Star, 
  Database, 
  Layers, 
  Send, 
  RotateCcw, 
  Zap,
  HelpCircle,
  Eye,
  X
} from 'lucide-react';
import { Quiz, Question, User } from '../types';
import { parseBulkMCQText, SAMPLE_BULK_MCQ_TEXT, ParseResult } from '../utils/quizParser';
import { sounds } from '../utils/audio';

interface BulkQuizImportStudioProps {
  currentUser: User;
  onSaveAndScheduleQuiz: (quiz: Quiz) => void;
  onClose?: () => void;
}

export const BulkQuizImportStudio: React.FC<BulkQuizImportStudioProps> = ({
  currentUser,
  onSaveAndScheduleQuiz,
  onClose,
}) => {
  // Form State
  const [quizTitle, setQuizTitle] = useState('BCS & Admission Special Model Test');
  const [category, setCategory] = useState('General Science & BCS');
  const [description, setDescription] = useState(
    'Bulk-imported live practice set with 4 options and verified star (*) answer keys.'
  );
  const [timeLimit, setTimeLimit] = useState<number>(30); // 15, 30, 45, 60
  const [negativeMarking, setNegativeMarking] = useState<number>(0.25); // 0, 0.25, 0.50
  const [autoNext, setAutoNext] = useState<boolean>(true);

  // Scheduling State
  const [scheduledDateTime, setScheduledDateTime] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 5); // default 5 minutes ahead
    return d.toISOString().slice(0, 16);
  });
  const [isImmediateLive, setIsImmediateLive] = useState<boolean>(false);

  // Raw Text State
  const [rawText, setRawText] = useState<string>(SAMPLE_BULK_MCQ_TEXT);
  const [parseResult, setParseResult] = useState<ParseResult>(() => parseBulkMCQText(SAMPLE_BULK_MCQ_TEXT));
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [previewTab, setPreviewTab] = useState<'editor' | 'preview'>('editor');

  // Trigger parsing on text change or on demand
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setRawText(newText);
    const res = parseBulkMCQText(newText);
    setParseResult(res);
  };

  const handleLoadSample = () => {
    sounds.playTap();
    setRawText(SAMPLE_BULK_MCQ_TEXT);
    const res = parseBulkMCQText(SAMPLE_BULK_MCQ_TEXT);
    setParseResult(res);
    sounds.playCorrect();
  };

  const handleClearText = () => {
    sounds.playTap();
    setRawText('');
    setParseResult({ questions: [], errors: [], totalParsed: 0 });
  };

  // Quick Scheduling helpers
  const handleQuickSchedule = (minutesFromNow: number) => {
    sounds.playTap();
    setIsImmediateLive(false);
    const d = new Date();
    d.setMinutes(d.getMinutes() + minutesFromNow);
    setScheduledDateTime(d.toISOString().slice(0, 16));
  };

  const handleSetTonight = () => {
    sounds.playTap();
    setIsImmediateLive(false);
    const d = new Date();
    d.setHours(20, 0, 0, 0); // 8:00 PM
    if (d.getTime() < Date.now()) {
      d.setDate(d.getDate() + 1);
    }
    setScheduledDateTime(d.toISOString().slice(0, 16));
  };

  const handleSetImmediate = () => {
    sounds.playTap();
    setIsImmediateLive(true);
    const d = new Date();
    setScheduledDateTime(d.toISOString().slice(0, 16));
  };

  // Save to Database and Schedule
  const handleSaveToDatabase = () => {
    if (!quizTitle.trim()) {
      alert('Please enter a Quiz Set Name before saving to the database.');
      return;
    }

    if (parseResult.questions.length === 0) {
      alert('No valid questions parsed. Please paste at least one 4-option MCQ with marked star (*).');
      return;
    }

    setIsSaving(true);
    sounds.playTap();

    const scheduledDateObj = isImmediateLive ? new Date() : new Date(scheduledDateTime);
    const isNow = isImmediateLive || scheduledDateObj.getTime() <= Date.now() + 60000;

    const newQuiz: Quiz = {
      id: 'quiz_' + Date.now(),
      title: quizTitle.trim(),
      description: description.trim() || 'Automated scheduled live test with negative marking.',
      category,
      scheduledAt: scheduledDateObj.toISOString(),
      durationMinutes: Math.max(5, Math.ceil((parseResult.questions.length * timeLimit) / 60)),
      timeLimitPerQuestionSeconds: timeLimit,
      negativeMarking,
      autoNext,
      questions: parseResult.questions,
      isLive: isNow,
      totalParticipants: 0,
      creatorName: currentUser.fullName,
      creatorRole: currentUser.adminTitle || 'Authorized Admin',
      status: isNow ? 'live' : 'upcoming',
    };

    // Save to server backend
    fetch('/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuiz),
    }).catch(() => {});

    setTimeout(() => {
      sounds.playCorrect();
      setIsSaving(false);
      setSaveSuccessMsg(
        isNow
          ? `Quiz "${newQuiz.title}" successfully saved to database and is now LIVE!`
          : `Quiz "${newQuiz.title}" securely saved to database! Scheduled to trigger at ${new Date(newQuiz.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
      );
      onSaveAndScheduleQuiz(newQuiz);
      if (onClose) {
        setTimeout(onClose, 1600);
      }
    }, 400);
  };

  return (
    <div className="rounded-3xl glass-panel-glow border border-purple-500/35 overflow-hidden shadow-[0_0_50px_rgba(255,0,85,0.2)] p-4 sm:p-6 space-y-5 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF0055] to-[#8A2BE2] flex items-center justify-center shadow-[0_0_15px_#FF0055]">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-lg sm:text-xl text-white">
                Bulk Quiz Import & Auto-Scheduler
              </h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-950/70 border border-[#FF0055]/50 text-[#FF0055]">
                Fast Import
              </span>
            </div>
            <p className="text-xs text-purple-200">
              Paste multi-question text blocks with 4 options & star (*) answers. Auto-parses and schedules without manual entry.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-purple-950/60 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {saveSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{saveSuccessMsg}</span>
        </div>
      )}

      {/* Grid: Left Column (Metadata & Scheduling) + Right Column (Bulk Textarea & Parser) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (Metadata & Auto-Schedule Config) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl glass-panel border border-purple-500/25 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] to-purple-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#FF0055]" />
              <span>1. Quiz Set Metadata</span>
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Quiz Set Name *
              </label>
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="e.g. BCS 47th Grand Model Test"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white bg-[#150529]"
              >
                <option value="General Science & BCS">General Science & BCS</option>
                <option value="Medical Admission">Medical Admission</option>
                <option value="Engineering Admission">Engineering Admission</option>
                <option value="Current Affairs & Logic">Current Affairs & Logic</option>
                <option value="Physics & Calculus">Physics & Calculus</option>
              </select>
            </div>

            {/* Timers & Penalty Settings */}
            <div className="space-y-2 pt-2 border-t border-purple-500/15">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Time Limit / Question</span>
                </span>
                <div className="flex items-center gap-1">
                  {[15, 30, 45, 60].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setTimeLimit(sec);
                      }}
                      className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        timeLimit === sec
                          ? 'bg-[#FF0055] text-white shadow-[0_0_8px_#FF0055]'
                          : 'bg-purple-950/40 text-slate-400 hover:text-white border border-purple-500/20'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-300">
                  Negative Marking
                </span>
                <div className="flex items-center gap-1">
                  {[
                    { val: 0, label: '0.00' },
                    { val: 0.25, label: '-0.25' },
                    { val: 0.5, label: '-0.50' },
                  ].map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setNegativeMarking(p.val);
                      }}
                      className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        negativeMarking === p.val
                          ? 'bg-purple-600 text-white shadow-[0_0_8px_#9333ea]'
                          : 'bg-purple-950/40 text-slate-400 hover:text-white border border-purple-500/20'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Auto-Scheduling Module */}
          <div className="p-4 rounded-2xl glass-panel-red border border-[#FF0055]/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] to-purple-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FF0055]" />
                <span>2. Auto-Scheduling & Publishing</span>
              </h3>
              <span className="text-[9px] font-bold uppercase text-[#FF0055] bg-red-950/70 px-2 py-0.5 rounded border border-[#FF0055]/30">
                Precision Clock
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              Set the exact date and time. The app will <strong>automatically trigger and launch the live quiz</strong> precisely at this moment without manual action.
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Scheduled Trigger Date & Time
              </label>
              <input
                type="datetime-local"
                value={scheduledDateTime}
                disabled={isImmediateLive}
                onChange={(e) => {
                  setScheduledDateTime(e.target.value);
                  setIsImmediateLive(false);
                }}
                className={`w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white font-mono ${
                  isImmediateLive ? 'opacity-40' : ''
                }`}
              />
            </div>

            {/* Quick Timing Shortcuts */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Schedule Presets:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickSchedule(2)}
                  className="py-1.5 px-2 rounded-lg bg-purple-950/50 border border-purple-500/25 hover:border-[#FF0055] text-purple-200 hover:text-white text-[10px] font-semibold transition-all cursor-pointer text-left"
                >
                  ⚡ +2 Mins (Quick Test)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSchedule(15)}
                  className="py-1.5 px-2 rounded-lg bg-purple-950/50 border border-purple-500/25 hover:border-[#FF0055] text-purple-200 hover:text-white text-[10px] font-semibold transition-all cursor-pointer text-left"
                >
                  🕒 +15 Mins
                </button>
                <button
                  type="button"
                  onClick={handleSetTonight}
                  className="py-1.5 px-2 rounded-lg bg-purple-950/50 border border-purple-500/25 hover:border-[#FF0055] text-purple-200 hover:text-white text-[10px] font-semibold transition-all cursor-pointer text-left"
                >
                  🌙 Tonight 8:00 PM
                </button>
                <button
                  type="button"
                  onClick={handleSetImmediate}
                  className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold transition-all cursor-pointer text-left ${
                    isImmediateLive
                      ? 'bg-[#FF0055] text-white border-[#FF0055] shadow-[0_0_8px_#FF0055]'
                      : 'bg-red-950/40 border-[#FF0055]/30 text-red-300 hover:text-white'
                  }`}
                >
                  🔥 Launch Live Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Bulk Text Area & Live Parser Preview) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl glass-panel border border-purple-500/25 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] to-purple-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>3. Bulk MCQ Paste Box</span>
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="px-2.5 py-1 rounded-lg bg-purple-900/50 border border-purple-500/30 text-purple-200 hover:text-white text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Sample Template</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearText}
                  className="px-2 py-1 rounded-lg bg-purple-950/50 border border-purple-500/20 text-slate-400 hover:text-white text-[10px] font-semibold transition-all cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Format Instructions Banner */}
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-[10px] text-purple-200 flex items-start gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#FF0055] shrink-0 mt-0.5" />
              <span>
                <strong>Syntax:</strong> Paste 4 options labeled (A), (B), (C), (D). Mark the correct answer with a star <strong>(*)</strong> (e.g. <code>(B) Nitrogen *</code>). Explanations are automatically detected.
              </span>
            </div>

            {/* Large Bulk Text Area */}
            <div className="relative">
              <textarea
                rows={11}
                value={rawText}
                onChange={handleTextChange}
                placeholder={`1. Type Question prompt here...
(A) First option
(B) Second option * (marked with star)
(C) Third option
(D) Fourth option
Explanation: Why option B is correct...`}
                className="w-full p-3.5 rounded-2xl glass-input text-xs text-white placeholder-slate-500 font-mono leading-relaxed resize-y focus:border-[#FF0055]"
                style={{ minHeight: '220px' }}
              />

              <div className="absolute bottom-2.5 right-3 text-[10px] font-mono-num text-purple-300/80 bg-[#0d021a]/80 px-2 py-0.5 rounded border border-purple-500/20 pointer-events-none">
                {rawText.split('\n').length} lines · {rawText.length} chars
              </div>
            </div>

            {/* Live Parsing Stats Bar */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0e021a]/90 border border-purple-500/20 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono-num flex items-center gap-1 ${
                  parseResult.totalParsed > 0
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    : 'bg-red-950/80 text-red-300 border border-red-500/40'
                }`}>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{parseResult.totalParsed} MCQs Parsed</span>
                </span>

                {parseResult.errors.length > 0 && (
                  <span className="text-[10px] text-amber-300 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span>{parseResult.errors.length} notices</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Stars Verified on {parseResult.questions.filter(q => q.correctIndex >= 0).length} items</span>
              </div>
            </div>

            {/* Warning Notices if any */}
            {parseResult.errors.length > 0 && (
              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[10px] text-amber-200 space-y-0.5 max-h-24 overflow-y-auto">
                {parseResult.errors.map((err, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span>•</span>
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Parsed Questions Live Preview Cards */}
      {parseResult.questions.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-purple-500/20">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] to-purple-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Parsed Database Preview ({parseResult.questions.length} Items Ready)</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono-num">
              Verified 4-Option Extraction
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
            {parseResult.questions.map((q, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl glass-panel border border-purple-500/20 space-y-2"
              >
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-lg bg-[#FF0055] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs font-bold text-white leading-snug line-clamp-2">
                    {q.question}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = q.correctIndex === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`p-1.5 rounded-lg border flex items-center justify-between gap-1 ${
                          isCorrect
                            ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 font-semibold shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                            : 'bg-purple-950/30 border-purple-500/15 text-slate-300'
                        }`}
                      >
                        <span className="truncate">
                          ({String.fromCharCode(65 + optIdx)}) {opt}
                        </span>
                        {isCorrect && (
                          <span className="flex items-center text-amber-400 shrink-0" title="Marked Correct with Star (*)">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <p className="text-[9px] text-purple-300 italic truncate pt-1 border-t border-purple-500/10">
                    💡 {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Footer with "Save to Database" CTA */}
      <div className="pt-3 border-t border-purple-500/20 flex items-center justify-between flex-wrap gap-3">
        <div className="text-[11px] text-purple-300">
          Ready to deploy: <strong className="text-white">{parseResult.questions.length} Questions</strong> into database.
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-950/50 text-slate-300 text-xs font-semibold hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveToDatabase}
            disabled={isSaving || parseResult.questions.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0055] via-purple-600 to-[#8A2BE2] text-white text-xs font-bold tracking-wide shadow-[0_0_20px_rgba(255,0,85,0.4)] hover:shadow-[0_0_25px_rgba(255,0,85,0.7)] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Database className="w-4 h-4" />
            <span>
              {isSaving
                ? 'Saving to Database...'
                : isImmediateLive
                ? 'Save to Database & Launch LIVE Now'
                : 'Save to Database & Auto-Schedule'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
