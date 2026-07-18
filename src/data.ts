import { DiagnosticQuestion, Student, Badge, Lesson, TeacherClassroom, ChatMessage } from "./types";

export const DIAG_QUESTIONS: DiagnosticQuestion[] = [
  // READING COMPREHENSION
  {
    id: "r1",
    subject: "reading",
    passage: "Yesterday, Kofi went to the market with his mother. They bought fruits, vegetables, and rice. On their way home, it started to rain heavily, so they took shelter under a big tree until the rain stopped.",
    question: "What happened first?",
    options: [
      "It started to rain.",
      "Kofi went to the market.",
      "They bought rice.",
      "They took shelter."
    ],
    correctIndex: 1
  },
  {
    id: "r2",
    subject: "reading",
    passage: "Amara has a little fluffy dog named Bingo. Bingo loves to chase squirrels in the park. One afternoon, Bingo saw a big brown squirrel and ran after it, barking loudly. Amara had to run fast to catch him.",
    question: "Why did Bingo bark loudly?",
    options: [
      "He wanted some treats.",
      "He saw Amara running.",
      "He saw a big brown squirrel.",
      "He was scared of the park."
    ],
    correctIndex: 2
  },
  // VOCABULARY
  {
    id: "v1",
    subject: "vocabulary",
    question: "Which word means the same as 'huge'?",
    options: [
      "Tiny",
      "Enormous",
      "Shiny",
      "Heavy"
    ],
    correctIndex: 1
  },
  {
    id: "v2",
    subject: "vocabulary",
    question: "The teacher was pleased with Kwabena's homework. What does 'pleased' mean in this sentence?",
    options: [
      "Happy and satisfied",
      "Angry and disappointed",
      "Tired and sleepy",
      "Confused"
    ],
    correctIndex: 0
  },
  // NUMERACY
  {
    id: "n1",
    subject: "numeracy",
    question: "Look at this sequence: 3, 6, 9, 12, __. What number comes next?",
    options: [
      "13",
      "14",
      "15",
      "18"
    ],
    correctIndex: 2
  },
  {
    id: "n2",
    subject: "numeracy",
    question: "Esi has 4 baskets. Each basket has 5 red apples. How many apples does she have in total?",
    options: [
      "9 apples",
      "15 apples",
      "20 apples",
      "25 apples"
    ],
    correctIndex: 2
  },
  // CRITICAL THINKING
  {
    id: "c1",
    subject: "critical_thinking",
    question: "All birds have wings. A parrot is a bird. Therefore...",
    options: [
      "A parrot cannot run.",
      "A parrot has wings.",
      "A parrot has blue wings only.",
      "All winged creatures are parrots."
    ],
    correctIndex: 1
  },
  {
    id: "c2",
    subject: "critical_thinking",
    question: "If a blue box is heavier than a red box, and the red box is heavier than a yellow box, which box is the lightest?",
    options: [
      "Blue box",
      "Red box",
      "Yellow box",
      "They are all equal weight"
    ],
    correctIndex: 2
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: "b1",
    title: "Reading Hero",
    description: "Read 10 interactive stories with 100% accuracy.",
    icon: "BookOpen",
    unlocked: true,
    dateUnlocked: "May 12, 2026",
    xpValue: 200
  },
  {
    id: "b2",
    title: "7-Day Streak",
    description: "Complete lessons for 7 days in a row.",
    icon: "Flame",
    unlocked: true,
    dateUnlocked: "May 10, 2026",
    xpValue: 300
  },
  {
    id: "b3",
    title: "Vocabulary Champion",
    description: "Learn 50 new words and ace their quizzes.",
    icon: "Award",
    unlocked: false,
    xpValue: 150
  },
  {
    id: "b4",
    title: "Confidence Builder",
    description: "Complete 5 diagnostics with positive improvement.",
    icon: "ShieldAlert",
    unlocked: false,
    xpValue: 250
  }
];

