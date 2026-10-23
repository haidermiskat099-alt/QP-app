import { BroadcastAnnouncement, LeaderboardUser, Quiz, User, EducationalVideo, ChatMessage } from '../types';

export const AUTHORIZED_ADMINS: User[] = [
  {
    id: 'admin_1',
    fullName: 'Haider',
    phone: '01999999991',
    password: 'admin',
    role: 'admin',
    adminTitle: 'Owner',
    points: 10500,
    quizzesAttempted: 180,
    accuracy: 99.1,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    streakDays: 65,
    badge: 'Community Owner',
  },
  {
    id: 'admin_2',
    fullName: 'Aritra',
    phone: '01999999992',
    password: 'admin',
    role: 'admin',
    adminTitle: 'Co-founder',
    points: 9820,
    quizzesAttempted: 154,
    accuracy: 98.4,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    streakDays: 52,
    badge: 'Co-founder',
  },
  {
    id: 'admin_3',
    fullName: 'Ranbir',
    phone: '01999999993',
    password: 'admin',
    role: 'admin',
    adminTitle: 'CEO',
    points: 9640,
    quizzesAttempted: 146,
    accuracy: 97.8,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    streakDays: 48,
    badge: 'Chief Executive Officer',
  },
  {
    id: 'admin_4',
    fullName: 'Gentleman',
    phone: '01999999994',
    password: 'admin',
    role: 'admin',
    adminTitle: 'IT Head',
    points: 9750,
    quizzesAttempted: 160,
    accuracy: 98.9,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    streakDays: 58,
    badge: 'Head of IT & Architecture',
  },
];

export const INITIAL_STUDENTS: User[] = [
  {
    id: 'student_1',
    fullName: 'Tasmia Rahman',
    phone: '01711223344',
    password: '123',
    role: 'student',
    points: 4890,
    quizzesAttempted: 64,
    accuracy: 94.2,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    streakDays: 24,
    badge: 'Precision Striker',
  },
  {
    id: 'student_2',
    fullName: 'Shahriar Hossain',
    phone: '01811223344',
    password: '123',
    role: 'student',
    points: 4420,
    quizzesAttempted: 58,
    accuracy: 91.8,
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    streakDays: 18,
    badge: 'Rapid Solver',
  },
];

export const INITIAL_LEADERBOARD_TOP5: LeaderboardUser[] = [
  {
    rank: 1,
    id: 'lead_1',
    name: 'Nafis Chowdhury',
    phone: '017****8890',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    totalScore: 7850,
    accuracy: 98.6,
    quizzesTaken: 89,
    streakDays: 42,
    badge: 'Grandmaster #1',
    specialty: 'High-Speed BCS Reasoning',
  },
  {
    rank: 2,
    id: 'lead_2',
    name: 'Sumaiya Akhter',
    phone: '019****4412',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    totalScore: 7420,
    accuracy: 97.4,
    quizzesTaken: 84,
    streakDays: 36,
    badge: 'Diamond Titan',
    specialty: 'Medical Admission Biology',
  },
  {
    rank: 3,
    id: 'lead_3',
    name: 'Arifur Rahman Niloy',
    phone: '018****9931',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    totalScore: 7180,
    accuracy: 96.1,
    quizzesTaken: 79,
    streakDays: 29,
    badge: 'Ruby Sovereign',
    specialty: 'Physics & Mathematical Logic',
  },
  {
    rank: 4,
    id: 'lead_4',
    name: 'Maliha Jannat',
    phone: '016****7723',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    totalScore: 6940,
    accuracy: 95.8,
    quizzesTaken: 75,
    streakDays: 22,
    badge: 'Apex Contender',
    specialty: 'General Knowledge & Current Affairs',
  },
  {
    rank: 5,
    id: 'lead_5',
    name: 'Tanvir Hasan Shuvo',
    phone: '015****3310',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    totalScore: 6720,
    accuracy: 95.0,
    quizzesTaken: 71,
    streakDays: 20,
    badge: 'Emerald Prodigy',
    specialty: 'Chemistry & Organic Mechanisms',
  },
];

