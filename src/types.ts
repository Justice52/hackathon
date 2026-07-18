export type UserRole = "student" | "teacher" | "parent" | "admin";

export interface DiagnosticQuestion {
  id: string;
  subject: "reading" | "vocabulary" | "numeracy" | "critical_thinking";
  passage?: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface GapScores {
  reading: number; // 0 - 100
  vocabulary: number;
  critical_thinking: number;
  numeracy: number;
}

export interface LearningGapReport {
  scores: GapScores;
  riskLevel: "Low" | "Medium" | "High";
  confidenceScore: number; // 0 - 100
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  estimatedImprovementWeeks: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: "reading" | "vocabulary" | "numeracy" | "critical_thinking";
  type: "story" | "audio" | "game" | "quiz";
  durationMinutes: number;
  completed: boolean;
  content: string; // Detail or story content
  interactivePrompt?: string; // Voice or text prompt
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  unlocked: boolean;
  dateUnlocked?: string;
  xpValue: number;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  avatar: string;
  streak: number;
  xp: number;
  coins: number;
  level: number;
  assessed: boolean;
  gapReport?: LearningGapReport;
  lessons: Lesson[];
  badges: Badge[];
  weeklyProgress: number[]; // Array of numbers representing percentage improvement (e.g., [60, 62, 65, 72])
}

export interface ClassroomAlert {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  type: "gap_detected" | "streak_risk" | "quiz_score_low";
  description: string;
  subject: string;
  risk: "Low" | "Moderate" | "High";
  timestamp: string;
}

export interface TeacherClassroom {
  totalStudents: number;
  highPriority: number;
  moderatePriority: number;
  onTrack: number;
  commonGaps: { subject: string; count: number }[];
  alerts: ClassroomAlert[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "teacher" | "parent";
  text: string;
  timestamp: string;
}

export interface SystemState {
  currentRole: UserRole;
  students: Student[];
  classroom: TeacherClassroom;
  parentMessages: ChatMessage[];
  activeStudentId: string;
}