export const SAMPLE_LESSONS: Lesson[] = [
  {
    id: "l1",
    title: "The Wise Turtle and the Monkey",
    description: "An engaging folk story that helps improve reading comprehension and inference skills.",
    category: "reading",
    type: "story",
    durationMinutes: 15,
    completed: false,
    content: `Once upon a time in a lush green forest, there lived a Wise Turtle named Tutu. Tutu was slow, but he was very smart and observed everything around him. In the same forest lived a playful monkey named Momo, who loved to play tricks on other animals. One sunny afternoon, Momo challenged Tutu to a food gathering contest. Momo gathered fruits quickly but ate half of them. Tutu gathered slowly but saved every single berry. When winter came, Momo had no food left, while Tutu had a cozy stash of delicious berries. Momo learned that patience and planning are better than quick tricks.`,
    interactivePrompt: "Can you explain the moral of the story to Tutu?"
  },
  {
    id: "l2",
    title: "Listen & Repeat: Phonics Fun",
    description: "Learn essential sound blendings and speak them clearly into the assistant.",
    category: "vocabulary",
    type: "audio",
    durationMinutes: 10,
    completed: true,
    content: "Today, we are practicing the 'sh' and 'ch' sounds. Listen carefully: 'Sh' in 'ship', 'ch' in 'chip'. Repeat after the assistant: 'The shiny ship carried chocolate chips across the choppy ocean.'",
    interactivePrompt: "Speak now: 'The shiny ship carried chocolate chips.'"
  },
  {
    id: "l3",
    title: "Vocabulary Quest: Synonyms Match",
    description: "Solve matching card games to expand your active vocabulary database.",
    category: "vocabulary",
    type: "game",
    durationMinutes: 12,
    completed: false,
    content: "Match the word to its correct meaning. 'Vibrant' means colorful and full of energy. 'Cozy' means warm, comfortable and safe. 'Grateful' means showing appreciation for kindness.",
    interactivePrompt: "Which of these words means warm and comfortable?"
  },
  {
    id: "l4",
    title: "Number Puzzle: Addition Magic",
    description: "Use blocks and spatial reasoning to solve quick additions and pattern completions.",
    category: "numeracy",
    type: "game",
    durationMinutes: 10,
    completed: false,
    content: "Let's learn visual addition! Imagine you have 3 baskets of 4 marbles each, and you add 2 more marbles. Let's count them step-by-step: 3 x 4 = 12. 12 + 2 = 14.",
    interactivePrompt: "If you have 4 baskets of 3 marbles, how many do you have?"
  },
  {
    id: "l5",
    title: "Inference Detective Quiz",
    description: "Put on your detective hat and solve logical reading mysteries using hidden clues.",
    category: "critical_thinking",
    type: "quiz",
    durationMinutes: 10,
    completed: false,
    content: "Clue 1: The ground is wet. Clue 2: People are opening their umbrellas. Clue 3: There is a pitter-patter sound on the tin roof. Detective Question: What is happening outside?",
    interactivePrompt: "What can you infer is happening?"
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "s1",
    name: "Ama Boateng",
    grade: "Form 1 - Blue",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    streak: 12,
    xp: 1250,
    coins: 450,
    level: 5,
    assessed: true,
    weeklyProgress: [55, 60, 68, 72],
    gapReport: {
      scores: {
        reading: 85,
        vocabulary: 40,
        critical_thinking: 50,
        numeracy: 90
      },
      riskLevel: "Medium",
      confidenceScore: 72,
      strengths: ["Numeracy (Pattern Matching)", "Reading Fluency & Speed"],
      weaknesses: ["Vocabulary Range", "Inference & Context Extraction"],
      recommendations: [
        "Interactive reading focus: Spend 15 minutes daily on stories that contain unfamiliar adjectives.",
        "Vocabulary matching card exercises.",
        "Context extraction Q&A with the AI tutor twice a week."
      ],
      estimatedImprovementWeeks: 3
    },
    lessons: [...SAMPLE_LESSONS],
    badges: [...INITIAL_BADGES]
  },
  {
    id: "s2",
    name: "Kofi Mensah",
    grade: "Form 1 - Red",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    streak: 3,
    xp: 450,
    coins: 120,
    level: 2,
    assessed: true,
    weeklyProgress: [40, 42, 45, 48],
    gapReport: {
      scores: {
        reading: 30,
        vocabulary: 35,
        critical_thinking: 40,
        numeracy: 60
      },
      riskLevel: "High",
      confidenceScore: 48,
      strengths: ["Numeracy (Visual Math)"],
      weaknesses: ["Reading Comprehension", "Vocabulary Building", "Logical Inference"],
      recommendations: [
        "Urgent: Phonics sound tutoring 3 times a week.",
        "Parent-child reading exercises of simple 1-paragraph stories.",
        "Daily vocabulary review with flashcards."
      ],
      estimatedImprovementWeeks: 6
    },
    lessons: [
      { ...SAMPLE_LESSONS[0], completed: false },
      { ...SAMPLE_LESSONS[1], completed: false },
      { ...SAMPLE_LESSONS[2], completed: false },
      { ...SAMPLE_LESSONS[3], completed: false },
      { ...SAMPLE_LESSONS[4], completed: false }
    ],
    badges: [
      { ...INITIAL_BADGES[0], unlocked: false },
      { ...INITIAL_BADGES[1], unlocked: false },
      { ...INITIAL_BADGES[2], unlocked: false },
      { ...INITIAL_BADGES[3], unlocked: false }
    ]
  },
  {
    id: "s3",
    name: "Abena Darko",
    grade: "Form 1 - Blue",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    streak: 0,
    xp: 220,
    coins: 50,
    level: 1,
    assessed: true,
    weeklyProgress: [32, 35, 38, 41],
    gapReport: {
      scores: {
        reading: 45,
        vocabulary: 50,
        critical_thinking: 35,
        numeracy: 40
      },
      riskLevel: "High",
      confidenceScore: 41,
      strengths: ["Vocabulary Comprehension"],
      weaknesses: ["Numeracy", "Logical Reasoning", "Sentence Structure"],
      recommendations: [
        "Spend 10 minutes a day on basic addition exercises.",
        "Critical thinking games: Sequence puzzle solving.",
        "Sentence building blocks interactive lessons."
      ],
      estimatedImprovementWeeks: 5
    },
    lessons: [...SAMPLE_LESSONS],
    badges: [
      { ...INITIAL_BADGES[0], unlocked: false },
      { ...INITIAL_BADGES[1], unlocked: false },
      { ...INITIAL_BADGES[2], unlocked: false },
      { ...INITIAL_BADGES[3], unlocked: false }
    ]
  },
  {
    id: "s4",
    name: "Kwame Mensah",
    grade: "Form 1 - Red",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    streak: 8,
    xp: 950,
    coins: 300,
    level: 4,
    assessed: true,
    weeklyProgress: [62, 65, 70, 75],
    gapReport: {
      scores: {
        reading: 75,
        vocabulary: 80,
        critical_thinking: 65,
        numeracy: 85
      },
      riskLevel: "Low",
      confidenceScore: 78,
      strengths: ["Vocabulary Champion", "Numeracy Mastery"],
      weaknesses: ["Reading Comprehension (Inference)"],
      recommendations: [
        "Advanced inference questions and reading assistant tutoring.",
        "Daily reading challenge story."
      ],
      estimatedImprovementWeeks: 2
    },
    lessons: [...SAMPLE_LESSONS],
    badges: [
      { ...INITIAL_BADGES[0], unlocked: true, dateUnlocked: "May 08, 2026" },
      { ...INITIAL_BADGES[1], unlocked: false },
      { ...INITIAL_BADGES[2], unlocked: true, dateUnlocked: "May 11, 2026" },
      { ...INITIAL_BADGES[3], unlocked: false }
    ]
  },
  {
    id: "s5",
    name: "Efe Nkrumah",
    grade: "Form 1 - Blue",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    streak: 0,
    xp: 0,
    coins: 0,
    level: 1,
    assessed: false,
    weeklyProgress: [0],
    lessons: [...SAMPLE_LESSONS],
    badges: [
      { ...INITIAL_BADGES[0], unlocked: false },
      { ...INITIAL_BADGES[1], unlocked: false },
      { ...INITIAL_BADGES[2], unlocked: false },
      { ...INITIAL_BADGES[3], unlocked: false }
    ]
  }
];