export const INITIAL_ANNOUNCEMENTS: BroadcastAnnouncement[] = [
  {
    id: 'bc_1',
    title: '⚡ Live Grand Quiz starts at 8:00 PM!',
    message: 'Prepare your speed and accuracy. 15 questions, 30s per question with -0.25 negative marking. Top 3 students will win verified QP Community Badges!',
    urgency: 'live_event',
    createdAt: 'Just now',
    authorName: 'Haider',
    authorRole: 'Owner',
    active: true,
  },
  {
    id: 'bc_2',
    title: '📢 Negative Marking Calibration Notice',
    message: 'Remember: negative marking is enabled for all live competitive battles. Skip questions if uncertain to safeguard your net score on the leaderboard!',
    urgency: 'academic',
    createdAt: '2 hours ago',
    authorName: 'Ranbir',
    authorRole: 'CEO',
    active: true,
  },
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz_live_1',
    title: 'BCS & Admission Grand Sprint: General Science & Logic',
    description: 'Challenging high-yield questions designed to test mental speed, scientific logic, and analytical elimination.',
    category: 'General Science & BCS',
    scheduledAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // currently LIVE!
    durationMinutes: 10,
    timeLimitPerQuestionSeconds: 30,
    negativeMarking: 0.25,
    autoNext: true,
    isLive: true,
    totalParticipants: 342,
    creatorName: 'Haider',
    creatorRole: 'Owner',
    status: 'live',
    questions: [
      {
        id: 'q1',
        question: 'Which electromagnetic radiation frequency range is utilized by atmospheric lidar systems for cloud aerosol backscatter profiling?',
        options: [
          '355 nm - 532 nm (Ultraviolet to Green Optical)',
          '10.6 µm (Far Infrared CO2 Laser)',
          '2.4 GHz (Microwave S-Band)',
          '15 kHz (Very Low Frequency Radio)'
        ],
        correctIndex: 0,
        explanation: 'Atmospheric lidars predominantly operate at harmonic Nd:YAG wavelengths (355nm UV, 532nm visible green, 1064nm IR) to exploit elastic Rayleigh and Mie scattering from air molecules and aerosol particles.'
      },
      {
        id: 'q2',
        question: 'Under standard Bangladesh Civil Service (BCS) negative marking rules (-0.25), what is your expected net mark if you eliminate 2 options and guess between the remaining 2?',
        options: [
          '-0.125 marks',
          '0.00 marks (Neutral)',
          '+0.375 marks (Statistically Positive)',
          '+0.500 marks'
        ],
        correctIndex: 2,
        explanation: 'Calculation: (0.5 chance × +1.0 mark) - (0.5 chance × 0.25 penalty) = +0.50 - 0.125 = +0.375 net expected value. It is mathematically advantageous to attempt!'
      },
      {
        id: 'q3',
        question: 'Which organelle is responsible for post-translational protein modification and glycosylation tag sorting in eukaryotic cells?',
        options: [
          'Ribosomal 80S subunit',
          'Golgi Apparatus cisternae',
          'Smooth Endoplasmic Reticulum',
          'Peroxisome matrix'
        ],
        correctIndex: 1,
        explanation: 'The Golgi apparatus modifies, sorts, and packages proteins received from the rough ER, adding mannose-6-phosphate or complex oligosaccharide tags.'
      },
      {
        id: 'q4',
        question: 'In digital micro-architecture, what technique executes instructions out-of-order while preserving in-order retirement to prevent pipeline stalls?',
        options: [
          'Tomasulo Algorithm with Reorder Buffer (ROB)',
          'Von Neumann Single-Bus Sequencer',
          'Static Huffman Microcode Branching',
          'Direct Cache Memory Paging'
        ],
        correctIndex: 0,
        explanation: 'Tomasulos algorithm with reservation stations and a Reorder Buffer (ROB) allows speculative out-of-order execution while guaranteeing in-order commitment.'
      },
      {
        id: 'q5',
        question: 'What is the SI unit of Magnetic Flux, and how is it related to Tesla?',
        options: [
          'Weber (Wb), where 1 Wb = 1 T·m²',
          'Henry (H), where 1 H = 1 T/A',
          'Gauss (G), where 1 G = 10⁴ T',
          'Siemens (S), where 1 S = 1 T·s'
        ],
        correctIndex: 0,
        explanation: 'The SI unit of magnetic flux is the Weber (Wb). By definition, 1 Weber is equal to one Tesla-square-meter (1 T·m²).'
      }
    ]
  },
  {
    id: 'quiz_sched_2',
    title: 'Night Owl Rapid Championship: Medical Admission Bio-Chem',
    description: 'Scheduled for tonight! Rapid fire 20-second per question pace testing organic mechanisms and human physiology.',
    category: 'Medical Admission',
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(), // 3 hours from now
    durationMinutes: 15,
    timeLimitPerQuestionSeconds: 20,
    negativeMarking: 0.25,
    autoNext: true,
    isLive: false,
    totalParticipants: 189,
    creatorName: 'Aritra',
    creatorRole: 'Co-founder',
    status: 'upcoming',
    questions: [
      {
        id: 'q201',
        question: 'Which enzyme catalyzes the committed rate-limiting step of human glycolysis?',
        options: [
          'Hexokinase I',
          'Phosphofructokinase-1 (PFK-1)',
          'Pyruvate Kinase',
          'Aldolase B'
        ],
        correctIndex: 1,
        explanation: 'PFK-1 catalyzes the phosphorylation of Fructose-6-phosphate to Fructose-1,6-bisphosphate, which is the primary regulatory checkpoint of glycolysis.'
      },
      {
        id: 'q202',
        question: 'What type of cell junction forms the impenetrable blood-brain barrier via claudin and occludin transmembrane proteins?',
        options: [
          'Tight Junctions (Zonula Occludens)',
          'Desmosomes (Macula Adherens)',
          'Gap Junctions (Connexons)',
          'Hemidesmosomes'
        ],
        correctIndex: 0,
        explanation: 'Zonula occludens (tight junctions) seal paracellular pathways between cerebral endothelial cells, forming the tight blood-brain barrier.'
      },
      {
        id: 'q203',
        question: 'Which cranial nerve transmits sensory parasympathetic afferents from the carotid sinus baroreceptors?',
        options: [
          'Glossopharyngeal Nerve (CN IX)',
          'Vagus Nerve (CN X)',
          'Hypoglossal Nerve (CN XII)',
          'Accessory Nerve (CN XI)'
        ],
        correctIndex: 0,
        explanation: 'Carotid sinus nerve (Hering nerve), a branch of CN IX (Glossopharyngeal), carries afferent signals from carotid sinus baroreceptors to the medulla.'
      },
      {
        id: 'q204',
        question: 'What is the principal organic buffer system in intracellular erythrocyte fluid?',
        options: [
          'Hemoglobin imidazole ring buffer',
          'Bicarbonate-carbonic acid system',
          'Phosphate buffer system',
          'Ammonium chloride conjugate'
        ],
        correctIndex: 0,
        explanation: 'Histidine residues on hemoglobin molecules have an imidazole ring pKa (~6.8) ideal for buffering H+ ions inside red blood cells.'
      }
    ]
  },
  {
    id: 'quiz_sched_3',
    title: 'National Elite Engineering: Physics & Calculus Blitz',
    description: 'Rotational dynamics, electrostatics, vector calculus, and wave optics for engineering aspirants.',
    category: 'Engineering Admission',
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // tomorrow
    durationMinutes: 20,
    timeLimitPerQuestionSeconds: 45,
    negativeMarking: 0.5,
    autoNext: false,
    isLive: false,
    totalParticipants: 512,
    creatorName: 'Gentleman',
    creatorRole: 'IT Head',
    status: 'upcoming',
    questions: [
      {
        id: 'q301',
        question: 'A solid cylinder and a thin spherical shell of equal mass and radius roll down an incline without slipping. Which reaches the bottom first?',
        options: [
          'Solid cylinder (smaller moment of inertia fraction 1/2 vs 2/3)',
          'Thin spherical shell (larger rotational inertia)',
          'Both reach simultaneously',
          'Depends on the angle of inclination'
        ],
        correctIndex: 0,
        explanation: 'Acceleration a = g sinθ / (1 + I/mR²). For a solid cylinder I/mR² = 0.5; for a spherical shell it is 0.67. Lower moment of inertia yields greater linear acceleration.'
      },
      {
        id: 'q302',
        question: 'What is the divergence of the magnetic field B according to Maxwell-Gauss law for magnetism?',
        options: [
          '∇ · B = 0 (No magnetic monopoles exist)',
          '∇ · B = μ₀ J',
          '∇ · B = -∂E/∂t',
          '∇ · B = ρ / ε₀'
        ],
        correctIndex: 0,
        explanation: '∇ · B = 0 implies magnetic flux lines are continuous closed loops; isolated magnetic charges (monopoles) do not exist in classical electromagnetism.'
      }
    ]
  }
];

