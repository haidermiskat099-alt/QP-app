import React, { useState, useEffect } from 'react';
import { AuraBackground } from './components/AuraBackground';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
import { TopStatusBar } from './components/TopStatusBar';
import { BottomTabBar, TabType } from './components/BottomTabBar';
import { BroadcastNotificationToast, BroadcastDrawerModal } from './components/BroadcastNotificationToast';
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
  QuizResult 
} from './types';
import { 
  AUTHORIZED_ADMINS, 
  INITIAL_QUIZZES, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_LEADERBOARD_TOP5 
} from './data/initialData';
import { sounds } from './utils/audio';

export default function App() {
  // Splash Screen Intro State (true on launch)
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Application State
  const [currentUser, setCurrentUser] = useState<User | null>(AUTHORIZED_ADMINS[0]); // Starts with Owner Haider active for instant review
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [announcements, setAnnouncements] = useState<BroadcastAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [activeToastAnnouncement, setActiveToastAnnouncement] = useState<BroadcastAnnouncement | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD_TOP5);
  const [recentQuizResults, setRecentQuizResults] = useState<QuizResult[]>([]);

  // Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isAnnouncementsDrawerOpen, setIsAnnouncementsDrawerOpen] = useState<boolean>(false);
  const [isQuizCreatorOpen, setIsQuizCreatorOpen] = useState<boolean>(false);

  // Active Quiz Play State
  const [activeQuizForStudent, setActiveQuizForStudent] = useState<Quiz | null>(null);

  // Automatic Background Auto-Scheduler Heartbeat:
  // Automatically triggers and runs live quizzes precisely at their scheduled timestamp without manual intervention
  useEffect(() => {
    const schedulerInterval = setInterval(() => {
      const now = Date.now();
      setQuizzes((prevQuizzes) => {
        let hasStateChange = false;
        const updated = prevQuizzes.map((quiz) => {
          if (!quiz.isLive && new Date(quiz.scheduledAt).getTime() <= now) {
            hasStateChange = true;
            // Fire official automated broadcast siren alert
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
            setAnnouncements((prevAnnouncements) => [autoSiren, ...prevAnnouncements]);

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

  // Handlers
  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role !== 'admin' && activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
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
      authorName: currentUser?.fullName || 'Haider',
      authorRole: currentUser?.adminTitle || 'Owner',
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
        authorName: currentUser?.fullName || 'Haider',
        authorRole: currentUser?.adminTitle || 'Owner',
        active: true,
      };
      handleSendBroadcast(siren);
    } else {
      const scheduledStr = new Date(newQuiz.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const siren: BroadcastAnnouncement = {
        id: 'bc_' + Date.now(),
        title: `⏰ Auto-Scheduled Quiz: "${newQuiz.title}"`,
        message: `Set for auto-trigger at ${scheduledStr}. Will go live automatically!`,
        urgency: 'academic',
        createdAt: 'Just now',
        authorName: currentUser?.fullName || 'Haider',
        authorRole: currentUser?.adminTitle || 'Owner',
        active: true,
      };
      handleSendBroadcast(siren);
    }
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
  };

  const handleLaunchQuizImmediately = (quizId: string) => {
    setQuizzes((prev) =>
      prev.map((q) => (q.id === quizId ? { ...q, isLive: true, status: 'live' } : q))
    );
    const target = quizzes.find((q) => q.id === quizId);
    if (target) {
      const siren: BroadcastAnnouncement = {
        id: 'bc_' + Date.now(),
        title: `🔥 Quiz Now LIVE: "${target.title}"`,
        message: 'The examination controller has launched the live battle! Tap Quizzes to participate.',
        urgency: 'live_event',
        createdAt: 'Just now',
        authorName: currentUser?.fullName || 'Haider',
        authorRole: currentUser?.adminTitle || 'Owner',
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
      const newPoints = currentUser.points + Math.round(result.score * 100);
      const newQuizzesCount = currentUser.quizzesAttempted + 1;
      const updatedAccuracy = parseFloat(
        ((currentUser.accuracy * currentUser.quizzesAttempted + result.accuracy) / newQuizzesCount).toFixed(1)
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
    const matched = quizzes.find((q) => q.category.toLowerCase().includes(category.toLowerCase())) || quizzes[0];
    if (matched) {
      handleStartQuiz(matched);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="relative min-h-screen bg-[#0D021A] text-slate-100 font-sans">
      {/* Splash Screen Intro Animation */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Dark Red-Purple Glassmorphism Aura Background */}
      <AuraBackground />

      {/* Mobile Simulation Frame / Responsive Canvas Wrapper */}
      <MobileFrameWrapper
        isAdmin={isAdmin}
        onAdminClick={() => setActiveTab('admin')}
      >
        {/* Real-time Broadcast Push Notification Toast */}
        <BroadcastNotificationToast
          announcement={activeToastAnnouncement}
          onDismiss={() => setActiveToastAnnouncement(null)}
          onOpenHistory={() => {
            setActiveToastAnnouncement(null);
            setIsAnnouncementsDrawerOpen(true);
          }}
        />

        {/* Top Mobile Status Bar (Clock, Telephony, Brand, Bell, Profile, Replay Splash) */}
        <TopStatusBar
          user={currentUser}
          announcements={announcements}
          onOpenAnnouncements={() => setIsAnnouncementsDrawerOpen(true)}
          onOpenAuth={() => handleOpenAuth('login')}
          onOpenProfile={() => setActiveTab('profile')}
          onReplaySplash={() => setShowSplash(true)}
        />

        {/* Active Content Body Router */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {activeQuizForStudent ? (
            /* Student Practice Zone ("Participate in Quiz") */
            <StudentPracticeZone
              quiz={activeQuizForStudent}
              currentUser={currentUser}
              onExitQuiz={handleExitQuiz}
              onSaveQuizResult={handleSaveQuizResult}
            />
          ) : activeTab === 'home' ? (
            /* Home Feed with Live Quizzes & Scheduled Queue */
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
            /* Instant Practice Engine / Drill Selector */
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 animate-fadeIn">
              <div className="p-4 rounded-3xl glass-panel-glow border border-purple-500/35">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF0055] bg-red-950/60 px-2 py-0.5 rounded border border-[#FF0055]/30">
                  Sprint Drill Zone
                </span>
                <h2 className="font-display font-black text-xl text-white mt-1">
                  Speed Question Practice
                </h2>
                <p className="text-xs text-purple-200 mt-1">
                  Choose a drill module below to test with active circular countdown clocks & negative marks.
                </p>
              </div>

              <div className="space-y-3">
                {quizzes.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl glass-panel border border-purple-500/25 hover:border-[#FF0055]/60 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-semibold text-purple-300 uppercase">
                          {q.category}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{q.title}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#FF0055] px-2 py-0.5 rounded bg-red-950/60 border border-[#FF0055]/30">
                        {q.timeLimitPerQuestionSeconds}s/Q
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-purple-500/15">
                      <span>{q.questions.length} MCQs · -{q.negativeMarking} Penalty</span>
                      <button
                        onClick={() => handleStartQuiz(q)}
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
            /* Unified Single Community Chat */
            <CommunityChat
              currentUser={currentUser}
              onOpenAuth={() => handleOpenAuth('login')}
            />
          ) : activeTab === 'youtube' ? (
            /* In-App YouTube Educational Corner */
            <YouTubeEducationalCorner
              onStartQuizOnTopic={handleStartQuizOnTopic}
            />
          ) : activeTab === 'leaderboard' ? (
            /* AI-Powered Dynamic Top 5 Leaderboard */
            <TopLeaderboard
              leaderboardData={leaderboard}
              onChallengePerformer={(performer) => {
                if (quizzes.length > 0) handleStartQuiz(quizzes[0]);
              }}
            />
          ) : activeTab === 'admin' ? (
            /* Secret Admin Panel with Bulk Import & Auto-Scheduling */
            <AdminPanel
              currentUser={currentUser}
              onLoginAsAdmin={(admin) => setCurrentUser(admin)}
              onSendBroadcast={handleSendBroadcast}
              onOpenQuizCreator={() => setIsQuizCreatorOpen(true)}
              quizzes={quizzes}
              onLaunchQuizImmediately={handleLaunchQuizImmediately}
              onSaveImportedQuiz={handleSaveImportedQuiz}
              onDeleteQuiz={handleDeleteQuiz}
            />
          ) : (
            /* User Profile & Performance Stats */
            <UserProfile
              user={currentUser}
              onLogout={handleLogout}
              onOpenAuth={() => handleOpenAuth('login')}
              recentResults={recentQuizResults}
              onOpenAdminPanel={() => setActiveTab('admin')}
            />
          )}
        </div>

        {/* Fixed Bottom Mobile Navigation Tab Bar */}
        {!activeQuizForStudent && (
          <BottomTabBar
            activeTab={activeTab}
            onChangeTab={(tab) => setActiveTab(tab)}
            isAdmin={isAdmin}
          />
        )}
      </MobileFrameWrapper>

      {/* Broadcast Announcements History Drawer */}
      <BroadcastDrawerModal
        isOpen={isAnnouncementsDrawerOpen}
        onClose={() => setIsAnnouncementsDrawerOpen(false)}
        announcements={announcements}
      />

      {/* Custom Scheduled Live Quiz Creator Studio (Single Question Mode) */}
      {isQuizCreatorOpen && currentUser && (
        <QuizCreatorModal
          isOpen={isQuizCreatorOpen}
          onClose={() => setIsQuizCreatorOpen(false)}
          onSaveQuiz={handleSaveCreatedQuiz}
          currentUser={currentUser}
        />
      )}

      {/* Custom Authentication Modal (No OTP, phone & password, glowing inputs) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authMode}
      />
    </div>
  );
}