export const INITIAL_ALERTS = [
  {
    id: "a1",
    studentId: "s2",
    studentName: "Kofi Mensah",
    studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    type: "gap_detected" as const,
    description: "Kofi's Reading Comprehension scored 30% on diagnostic assessment. Urgent phonics attention required.",
    subject: "Reading Comprehension",
    risk: "High" as const,
    timestamp: "May 12, 10:24 AM"
  },
  {
    id: "a2",
    studentId: "s3",
    studentName: "Abena Darko",
    studentAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    type: "gap_detected" as const,
    description: "Abena's Critical Thinking sequence assessment scored 35%. Recommending visual patterns logic plan.",
    subject: "Critical Thinking",
    risk: "High" as const,
    timestamp: "May 11, 02:45 PM"
  },
  {
    id: "a3",
    studentId: "s1",
    studentName: "Ama Boateng",
    studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    type: "gap_detected" as const,
    description: "Ama's Vocabulary scored 40%. Requires context reading exercises.",
    subject: "Vocabulary Range",
    risk: "Moderate" as const,
    timestamp: "May 11, 09:12 AM"
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    sender: "teacher",
    text: "Good evening, Mr. Boateng! I noticed Ama is making incredible strides in Numeracy (90%), but she could use some extra reading time together at home to build her vocabulary. I've assigned a vocabulary story in her plan.",
    timestamp: "Yesterday, 6:30 PM"
  },
  {
    id: "m2",
    sender: "parent",
    text: "Thank you, Mrs. Mensah! Yes, we have started reading stories together in the evenings. She really loves the turtle and monkey story! We will work on her vocabulary cards too.",
    timestamp: "Yesterday, 7:15 PM"
  },
  {
    id: "m3",
    sender: "teacher",
    text: "That is wonderful to hear! Please have her practice voice-reading in the LearnLift app; it listens and gives real-time assistance.",
    timestamp: "Today, 9:00 AM"
  }
];

