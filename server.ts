import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Shared State for Multi-User synchronization (the "Data Synchronization Layer")
// It mirrors what would go into Firestore but operates perfectly out-of-the-box!
let state = {
  currentRole: "student" as string,
  students: [
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
      lessons: [
        {
          id: "l1",
          title: "The Wise Turtle and the Monkey",
          description: "An engaging folk story that helps improve reading comprehension and inference skills.",
          category: "reading",
          type: "story",
          durationMinutes: 15,
          completed: false,
          content: "Once upon a time in a lush green forest, there lived a Wise Turtle named Tutu. Tutu was slow, but he was very smart and observed everything around him. In the same forest lived a playful monkey named Momo, who loved to play tricks on other animals. One sunny afternoon, Momo challenged Tutu to a food gathering contest. Momo gathered fruits quickly but ate half of them. Tutu gathered slowly but saved every single berry. When winter came, Momo had no food left, while Tutu had a cozy stash of delicious berries. Momo learned that patience and planning are better than quick tricks.",
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
          description: "Put on your detective hat and solve logical mysteries using hidden clues.",
          category: "critical_thinking",
          type: "quiz",
          durationMinutes: 10,
          completed: false,
          content: "Clue 1: The ground is wet. Clue 2: People are opening their umbrellas. Clue 3: There is a pitter-patter sound on the tin roof. Detective Question: What is happening outside?",
          interactivePrompt: "What can you infer is happening?"
        }
      ],
      badges: [
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
      ]
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
      lessons: [],
      badges: []
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
      lessons: [],
      badges: []
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
      lessons: [],
      badges: []
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
      lessons: [],
      badges: []
    }
  ],
  classroom: {
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
    alerts: [
      {
        id: "a1",
        studentId: "s2",
        studentName: "Kofi Mensah",
        studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        type: "gap_detected",
        description: "Kofi's Reading Comprehension scored 30% on diagnostic assessment. Urgent phonics attention required.",
        subject: "Reading Comprehension",
        risk: "High",
        timestamp: "May 12, 10:24 AM"
      },
      {
        id: "a2",
        studentId: "s3",
        studentName: "Abena Darko",
        studentAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        type: "gap_detected",
        description: "Abena's Critical Thinking sequence assessment scored 35%. Recommending visual patterns logic plan.",
        subject: "Critical Thinking",
        risk: "High",
        timestamp: "May 11, 02:45 PM"
      },
      {
        id: "a3",
        studentId: "s1",
        studentName: "Ama Boateng",
        studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        type: "gap_detected",
        description: "Ama's Vocabulary scored 40%. Requires context reading exercises.",
        subject: "Vocabulary Range",
        risk: "Moderate",
        timestamp: "May 11, 09:12 AM"
      }
    ]
  },
  parentMessages: [
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
  ],
  activeStudentId: "s1"
};

// INITIAL COPIES (for resetting)
const DEFAULT_STATE_JSON = JSON.stringify(state);

// Database of verified users/credentials
let users = [
  { id: "u1", name: "Ama Boateng", username: "ama", email: "ama@learnlift.com", phone: "1234567890", password: "password123", role: "student", targetId: "s1" },
  { id: "u2", name: "Mrs. Mensah", username: "teacher", email: "teacher@learnlift.com", phone: "0987654321", password: "password123", role: "teacher", targetId: "t1" },
  { id: "u3", name: "Mr. Boateng", username: "parent", email: "parent@learnlift.com", phone: "1122334455", password: "password123", role: "parent", targetId: "s1" },
  { id: "u4", name: "District Admin", username: "admin", email: "admin@learnlift.com", phone: "5566778899", password: "password123", role: "admin", targetId: "a1" }
];
const DEFAULT_USERS_JSON = JSON.stringify(users);

// Auth Middleware
function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized. Authentication is required." });
  }
  const user = users.find(u => u.id === authHeader);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized. Invalid session." });
  }
  req.user = user;
  next();
}

// SERVER STATE API ROUTES
app.get("/api/state", (req, res) => {
  res.json(state);
});

