export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  password?: string;
  role: UserRole;
  adminTitle?: string;
  points: number;
  quizzesAttempted: number;
  accuracy: number;
  avatar: string;
  streakDays: number;
  badge?: string;
}

export interface Question {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  scheduledAt: string; // ISO date string
  durationMinutes: number;
  timeLimitPerQuestionSeconds: number;
  negativeMarking: number; // e.g. 0.25, 0.5, 0
  autoNext: boolean;
  questions: Question[];
  isLive: boolean;
  totalParticipants: number;
  creatorName: string;
  creatorRole: string;
  status: 'upcoming' | 'live' | 'completed';
}

export interface BroadcastAnnouncement {
  id: string;
  title: string;
  message: string;
  urgency: 'urgent' | 'live_event' | 'academic' | 'standard';
  createdAt: string;
  authorName: string;
  authorRole: string;
  active: boolean;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  phone: string;
  avatar: string;
  totalScore: number;
  accuracy: number;
  quizzesTaken: number;
  streakDays: number;
  badge: string;
  specialty: string;
}

export interface QuizResult {
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  accuracy: number;
  timeTakenSeconds: number;
  completedAt: string;
  userAnswers: {
    questionId: string;
    selectedIndex: number | null;
    correctIndex: number;
    isCorrect: boolean;
  }[];
}

// In-App YouTube Educational Corner Video
export interface EducationalVideo {
  id: string;
  title: string;
  youtubeId: string;
  instructor: string;
  category: string;
  duration: string;
  views: string;
  summary: string;
  keyPoints: string[];
  associatedQuizCategory?: string;
}

// Unified Single Community Chat Message
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string; // 'Owner' | 'Co-founder' | 'CEO' | 'IT Head' | 'Admin' | 'Student'
  avatar: string;
  text: string;
  timestamp: string;
  reactions?: { [emoji: string]: number };
  isDoubt?: boolean;
  badgeColor?: string;
}