export const INITIAL_CLASSROOM: TeacherClassroom = {
  totalStudents: 5,
  highPriority: 2,
  moderatePriority: 1,
  onTrack: 2,
  commonGaps: [
    { subject: "Reading Comprehension", count: 40 },
    { subject: "Vocabulary Range", count: 28 },
    { subject: "Basic Numeracy", count: 18 },
    { subject: "Grammar & Structure", count: 10 }
  ],
  alerts: INITIAL_ALERTS
};

export const SAMPLE_HELP_FAQS = [
  {
    q: "How does LearnLift detect learning gaps early?",
    a: "LearnLift uses friendly, non-threatening diagnostic quizzes containing gamified micro-tasks. The results are mapped using standard educational rubrics into key dimensions like phonics, vocabulary, comprehension, numeracy, and inference, showing weaknesses immediately on the teacher's dashboard."
  },
  {
    q: "What is an early intervention model?",
    a: "Traditional systems wait until final exams when students have already failed. LearnLift checks students continuously. When a gap is flagged (e.g. Ama struggles with inference), the app automatically triggers tailored learning exercises and notifies parents to read with them immediately, lifting them up before they fail."
  },
  {
    q: "Is there offline support?",
    a: "Yes! LearnLift is optimized for low-bandwidth environments. Lessons can be cached locally on devices, and voice interactions use compact local or browser APIs when offline, storing data until a connection is restored."
  },
  {
    q: "How do parents and teachers coordinate?",
    a: "LearnLift features a Parent Dashboard with specific, simple actions like 'Read together for 15 minutes' rather than confusing numbers. It includes a direct chat to teacher Mrs. Mensah for seamless support."
  }
];