// AUTHENTICATION ROUTES
app.post("/api/auth/login", (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: "Identifier and password are required." });
  }

  const idLower = identifier.toLowerCase().trim();
  const user = users.find(u => 
    (u.email.toLowerCase() === idLower || u.username.toLowerCase() === idLower || u.phone === identifier) && 
    u.password === password
  );

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email/username or password." });
  }

  res.json({ success: true, user });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, username, phone, password, role, extraInfo } = req.body;
  if (!name || !email || !username || !phone || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const emailLower = email.toLowerCase().trim();
  const usernameLower = username.toLowerCase().trim();

  const exists = users.some(u => u.email.toLowerCase() === emailLower || u.username.toLowerCase() === usernameLower);
  if (exists) {
    return res.status(400).json({ success: false, message: "Email or username is already taken." });
  }

  const newId = `u_${Date.now()}`;
  let targetId = `t_${Date.now()}`;

  // If registering as student, append to in-memory students list dynamically
  if (role === "student") {
    targetId = `s_${Date.now()}`;
    const newStudent = {
      id: targetId,
      name,
      grade: extraInfo || "Form 1 - Blue",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      streak: 0,
      xp: 0,
      coins: 0,
      level: 1,
      assessed: false,
      weeklyProgress: [0],
      lessons: [
        {
          id: "l1",
          title: "The Wise Turtle and the Monkey",
          description: "An engaging folk story that helps improve reading comprehension and inference skills.",
          category: "reading" as const,
          type: "story" as const,
          durationMinutes: 15,
          completed: false,
          content: "Once upon a time in a lush green forest, there lived a Wise Turtle named Tutu. Tutu was slow, but he was very smart and observed everything around him. In the same forest lived a playful monkey named Momo, who loved to play tricks on other animals. One sunny afternoon, Momo challenged Tutu to a food gathering contest. Momo gathered fruits quickly but ate half of them. Tutu gathered slowly but saved every single berry. When winter came, Momo had no food left, while Tutu had a cozy stash of delicious berries. Momo learned that patience and planning are better than quick tricks.",
          interactivePrompt: "Can you explain the moral of the story to Tutu?"
        }
      ],
      badges: []
    };
    state.students.push(newStudent);
  } else if (role === "parent") {
    // Parent target id can link to matching child's student id
    const matchingStudent = state.students.find(s => s.name.toLowerCase().includes(extraInfo?.toLowerCase() || ""));
    targetId = matchingStudent ? matchingStudent.id : "s1";
  }

  const newUser = {
    id: newId,
    name,
    username,
    email,
    phone,
    password,
    role,
    targetId
  };

  users.push(newUser);
  res.json({ success: true, user: newUser });
});

app.post("/api/state", requireAuth, (req, res) => {
  state = { ...state, ...req.body };
  res.json({ success: true, state });
});

app.post("/api/state/reset", (req, res) => {
  state = JSON.parse(DEFAULT_STATE_JSON);
  users = JSON.parse(DEFAULT_USERS_JSON);
  res.json({ success: true, message: "State reset successful", state });
});

