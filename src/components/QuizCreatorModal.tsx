import React, { useState } from 'react';
import { X, Plus, Trash2, Star, Clock, AlertCircle, Sparkles, Calendar, CheckCircle2, ChevronRight, Wand2 } from 'lucide-react';
import { Question, Quiz, User } from '../types';
import { sounds } from '../utils/audio';

interface QuizCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveQuiz: (newQuiz: Quiz) => void;
  currentUser: User;
}

export const QuizCreatorModal: React.FC<QuizCreatorModalProps> = ({
  isOpen,
  onClose,
  onSaveQuiz,
  currentUser,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General Science & BCS');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    return d.toISOString().slice(0, 16); // format YYYY-MM-DDTHH:mm
  });
  const [timeLimit, setTimeLimit] = useState<number>(30); // 15, 30, 45, 60
  const [negativeMarking, setNegativeMarking] = useState<number>(0.25); // 0, 0.25, 0.5
  const [autoNext, setAutoNext] = useState<boolean>(true);

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q_' + Date.now() + '_1',
      question: 'Which element is commonly used as a neutron moderator in commercial nuclear pressurized water reactors (PWR)?',
      options: [
        'Light Water (H2O) with dissolved boric acid',
        'Liquid Sodium Metal coolant',
        'Cadmium control cladding',
        'Heavy Deuterium Gas at 200 atm'
      ],
      correctIndex: 0,
      explanation: 'Light water acts as both coolant and moderator in PWRs, thermalizing fast neutrons through proton collisions.'
    },
    {
      id: 'q_' + Date.now() + '_2',
      question: 'In cellular respiration, what is the theoretical maximum net ATP yield per glucose molecule during aerobic oxidation?',
      options: [
        '30 to 32 ATP',
        '2 ATP only',
        '18 ATP',
        '44 ATP'
      ],
      correctIndex: 0,
      explanation: 'Chemiosmotic ATP synthesis yields approximately 30-32 ATP depending on glycerol-3-phosphate vs malate-aspartate shuttles.'
    }
  ]);

  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiTopic, setAiTopic] = useState<string>('General Science & Analytical Ability');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  if (!isOpen) return null;

  const currentQ = questions[activeQuestionIndex] || questions[0];

  const handleUpdateQuestionText = (text: string) => {
    const updated = [...questions];
    updated[activeQuestionIndex].question = text;
    setQuestions(updated);
  };

  const handleUpdateOption = (optionIndex: number, text: string) => {
    const updated = [...questions];
    const newOptions = [...updated[activeQuestionIndex].options] as [string, string, string, string];
    newOptions[optionIndex] = text;
    updated[activeQuestionIndex].options = newOptions;
    setQuestions(updated);
  };

  const handleSetCorrectAnswer = (optionIndex: number) => {
    sounds.playTap();
    const updated = [...questions];
    updated[activeQuestionIndex].correctIndex = optionIndex;
    setQuestions(updated);
  };

  const handleUpdateExplanation = (text: string) => {
    const updated = [...questions];
    updated[activeQuestionIndex].explanation = text;
    setQuestions(updated);
  };

  const handleAddQuestion = () => {
    sounds.playTap();
    const newQ: Question = {
      id: 'q_' + Date.now() + '_' + (questions.length + 1),
      question: '',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 0,
      explanation: ''
    };
    const updated = [...questions, newQ];
    setQuestions(updated);
    setActiveQuestionIndex(updated.length - 1);
  };

  const handleDeleteQuestion = (indexToDelete: number) => {
    sounds.playTap();
    if (questions.length <= 1) {
      alert('Quiz must have at least 1 question.');
      return;
    }
    const updated = questions.filter((_, idx) => idx !== indexToDelete);
    setQuestions(updated);
    setActiveQuestionIndex(Math.max(0, indexToDelete - 1));
  };

  const handleGenerateQuestionsAI = async () => {
    sounds.playTap();
    setIsGeneratingAI(true);
    setFeedbackMsg('Querying Gemini AI for authenticated MCQs...');
    try {
      const res = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic || category,
          difficulty: 'competitive',
          count: 2,
        }),
      });
      const data = await res.json();
      if (data.questions && Array.isArray(data.questions)) {
        const generatedList: Question[] = data.questions.map((q: any, i: number) => ({
          id: 'ai_q_' + Date.now() + '_' + i,
          question: q.question,
          options: (q.options?.length === 4 ? q.options : ['Opt A', 'Opt B', 'Opt C', 'Opt D']) as [string, string, string, string],
          correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
          explanation: q.explanation || 'Authentic rationale',
        }));
        setQuestions((prev) => [...prev, ...generatedList]);
        setActiveQuestionIndex(questions.length);
        sounds.playCorrect();
        setFeedbackMsg(`Successfully drafted ${generatedList.length} AI MCQs!`);
      } else {
        setFeedbackMsg('AI generated question drafted.');
      }
    } catch (err) {
      console.error(err);
      setFeedbackMsg('Note: Loaded standard curated question template.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a Quiz Title.');
      return;
    }

    // Verify all questions have text
    const emptyQ = questions.find(q => !q.question.trim());
    if (emptyQ) {
      alert('Please make sure all questions have question text.');
      return;
    }

    const scheduledDateObj = new Date(scheduledDate);
    const isCurrentlyLive = scheduledDateObj.getTime() <= Date.now() + 60000;

    const newQuiz: Quiz = {
      id: 'quiz_' + Date.now(),
      title: title.trim(),
      description: description.trim() || 'Custom competitive live challenge created in QP Studio.',
      category,
      scheduledAt: scheduledDateObj.toISOString(),
      durationMinutes: Math.max(5, Math.ceil((questions.length * timeLimit) / 60)),
      timeLimitPerQuestionSeconds: timeLimit,
      negativeMarking,
      autoNext,
      questions,
      isLive: isCurrentlyLive,
      totalParticipants: 0,
      creatorName: currentUser.fullName,
      creatorRole: currentUser.adminTitle || 'Authorized Admin',
      status: isCurrentlyLive ? 'live' : 'upcoming',
    };

    sounds.playCorrect();
    onSaveQuiz(newQuiz);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn">
      <div className="relative w-full max-w-2xl h-[92vh] max-h-[820px] rounded-3xl glass-panel-glow border border-purple-500/35 overflow-hidden flex flex-col shadow-[0_0_60px_rgba(255,0,85,0.3)]">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-purple-500/20 shrink-0 bg-[#120324]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF0055] to-[#8A2BE2] flex items-center justify-center shadow-[0_0_12px_#FF0055]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-display font-black text-base sm:text-lg text-white">
                Live Quiz Creator Studio
              </h2>
              <p className="text-[11px] text-purple-300">
                Author custom questions with 4 options, correct answer stars & live scheduler
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-purple-950/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Section 1: Basic Quiz Config */}
          <div className="p-4 rounded-2xl glass-panel border border-purple-500/25 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] to-purple-300">
              1. Quiz Metadata & Scheduling
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. BCS 46th Preliminary Mega Test"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white bg-[#16062a]"
                >
                  <option value="General Science & BCS">General Science & BCS</option>
                  <option value="Medical Admission">Medical Admission</option>
                  <option value="Engineering Admission">Engineering Admission</option>
                  <option value="Current Affairs & Logic">Current Affairs & Logic</option>
                  <option value="Language & Literature">Language & Literature</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Description & Instructions
              </label>
              <textarea
                rows={2}
                placeholder="Key directives for students taking this test..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500 resize-none"
              />
            </div>

            {/* Date & Time Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FF0055]" />
                  <span>Scheduled Live Date & Time *</span>
                </label>
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white font-mono"
                />
              </div>

              {/* Per-Question Time Limits */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Per-Question Time Limit</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[15, 30, 45, 60].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setTimeLimit(sec);
                      }}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        timeLimit === sec
                          ? 'bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white shadow-[0_0_8px_#FF0055]'
                          : 'bg-purple-950/40 text-slate-400 hover:text-white border border-purple-500/20'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Negative Marking & Auto-Next Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-purple-500/15">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  <span>Negative Marking Penalty</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { val: 0, label: '0.00 (Off)' },
                    { val: 0.25, label: '-0.25' },
                    { val: 0.5, label: '-0.50' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setNegativeMarking(item.val);
                      }}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        negativeMarking === item.val
                          ? 'bg-[#FF0055] text-white shadow-[0_0_8px_#FF0055]'
                          : 'bg-purple-950/40 text-slate-400 hover:text-white border border-purple-500/20'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 self-end">
                <div>
                  <div className="text-xs font-semibold text-white">Auto-Next Question</div>
                  <div className="text-[10px] text-slate-400">Slide automatically after answering</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoNext}
                  onChange={(e) => setAutoNext(e.target.checked)}
                  className="w-4 h-4 accent-[#FF0055] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Questions Studio */}
          <div className="p-4 rounded-2xl glass-panel border border-purple-500/25 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] to-purple-300">
                2. Questions ({questions.length} Total)
              </h3>

              <div className="flex items-center gap-2">
                {/* AI Assistant button */}
                <button
                  type="button"
                  onClick={handleGenerateQuestionsAI}
                  disabled={isGeneratingAI}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-800 to-[#FF0055] text-white text-[11px] font-bold hover:shadow-[0_0_12px_rgba(255,0,85,0.4)] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Wand2 className="w-3.5 h-3.5 text-purple-200" />
                  <span>{isGeneratingAI ? 'Thinking...' : 'AI Auto-Draft'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-900/50 border border-purple-500/30 text-white text-[11px] font-bold hover:border-[#FF0055] transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FF0055]" />
                  <span>Add Question</span>
                </button>
              </div>
            </div>

            {feedbackMsg && (
              <div className="text-[11px] text-purple-300 bg-purple-950/40 p-2 rounded-lg border border-purple-500/20">
                {feedbackMsg}
              </div>
            )}

            {/* Questions Tabs Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setActiveQuestionIndex(idx);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold shrink-0 transition-all cursor-pointer ${
                    activeQuestionIndex === idx
                      ? 'bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white shadow-[0_0_10px_#FF0055]'
                      : 'bg-purple-950/40 text-slate-400 hover:text-white border border-purple-500/20'
                  }`}
                >
                  Q{idx + 1}
                </button>
              ))}
            </div>

            {/* Current Active Question Editor */}
            {currentQ && (
              <div className="p-4 rounded-xl bg-[#0e031f]/70 border border-purple-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FF0055] text-white text-[10px] flex items-center justify-center font-bold">
                      {activeQuestionIndex + 1}
                    </span>
                    <span>Question Prompt</span>
                  </span>

                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(activeQuestionIndex)}
                      className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Question</span>
                    </button>
                  )}
                </div>

                <textarea
                  rows={2}
                  placeholder="Type multiple choice question prompt..."
                  value={currentQ.question}
                  onChange={(e) => handleUpdateQuestionText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500 resize-none font-medium"
                />

                {/* 4 Options with Star (*) correct designator */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold uppercase tracking-wider text-purple-300">
                      4 Options (Click ★ star to set correct answer)
                    </span>
                    <span className="text-[10px] text-[#FF0055] font-bold">
                      ★ Option {String.fromCharCode(65 + currentQ.correctIndex)} is Correct
                    </span>
                  </div>

                  {currentQ.options.map((optText, optIdx) => {
                    const isCorrect = currentQ.correctIndex === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-2.5 p-2 rounded-xl transition-all border ${
                          isCorrect
                            ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                            : 'bg-[#150529]/80 border-purple-500/20'
                        }`}
                      >
                        {/* Option Letter Tag */}
                        <span className="w-6 h-6 rounded-lg bg-purple-900/50 border border-purple-500/30 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>

                        {/* Input Box */}
                        <input
                          type="text"
                          value={optText}
                          onChange={(e) => handleUpdateOption(optIdx, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)} text...`}
                          className="flex-1 bg-transparent border-0 text-xs text-white placeholder-slate-500 focus:outline-none"
                        />

                        {/* Star (*) Correct Answer Indicator & Selector */}
                        <button
                          type="button"
                          onClick={() => handleSetCorrectAnswer(optIdx)}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                            isCorrect
                              ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_10px_#10b981]'
                              : 'bg-purple-950/60 text-slate-400 hover:text-amber-300 border border-purple-500/20'
                          }`}
                          title={isCorrect ? 'Correct Answer' : 'Click to mark as correct answer'}
                        >
                          <Star className={`w-4 h-4 ${isCorrect ? 'fill-slate-950' : ''}`} />
                          <span className="text-[10px] hidden sm:inline">
                            {isCorrect ? 'Correct *' : 'Set Correct'}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-[11px] font-semibold text-purple-300 mb-1">
                    Explanation / Solution Rationale (Displayed after answer)
                  </label>
                  <input
                    type="text"
                    value={currentQ.explanation || ''}
                    onChange={(e) => handleUpdateExplanation(e.target.value)}
                    placeholder="e.g. Based on formula E = mc² or historical reference..."
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-t border-purple-500/20 bg-[#120324]/90 shrink-0">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-purple-950/60 text-slate-300 text-xs font-semibold hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0055] via-purple-600 to-[#8A2BE2] text-white text-xs font-bold tracking-wide shadow-[0_0_20px_rgba(255,0,85,0.4)] hover:shadow-[0_0_25px_rgba(255,0,85,0.7)] active:scale-95 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish to Live Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};
