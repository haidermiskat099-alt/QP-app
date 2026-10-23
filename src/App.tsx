
import React, { useState, useEffect } from 'react';
import { AuraBackground } from './components/AuraBackground';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
import { TopStatusBar } from './components/TopStatusBar';
import { BottomTabBar, TabType } from './components/BottomTabBar';
import {
  BroadcastNotificationToast,
  BroadcastDrawerModal,
} from './components/BroadcastNotificationToast';
import { AuthModal } from './components/AuthModal';
import { HomeFeed } from './components/HomeFeed';
import { AdminPanel } from './components/AdminPanel';
import { QuizCreatorModal } from './components/QuizCreatorModal';
import { StudentPracticeZone } from './components/StudentPracticeZone';
import { TopLeaderboard } from './components/TopLeaderboard';
import { UserProfile } from './components/UserProfile';
import { SplashScreen } from './components/SplashScreen';
import { YouTubeEducationalCorner } from './components/YouTubeEducationalCorner';
import { CommunityChat } from './components/CommunityChat';

import {
  User,
  Quiz,
  BroadcastAnnouncement,
  LeaderboardUser,
  QuizResult,
} from './types';

import {
  INITIAL_QUIZZES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_LEADERBOARD_TOP5,
} from './data/initialData';

import { sounds } from './utils/audio';