// SUBMIT QUIZ ASSESSMENT (Drives the student flow to teacher/admin reporting!)
app.post("/api/student/assess", requireAuth, (req, res) => {
  const { studentId, scores } = req.body;
  const student = state.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  // Calculate risk level and statistics
  const avg = (scores.reading + scores.vocabulary + scores.critical_thinking + scores.numeracy) / 4;
  let riskLevel: "Low" | "Medium" | "High" = "Low";
  if (avg < 50) riskLevel = "High";
  else if (avg < 75) riskLevel = "Medium";

  const report = {
    scores,
    riskLevel,
    confidenceScore: Math.round(avg),
    strengths: [] as string[],
    weaknesses: [] as string[],
    recommendations: [] as string[],
    estimatedImprovementWeeks: riskLevel === "High" ? 6 : riskLevel === "Medium" ? 4 : 2
  };

  // Compile strengths and weaknesses
  if (scores.reading >= 75) report.strengths.push("Reading Fluency");
  else report.weaknesses.push("Reading Comprehension");

  if (scores.vocabulary >= 75) report.strengths.push("Word Knowledge");
  else report.weaknesses.push("Vocabulary Range");

  if (scores.critical_thinking >= 75) report.strengths.push("Analytical Sequencing");
  else report.weaknesses.push("Logical Deduction");

  if (scores.numeracy >= 75) report.strengths.push("Numeracy Foundations");
  else report.weaknesses.push("Arithmetic Practice");

  // Custom recommendations based on weaknesses
  if (scores.reading < 75) {
    report.recommendations.push("Daily 10-minute guided story reading.");
  }
  if (scores.vocabulary < 75) {
    report.recommendations.push("Flashcard matching exercises with custom definitions.");
  }
  if (scores.critical_thinking < 75) {
    report.recommendations.push("Logical sequencing patterns exercises.");
  }
  if (scores.numeracy < 75) {
    report.recommendations.push("Visual brick arithmetic puzzles.");
  }

  student.assessed = true;
  student.gapReport = report;
  student.weeklyProgress = [Math.round(avg * 0.8), Math.round(avg * 0.9), Math.round(avg)];

  // Update classroom KPIs and add alert if needed
  if (riskLevel === "High" || riskLevel === "Medium") {
    const alertId = `a_new_${Date.now()}`;
    const newAlert = {
      id: alertId,
      studentId: student.id,
      studentName: student.name,
      studentAvatar: student.avatar,
      type: "gap_detected" as const,
      description: `${student.name} scored low in ${report.weaknesses[0] || 'Learning Foundations'} (${Math.round(avg)}%). Recommended immediate focus.`,
      subject: report.weaknesses[0] || "Learning Gaps",
      risk: riskLevel === "High" ? ("High" as const) : ("Moderate" as const),
      timestamp: "Just Now"
    };
    state.classroom.alerts.unshift(newAlert);
  }

  // Recalculate classroom stats
  let high = 0;
  let mod = 0;
  let onTrack = 0;
  state.students.forEach(s => {
    if (s.assessed && s.gapReport) {
      if (s.gapReport.riskLevel === "High") high++;
      else if (s.gapReport.riskLevel === "Medium") mod++;
      else onTrack++;
    }
  });
  state.classroom.highPriority = high;
  state.classroom.moderatePriority = mod;
  state.classroom.onTrack = onTrack + state.students.filter(s => !s.assessed).length;

  res.json({ success: true, student, state });
});

// DISMISS ALERTS
app.post("/api/alert/dismiss", requireAuth, (req, res) => {
  const { alertId } = req.body;
  state.classroom.alerts = state.classroom.alerts.filter(a => a.id !== alertId);
  res.json({ success: true, state });
});

// SEND PARENT/TEACHER MESSAGES
app.post("/api/message/send", requireAuth, (req, res) => {
  const { sender, text } = req.body;
  const newMsg = {
    id: `m_${Date.now()}`,
    sender: sender as "parent" | "teacher",
    text,
    timestamp: "Just Now"
  };
  state.parentMessages.push(newMsg);
  res.json({ success: true, message: newMsg, state });
});

// COMPLETE LESSONS & REWARD
app.post("/api/student/lesson-complete", requireAuth, (req, res) => {
  const { studentId, lessonId } = req.body;
  const student = state.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  // Find lesson
  const lessons = student.id === "s1" ? student.lessons : [];
  const lesson = lessons.find(l => l.id === lessonId);
  if (lesson && !lesson.completed) {
    lesson.completed = true;
    student.xp += 100;
    student.coins += 25;
    // Check if streak increases
    student.streak += 1;
    if (student.xp >= student.level * 300) {
      student.level += 1;
    }
    // Unlock vocabulary badge if vocabulary lessons completed
    if (lesson.category === "vocabulary") {
      const vocabBadge = student.badges.find(b => b.id === "b3");
      if (vocabBadge && !vocabBadge.unlocked) {
        vocabBadge.unlocked = true;
        vocabBadge.dateUnlocked = "Just Now";
        student.xp += vocabBadge.xpValue;
      }
    }
  }
  res.json({ success: true, student, state });
});