// Curated Educational YouTube Videos for the In-App Educational Corner
export const INITIAL_EDUCATIONAL_VIDEOS: EducationalVideo[] = [
  {
    id: 'yt_1',
    title: 'BCS Preliminary General Science Masterclass: High Yield Topics',
    youtubeId: '4bW3_7yPj8M',
    instructor: 'QP Academic Faculty',
    category: 'General Science & BCS',
    duration: '24:18',
    views: '48K views',
    summary: 'Comprehensive analysis of optics, electromagnetic spectra, thermodynamics, and high-frequency exam questions.',
    keyPoints: [
      'Snell’s law and total internal reflection criteria',
      'Atmospheric scattering: Rayleigh vs Mie comparison',
      'Calculation shortcuts for focal lengths and power of lens'
    ],
    associatedQuizCategory: 'General Science & BCS'
  },
  {
    id: 'yt_2',
    title: 'Medical Admission Biology: Cell Structure, Genetics & Enzymes',
    youtubeId: '8Ilzbrh460s',
    instructor: 'Dr. Aritra & Medical Board',
    category: 'Medical Admission',
    duration: '32:45',
    views: '62K views',
    summary: 'Master the rate-limiting regulatory steps of glycolysis, Krebs cycle, and chromosome separation checkpoints.',
    keyPoints: [
      'PFK-1 allosteric regulation by ATP and AMP',
      'Mitotic spindle checkpoints & cyclin-CDK complexes',
      'Blood-brain barrier tight junction protein mechanisms'
    ],
    associatedQuizCategory: 'Medical Admission'
  },
  {
    id: 'yt_3',
    title: 'Engineering Physics Blitz: Rotational Dynamics & Moment of Inertia',
    youtubeId: 'h78P3e_w7Jg',
    instructor: 'Engr. Gentleman (IT Head)',
    category: 'Engineering Admission',
    duration: '28:10',
    views: '39K views',
    summary: 'Solve rolling motion without slipping down inclined planes using conservation of energy and torque balance.',
    keyPoints: [
      'Parallel axis theorem application shortcuts',
      'Angular momentum conservation under zero external torque',
      'Gyroscopic precession frequency calculation'
    ],
    associatedQuizCategory: 'Engineering Admission'
  },
  {
    id: 'yt_4',
    title: 'Negative Marking Elimination Tactics: How to Score Net +15 Marks',
    youtubeId: 'o1dM_8G_8Y4',
    instructor: 'Haider (Owner) & Ranbir (CEO)',
    category: 'Exam Strategy',
    duration: '18:50',
    views: '75K views',
    summary: 'The mathematical rationale behind 2-option elimination (+0.375 expected net value) and when to skip safely.',
    keyPoints: [
      'Mathematical proof of expected value with -0.25 penalty',
      'Recognizing deceptive distractor traps in admission papers',
      'Pacing discipline: the 30-second decision threshold'
    ],
    associatedQuizCategory: 'General Science & BCS'
  }
];

