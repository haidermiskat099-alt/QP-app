import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  Award, 
  Flame, 
  AlertCircle,
  HelpCircle,
  Trophy,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Quiz, Question, QuizResult, User } from '../types';
import { sounds } from '../utils/audio';

interface StudentPracticeZoneProps {
  quiz: Quiz;
  currentUser: User | null;
  onExitQuiz: () => void;
  onSaveQuizResult?: (result: QuizResult) => void;
}

export const StudentPracticeZone: React.FC<StudentPracticeZoneProps> = ({
  quiz,
  currentUser,
  onExitQuiz,
  onSaveQuizResult,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(quiz.timeLimitPerQuestionSeconds || 30);
  const [userScore, setUserScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
  const [userAnswersHistory, setUserAnswersHistory] = useState<{
    questionId: string;
    selectedIndex: number | null;
    correctIndex: number;
    isCorrect: boolean;
  }[]>([]);
  const [startTime] = useState<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQ: Question | undefined = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const timeLimit = quiz.timeLimitPerQuestionSeconds || 30;

  // Question Timer Countdown
  useEffect(() => {
    if (isQuizComplete || isAnswered || !currentQ) return;

    setTimeLeft(timeLimit);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeExpire();
          return 0;
        }
        if (prev <= 5) {
          sounds.playTimerWarning();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex, isAnswered, isQuizComplete]);

  // Handle Question Timeout
  const handleTimeExpire = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(null);
    sounds.playWrong();

    const record = {
      questionId: currentQ?.id || '',
      selectedIndex: null,
      correctIndex: currentQ?.correctIndex ?? 0,
      isCorrect: false,
    };
    setUserAnswersHistory((prev) => [...prev, record]);

    if (quiz.autoNext) {
      setTimeout(() => {
        proceedToNextQuestion();
      }, 1500);
    }
  };

  // Option selection with instant green/red glow feedback
  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ?.correctIndex;

    if (isCorrect) {
      sounds.playCorrect();
      setUserScore((prev) => prev + 1.0);
      setCorrectCount((prev) => prev + 1);
    } else {
      sounds.playWrong();
      setUserScore((prev) => Math.max(0, prev - (quiz.negativeMarking || 0)));
      setWrongCount((prev) => prev + 1);
    }

    const record = {
      questionId: currentQ?.id || '',
      selectedIndex: index,
      correctIndex: currentQ?.correctIndex ?? 0,
      isCorrect,
    };
    setUserAnswersHistory((prev) => [...prev, record]);

    if (quiz.autoNext) {
      setTimeout(() => {
        proceedToNextQuestion();
      }, 1400);
    }
  };

  const proceedToNextQuestion = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(timeLimit);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsQuizComplete(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF0055', '#8A2BE2', '#00ffcc', '#ffffff'],
      });
    } catch {}

    const totalAnswered = correctCount + wrongCount;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    const result: QuizResult = {
      quizId: quiz.id,
      quizTitle: quiz.title,
      score: Math.max(0, parseFloat(userScore.toFixed(2))),
      totalQuestions,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      skippedAnswers: totalQuestions - (correctCount + wrongCount),
      accuracy,
      timeTakenSeconds: timeTaken,
      completedAt: new Date().toISOString(),
      userAnswers: userAnswersHistory,
    };

    if (onSaveQuizResult) {
      onSaveQuizResult(result);
    }
  };

  // Circular progress calculations
  const progressPercent = ((timeLimit - timeLeft) / timeLimit) * 100;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / timeLimit) * circumference;

  // Post-Quiz Victory Summary View
  if (isQuizComplete) {
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    return (
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center animate-fadeIn">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel-glow border border-purple-500/35 shadow-[0_0_60px_rgba(255,0,85,0.3)] space-y-5 text-center">
          {/* Trophy Header */}
          <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#FF0055] via-purple-600 to-[#8A2BE2] flex items-center justify-center shadow-[0_0_30px_#FF0055]">
            <Trophy className="w-10 h-10 text-white" />
            <Sparkles className="w-5 h-5 text-amber-300 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Practice Sprint Completed</span>
            </div>
            <h2 className="font-display font-black text-2xl text-white">
              Outstanding Effort!
            </h2>
            <p className="text-xs text-purple-200 mt-1">
              {quiz.title}
            </p>
          </div>

          {/* Performance Scorecard */}
          <div className="p-4 rounded-2xl bg-[#0e021a]/90 border border-purple-500/25 grid grid-cols-3 gap-2">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Net Score</div>
              <div className="text-2xl font-display font-black text-white font-mono-num mt-0.5">
                {userScore.toFixed(2)}
              </div>
              <div className="text-[9px] text-[#FF0055] font-semibold mt-0.5">
                -{quiz.negativeMarking} Penalty
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Accuracy</div>
              <div className="text-2xl font-display font-black text-emerald-400 font-mono-num mt-0.5">
                {accuracy}%
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">
                {correctCount} / {totalQuestions} Correct
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Time</div>
              <div className="text-2xl font-display font-black text-purple-300 font-mono-num mt-0.5">
                {Math.round((Date.now() - startTime) / 1000)}s
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">
                Avg {(Math.round((Date.now() - startTime) / 1000) / totalQuestions).toFixed(1)}s/Q
              </div>
            </div>
          </div>

          {/* AI Coach Instant Feedback */}
          <div className="p-3.5 rounded-2xl glass-panel-red border border-[#FF0055]/30 text-left space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF0055]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Coach Performance Appraisal:</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-relaxed">
              {accuracy >= 80 
                ? 'Mastery pace confirmed! Your reaction time is within the top 5% bracket of QP Community aspirants.' 
                : 'Good attempt! Focus on eliminating 2 obvious distractors before committing to safeguard against negative penalties.'}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => {
                sounds.playTap();
                // Retake
                setCurrentQuestionIndex(0);
                setSelectedOption(null);
                setIsAnswered(false);
                setUserScore(0);
                setCorrectCount(0);
                setWrongCount(0);
                setIsQuizComplete(false);
                setUserAnswersHistory([]);
              }}
              className="py-3 px-4 rounded-xl bg-purple-950/60 border border-purple-500/30 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-purple-900/60 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-purple-300" />
              <span>Retake Drill</span>
            </button>

            <button
              onClick={() => {
                sounds.playTap();
                onExitQuiz();
              }}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white font-bold text-xs shadow-[0_0_15px_rgba(255,0,85,0.4)] hover:shadow-[0_0_20px_rgba(255,0,85,0.7)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Back to Lobby</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Live Question Screen
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between animate-fadeIn">
      {/* Top HUD: Quiz Title, Circular Live Timer & Progress Bar */}
      <div className="space-y-3 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF0055] bg-red-950/60 px-2 py-0.5 rounded border border-[#FF0055]/30">
              Live Practice Engine
            </span>
            <h2 className="text-sm font-bold text-white truncate mt-1">
              {quiz.title}
            </h2>
          </div>

          {/* Circular SVG Countdown Timer */}
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 54 54">
              {/* Background circle */}
              <circle
                cx="27"
                cy="27"
                r={radius}
                className="stroke-purple-950/80"
                strokeWidth="4"
                fill="none"
              />
              {/* Animated countdown circle */}
              <circle
                cx="27"
                cy="27"
                r={radius}
                stroke={timeLeft <= 7 ? '#FF0055' : '#8A2BE2'}
                strokeWidth="4.5"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
                style={{
                  filter: timeLeft <= 7 ? 'drop-shadow(0 0 6px #FF0055)' : 'drop-shadow(0 0 4px #8A2BE2)',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-mono-num font-black text-sm ${timeLeft <= 7 ? 'text-[#FF0055] animate-pulse' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Linear Question Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
            <span>
              Question <span className="font-mono-num text-white">{currentQuestionIndex + 1}</span> of{' '}
              <span className="font-mono-num">{totalQuestions}</span>
            </span>
            <span className="text-[10px] text-purple-300 font-mono-num">
              Score: {userScore.toFixed(2)} pts (Pen. -{quiz.negativeMarking})
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-purple-950/60 overflow-hidden border border-purple-500/20">
            <div
              className="h-full bg-gradient-to-r from-[#FF0055] via-purple-500 to-[#8A2BE2] transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card & 4 Options */}
      {currentQ && (
        <div className="my-auto py-4 space-y-4">
          {/* Question Text Box */}
          <div className="p-4 sm:p-5 rounded-2xl glass-panel-glow border border-purple-500/30 shadow-[0_0_20px_rgba(138,43,226,0.15)]">
            <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* 4 Interactive Options with Instant Green/Red Glow Feedback */}
          <div className="space-y-2.5">
            {currentQ.options.map((optionText, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let cardStyle = 'bg-[#15062c]/80 border-purple-500/25 hover:border-purple-400 hover:bg-[#1a0836] text-slate-100';
              let badgeStyle = 'bg-purple-900/60 text-purple-200 border-purple-500/30';

              if (isAnswered) {
                if (isCorrect) {
                  // Instant Green Glow
                  cardStyle = 'bg-emerald-950/70 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]';
                  badgeStyle = 'bg-emerald-500 text-slate-950 font-bold border-emerald-400';
                } else if (isSelected && !isCorrect) {
                  // Instant Red Glow for incorrect selection
                  cardStyle = 'bg-red-950/70 border-[#FF0055] text-white shadow-[0_0_20px_rgba(255,0,85,0.5)]';
                  badgeStyle = 'bg-[#FF0055] text-white font-bold border-[#FF0055]';
                } else {
                  cardStyle = 'opacity-40 bg-[#120422]/60 border-purple-500/10 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-3.5 rounded-2xl border transition-all duration-200 text-left flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${cardStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 border ${badgeStyle}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-snug">
                      {optionText}
                    </span>
                  </div>

                  {/* Feedback Icon */}
                  {isAnswered && (
                    <div className="shrink-0">
                      {isCorrect ? (
                        <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-[10px] hidden sm:inline">+1.0</span>
                        </div>
                      ) : isSelected ? (
                        <div className="flex items-center gap-1 text-[#FF0055] font-bold text-xs">
                          <XCircle className="w-5 h-5" />
                          <span className="text-[10px] hidden sm:inline">-{quiz.negativeMarking}</span>
                        </div>
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Solution Explanation Box (Revealed upon answering) */}
          {isAnswered && currentQ.explanation && (
            <div className="p-3.5 rounded-2xl glass-panel-red border border-[#FF0055]/30 text-xs text-slate-200 animate-fadeIn space-y-1">
              <div className="font-bold text-[#FF0055] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Verified Solution Explanation:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="pt-3 border-t border-purple-500/20 flex items-center justify-between shrink-0">
        <button
          onClick={() => {
            sounds.playTap();
            onExitQuiz();
          }}
          className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          Abandon Sprint
        </button>

        {isAnswered && !quiz.autoNext && (
          <button
            onClick={() => {
              sounds.playTap();
              proceedToNextQuestion();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white text-xs font-bold shadow-[0_0_15px_rgba(255,0,85,0.4)] hover:shadow-[0_0_20px_rgba(255,0,85,0.7)] transition-all cursor-pointer"
          >
            <span>{currentQuestionIndex + 1 < totalQuestions ? 'Next Question' : 'Complete Sprint'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