export default function App() {
  // Splash Screen Intro State
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Start logged out. Authentication is handled by the backend login modal.
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [announcements, setAnnouncements] =
    useState<BroadcastAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [activeToastAnnouncement, setActiveToastAnnouncement] =
    useState<BroadcastAnnouncement | null>(null);
  const [leaderboard, setLeaderboard] =
    useState<LeaderboardUser[]>(INITIAL_LEADERBOARD_TOP5);
  const [recentQuizResults, setRecentQuizResults] = useState<QuizResult[]>([]);

  // Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isAnnouncementsDrawerOpen, setIsAnnouncementsDrawerOpen] =
    useState<boolean>(false);
  const [isQuizCreatorOpen, setIsQuizCreatorOpen] = useState<boolean>(false);

  // Active Quiz State
  const [activeQuizForStudent, setActiveQuizForStudent] =
    useState<Quiz | null>(null);

  // Automatic scheduled quiz heartbeat
  useEffect(() => {
    const schedulerInterval = setInterval(() => {
      const now = Date.now();

      setQuizzes((prevQuizzes) => {
        let hasStateChange = false;

        const updated = prevQuizzes.map((quiz) => {
          if (
            !quiz.isLive &&
            new Date(quiz.scheduledAt).getTime() <= now
          ) {
            hasStateChange = true;

            const autoSiren: BroadcastAnnouncement = {
              id: 'bc_auto_' + Date.now() + '_' + quiz.id,
              title: `🔥 AUTO-TRIGGERED LIVE QUIZ: "${quiz.title}"`,
              message: `The scheduled start time has arrived! The quiz is now officially LIVE with ${quiz.questions.length} questions. Participate now!`,
              urgency: 'live_event',
              createdAt: 'Just now',
              authorName: quiz.creatorName || 'Auto-Scheduler Engine',
              authorRole: quiz.creatorRole || 'Automated Precision System',
              active: true,
            };

            sounds.playBroadcastNotification();
            setActiveToastAnnouncement(autoSiren);
            setAnnouncements((prev) => [autoSiren, ...prev]);

            return {
              ...quiz,
              isLive: true,
              status: 'live' as const,
            };
          }

          return quiz;
        });

        return hasStateChange ? updated : prevQuizzes;
      });
    }, 2500);

    return () => clearInterval(schedulerInterval);
  }, []);

  // Open authentication modal
  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  // Called after the backend accepts login/signup
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);

    if (user.role !== 'admin' && activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  // Clear the local login session on logout
  const handleLogout = () => {
    sessionStorage.removeItem('qp_access_token');
    setCurrentUser(null);
    setActiveQuizForStudent(null);

    if (activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  const handleSendBroadcast = (newAnnouncement: BroadcastAnnouncement) => {
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    setActiveToastAnnouncement(newAnnouncement);
  };

  const handleSaveCreatedQuiz = (newQuiz: Quiz) => {
    setQuizzes((prev) => [newQuiz, ...prev]);

    const siren: BroadcastAnnouncement = {
      id: 'bc_' + Date.now(),
      title: `⚡ New Quiz Scheduled: "${newQuiz.title}"`,
      message: `${newQuiz.questions.length} questions, ${newQuiz.timeLimitPerQuestionSeconds}s pace with -${newQuiz.negativeMarking} penalty. Go to Quizzes!`,
      urgency: 'live_event',
      createdAt: 'Just now',
      authorName: currentUser?.fullName || 'QP Community',
      authorRole: currentUser?.adminTitle || 'Administrator',
      active: true,
    };

    handleSendBroadcast(siren);
  };

  const handleSaveImportedQuiz = (newQuiz: Quiz) => {
    setQuizzes((prev) => [newQuiz, ...prev]);

    if (newQuiz.isLive) {
      const siren: BroadcastAnnouncement = {
        id: 'bc_' + Date.now(),
        title: `🔥 Bulk Imported Quiz LIVE: "${newQuiz.title}"`,
        message: `${newQuiz.questions.length} questions live now! Jump in and test your speed.`,
        urgency: 'live_event',
        createdAt: 'Just now',
        authorName: currentUser?.fullName || 'QP Community',
        authorRole: currentUser?.adminTitle || 'Administrator',
        active: true,
      };

      handleSendBroadcast(siren);
    } else {
      const scheduledStr = new Date(newQuiz.scheduledAt).toLocaleTimeString(
        [],
        { hour: '2-digit', minute: '2-digit' }
      );

      const siren: BroadcastAnnouncement = {
        id: 'bc_' + Date.now(),
        title: `⏰ Auto-Scheduled Quiz: "${newQuiz.title}"`,
        message: `Set for auto-trigger at ${scheduledStr}. Will go live automatically!`,
        urgency: 'academic',
        createdAt: 'Just now',
        authorName: currentUser?.fullName || 'QP Community',
        authorRole: currentUser?.adminTitle || 'Administrator',
        active: true,
      };

      handleSendBroadcast(siren);
    }
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
  };

  const handleLaunchQuizImmediately = (quizId: string) => {
    setQuizzes((prev) =>
      prev.map((quiz) =>
        quiz.id === quizId
          ? { ...quiz, isLive: true, status: 'live' }
          : quiz
      )
    );

    const target = quizzes.find((quiz) => quiz.id === quizId);

    if (target) {
      const siren: BroadcastAnnouncement = {
        id: 'bc_' + Date.now(),
        title: `🔥 Quiz Now LIVE: "${target.title}"`,
        message:
          'The examination controller has launched the live battle! Tap Quizzes to participate.',
        urgency: 'live_event',
        createdAt: 'Just now',
        authorName: currentUser?.fullName || 'QP Community',
        authorRole: currentUser?.adminTitle || 'Administrator',
        active: true,
      };

      handleSendBroadcast(siren);
    }
  };

  const handleStartQuiz = (quiz: Quiz) => {
    sounds.playTap();
    setActiveQuizForStudent(quiz);
  };

  const handleExitQuiz = () => {
    setActiveQuizForStudent(null);
  };

  const handleSaveQuizResult = (result: QuizResult) => {
    setRecentQuizResults((prev) => [result, ...prev]);

    if (currentUser) {
      const newQuizzesCount = currentUser.quizzesAttempted + 1;
      const newPoints = currentUser.points + Math.round(result.score * 100);

      const updatedAccuracy = parseFloat(
        (
          (currentUser.accuracy * currentUser.quizzesAttempted +
            result.accuracy) /
          newQuizzesCount
        ).toFixed(1)
      );

      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              points: newPoints,
              quizzesAttempted: newQuizzesCount,
              accuracy: updatedAccuracy,
            }
          : null
      );
    }
  };

  const handleStartQuizOnTopic = (category: string) => {
    const matched =
      quizzes.find((quiz) =>
        quiz.category.toLowerCase().includes(category.toLowerCase())
      ) || quizzes[0];

    if (matched) {
      handleStartQuiz(matched);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="relative min-h-screen bg-[#0D021A] text-slate-100 font-sans">
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      <AuraBackground />

      <MobileFrameWrapper
        isAdmin={Boolean(isAdmin)}
        onAdminClick={() => {
          if (isAdmin) {
            setActiveTab('admin');
          } else {
            handleOpenAuth('login');
          }
        }}
      >
        <BroadcastNotificationToast
          announcement={activeToastAnnouncement}
          onDismiss={() => setActiveToastAnnouncement(null)}
          onOpenHistory={() => {
            setActiveToastAnnouncement(null);
            setIsAnnouncementsDrawerOpen(true);
          }}
        />

        <TopStatusBar
          user={currentUser}
          announcements={announcements}
          onOpenAnnouncements={() => setIsAnnouncementsDrawerOpen(true)}
          onOpenAuth={() => handleOpenAuth('login')}
          onOpenProfile={() => setActiveTab('profile')}
          onReplaySplash={() => setShowSplash(true)}
        />

        <div className="flex-1 flex flex-col overflow-hidden relative">
          {activeQuizForStudent ? (
            <StudentPracticeZone
              quiz={activeQuizForStudent}
              currentUser={currentUser}
              onExitQuiz={handleExitQuiz}
              onSaveQuizResult={handleSaveQuizResult}
            />
          ) : activeTab === 'home' ? (
            <HomeFeed
              quizzes={quizzes}
              announcements={announcements}
              onStartQuiz={handleStartQuiz}
              onOpenAnnouncements={() => setIsAnnouncementsDrawerOpen(true)}
              currentUser={currentUser}
              onOpenAuth={() => handleOpenAuth('login')}
              onOpenLeaderboard={() => setActiveTab('leaderboard')}
            />
          ) : activeTab === 'practice' ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 animate-fadeIn">
              <div className="p-4 rounded-3xl glass-panel-glow border border-purple-500/35">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF0055] bg-red-950/60 px-2 py-0.5 rounded border border-[#FF0055]/30">
                  Sprint Drill Zone
                </span>

                <h2 className="font-display font-black text-xl text-white mt-1">
                  Speed Question Practice
                </h2>

                <p className="text-xs text-purple-200 mt-1">
                  Choose a drill module below to test with active circular
                  countdown clocks & negative marks.
                </p>
              </div>

              <div className="space-y-3">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="p-4 rounded-2xl glass-panel border border-purple-500/25 hover:border-[#FF0055]/60 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-semibold text-purple-300 uppercase">
                          {quiz.category}
                        </span>

                        <h4 className="text-sm font-bold text-white mt-0.5">
                          {quiz.title}
                        </h4>
                      </div>

                      <span className="text-xs font-mono font-bold text-[#FF0055] px-2 py-0.5 rounded bg-red-950/60 border border-[#FF0055]/30">
                        {quiz.timeLimitPerQuestionSeconds}s/Q
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-purple-500/15">
                      <span>
                        {quiz.questions.length} MCQs · -{quiz.negativeMarking}{' '}
                        Penalty
                      </span>

                      <button
                        type="button"
                        onClick={() => handleStartQuiz(quiz)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white text-xs font-bold shadow-[0_0_10px_rgba(255,0,85,0.4)] hover:shadow-[0_0_15px_rgba(255,0,85,0.7)] cursor-pointer"
                      >
                        Start Drill
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'chat' ? (
            <CommunityChat
              currentUser={currentUser}
              onOpenAuth={() => handleOpenAuth('login')}
            />
          ) : activeTab === 'youtube' ? (
            <YouTubeEducationalCorner
              onStartQuizOnTopic={handleStartQuizOnTopic}
            />
          ) : activeTab === 'leaderboard' ? (
            <TopLeaderboard
              leaderboardData={leaderboard}
              onChallengePerformer={() => {
                if (quizzes.length > 0) {
                  handleStartQuiz(quizzes[0]);
                }
              }}
            />
          ) : activeTab === 'admin' ? (
            <AdminPanel
              currentUser={currentUser}
              onLoginAsAdmin={handleLoginSuccess}
              onSendBroadcast={handleSendBroadcast}
              onOpenQuizCreator={() => {
                if (currentUser?.role === 'admin') {
                  setIsQuizCreatorOpen(true);
                } else {
                  handleOpenAuth('login');
                }
              }}
              quizzes={quizzes}
              onLaunchQuizImmediately={handleLaunchQuizImmediately}
              onSaveImportedQuiz={handleSaveImportedQuiz}
              onDeleteQuiz={handleDeleteQuiz}
            />
          ) : (
            <UserProfile
              user={currentUser}
              onLogout={handleLogout}
              onOpenAuth={() => handleOpenAuth('login')}
              recentResults={recentQuizResults}
              onOpenAdminPanel={() => {
                if (isAdmin) {
                  setActiveTab('admin');
                } else {
                  handleOpenAuth('login');
                }
              }}
            />
          )}
        </div>

        {!activeQuizForStudent && (
          <BottomTabBar
            activeTab={activeTab}
            onChangeTab={(tab) => {
              if (tab === 'admin' && !isAdmin) {
                handleOpenAuth('login');
                return;
              }
              setActiveTab(tab);
            }}
            isAdmin={Boolean(isAdmin)}
          />
        )}
      </MobileFrameWrapper>

      <BroadcastDrawerModal
        isOpen={isAnnouncementsDrawerOpen}
        onClose={() => setIsAnnouncementsDrawerOpen(false)}
        announcements={announcements}
      />

      {isQuizCreatorOpen && currentUser?.role === 'admin' && (
        <QuizCreatorModal
          isOpen={isQuizCreatorOpen}
          onClose={() => setIsQuizCreatorOpen(false)}
          onSaveQuiz={handleSaveCreatedQuiz}
          currentUser={currentUser}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authMode}
      />
    </div>
  );
    }
    