// Unified Single Community Chat Messages
export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    senderId: 'admin_1',
    senderName: 'Haider',
    senderRole: 'Owner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    text: 'Welcome to Question Practice Community! 🚀 The Live Sprint begins tonight. Make sure to review the negative marking guidelines.',
    timestamp: '7:45 PM',
    reactions: { '🔥': 14, '👏': 9, '🎯': 12 },
    badgeColor: '#FF0055'
  },
  {
    id: 'msg_2',
    senderId: 'admin_2',
    senderName: 'Aritra',
    senderRole: 'Co-founder',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    text: 'All Biology and Biochemistry question sets have been refreshed with verified rationales. Check the Educational Corner video for key topics!',
    timestamp: '7:48 PM',
    reactions: { '💡': 8, '❤️': 6 },
    badgeColor: '#8A2BE2'
  },
  {
    id: 'msg_3',
    senderId: 'admin_3',
    senderName: 'Ranbir',
    senderRole: 'CEO',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    text: 'Top 5 leaderboard performers this week will receive exclusive QP Community verified credentials. Keep up the consistency!',
    timestamp: '7:50 PM',
    reactions: { '🏆': 15, '⚡': 7 },
    badgeColor: '#ff007f'
  },
  {
    id: 'msg_4',
    senderId: 'admin_4',
    senderName: 'Gentleman',
    senderRole: 'IT Head',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    text: 'System latency is optimized to <12ms for the 30-second question timer. Circular countdown and instant feedback engine are active. Best of luck everyone!',
    timestamp: '7:52 PM',
    reactions: { '🚀': 11, '⚡': 9 },
    badgeColor: '#00e5ff'
  },
  {
    id: 'msg_5',
    senderId: 'student_1',
    senderName: 'Tasmia Rahman',
    senderRole: 'Student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    text: 'Question regarding Question 2: if I eliminate 2 options in a -0.25 quiz, is it always mathematically optimal to guess between the remaining two?',
    timestamp: '7:55 PM',
    reactions: { '❓': 5, '💡': 4 },
    isDoubt: true,
    badgeColor: '#c084fc'
  },
  {
    id: 'msg_6',
    senderId: 'lead_1',
    senderName: 'Nafis Chowdhury',
    senderRole: 'Student (Rank #1)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    text: '@Tasmia Yes! Your expected net score is (+1 * 0.5) - (0.25 * 0.5) = +0.375. Over 10 questions, that averages +3.75 net marks gain!',
    timestamp: '7:56 PM',
    reactions: { '🎯': 16, '🔥': 10 },
    badgeColor: '#fbbf24'
  }
];