// LAZY-INITIALIZE GEMINI API ONLY WHEN NEEDED (TO PREVENT CRASH ON STARTUP IF KEY IS EMPTY)
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
  }
  return aiClient;
}

// AI TUTOR ROUTE (Fully Server-side proxy for Gemini)
app.post("/api/ai/chat", requireAuth, async (req, res) => {
  const { messages, passageContext, moralPrompt } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  try {
    const ai = getAiClient();
    
    // Construct system instructions emphasizing absolute kindness, Duolingo-like encouragement, and clear primary grade explanations
    const systemInstruction = `You are "Liftie", the friendly, super-encouraging AI Reading Assistant on the "LearnLift" platform.
LearnLift is an early learning intervention platform. Your primary target users are primary school kids (aged 5-11).
Your character rules:
1. ALWAYS be positive, loving, and supportive. NEVER discourage a child.
2. If they make mistakes or explain poorly, praise their effort first, then explain simply in a warm, friendly way.
3. Use short, simple paragraphs, bullet points, and fun, friendly metaphors suitable for kids.
4. Keep answers short and visual (max 100-150 words). Use warm educational analogies.
5. If a passage context is provided: "${passageContext || ""}", refer to it to explain hard paragraphs or words in it.
6. If the student asks about a story or moral prompt like "${moralPrompt || ""}", guide them playfully to find the lesson themselves.

Respond in standard markdown text without excessive jargon. Include friendly emoji where appropriate!`;

    if (!ai) {
      // Graceful offline demo fallback
      const lastUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || "";
      let responseText = "Hello there! I am Liftie, your LearnLift AI Assistant. 🌟 I'm here to read stories with you and learn new things together!";
      
      if (lastUserMsg.includes("moral") || lastUserMsg.includes("turtle") || lastUserMsg.includes("monkey")) {
        responseText = "Oh! The Wise Turtle Tutu showed us that planning and patience are like planting seeds: if we are patient and save our berries, we will have a wonderful, warm feast in the winter! 🐢 Momo the monkey learned that playing all day is fun, but planning for tomorrow keeps us safe and happy. What do you think Momo should gather next time? 🍌";
      } else if (lastUserMsg.includes("ship") || lastUserMsg.includes("shiny") || lastUserMsg.includes("sound")) {
        responseText = "Wow! That was a spectacular attempt! 🗣️ Your pronunciation of the 'sh' sound in 'shiny ship' was so clear and brilliant! You sound like a real Reading Hero! Let's try saying it together: 'The chocolate chips are delicious!' 🍫 Would you like to read another word?";
      } else if (lastUserMsg.includes("help") || lastUserMsg.includes("explain")) {
        responseText = "Of course! Let's look at that tricky paragraph together. 📖 Sometimes big words can feel like tall trees, but we can climb them branch by branch! Which word feels a bit heavy for you right now? Let's sound it out together!";
      } else {
        responseText = "That is so interesting! You are doing a super job reading and thinking today. 🚀 Let's keep exploring! Tell me, what is your favorite part of this story?";
      }

      responseText += "\n\n*(Demo Mode: Set GEMINI_API_KEY in secrets to experience real live AI chatbot responses)*";
      return res.json({ response: responseText });
    }

    // Convert chat history for GoogleGenAI SDK format
    // Standard chats.create accepts sendMessage
    const lastMsg = messages[messages.length - 1]?.text || "Hello";
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.sender === "user" ? "user" as const : "model" as const,
      parts: [{ text: m.text }]
    }));

    // Create chat session with custom system instruction and history
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: history.length > 0 ? history : undefined
    });

    const result = await chat.sendMessage({ message: lastMsg });
    const aiText = result.text || "I am listening! Let's read together.";

    return res.json({ response: aiText });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to communicate with AI: " + error.message });
  }
});

// Vite Middleware & Production Build Routing
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`LearnLift Server running on http://localhost:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;

