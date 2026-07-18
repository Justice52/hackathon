import React, { useState, useEffect } from "react";
import { 
  BookOpen, ArrowUpRight, GraduationCap, Users, Heart, Building2, 
  Settings, HelpCircle, Trophy, Sparkles, RefreshCw, ChevronDown, LogOut,
  Compass, Swords
} from "lucide-react";

import WelcomeScreen from "./components/WelcomeScreen";
import RoleSelection from "./components/RoleSelection";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import ParentDashboard from "./components/ParentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import DiagnosticQuiz from "./components/DiagnosticQuiz";
import LearningGapReport from "./components/LearningGapReport";
import AITutor from "./components/AITutor";
import AchievementsView from "./components/AchievementsView";
import SettingsProfile from "./components/SettingsProfile";
import HelpCenter from "./components/HelpCenter";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import LeaderboardView from "./components/LeaderboardView";
import AdventureGameMode from "./components/AdventureGameMode";

import { UserRole, Student, TeacherClassroom, ChatMessage, Lesson, GapScores } from "./types";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<"welcome" | "login" | "register" | "dashboard">("welcome");
  const [role, setRole] = useState<UserRole | null>(null);
  const [subTab, setSubTab] = useState<string>("dashboard");
  const [activeLesson, setActiveLesson] = useState<Lesson | undefined>(undefined);
  const [showRoleSelectorDropdown, setShowRoleSelectorDropdown] = useState(false);

  // Synchronized Full-Stack State
  const [stateData, setStateData] = useState<{
    students: Student[];
    classroom: TeacherClassroom;
    parentMessages: ChatMessage[];
    activeStudentId: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper for Authorization Headers
  const getHeaders = (uObj?: any) => {
    const activeUser = uObj || user;
    return {
      "Content-Type": "application/json",
      ...(activeUser ? { "Authorization": activeUser.id } : {})
    };
  };

  // Fetch state on mount
  const fetchState = async (activeUser?: any) => {
    try {
      const u = activeUser || user;
      const res = await fetch("/api/state", {
        headers: u ? { "Authorization": u.id } : {}
      });
      const data = await res.json();
      setStateData(data);
    } catch (err) {
      console.error("Failed to load synchronized state:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Session restoration
    const savedSession = localStorage.getItem("learnlift_session") || sessionStorage.getItem("learnlift_session");
    let currentUser = null;
    if (savedSession) {
      try {
        currentUser = JSON.parse(savedSession);
        setUser(currentUser);
        setRole(currentUser.role);
        setView("dashboard");
      } catch (e) {
        console.error("Failed to parse saved session", e);
      }
    }

    // 2. Load API state with session headers
    fetchState(currentUser);

    // 3. Path protection logic
    const path = window.location.pathname;
    const isDashboardPath = ["/student", "/teacher", "/parent", "/admin"].includes(path);

    if (isDashboardPath) {
      if (currentUser) {
        // Logged in! Align role to path
        const expectedPath = `/${currentUser.role === "admin" ? "admin" : currentUser.role}`;
        if (path !== expectedPath) {
          window.history.replaceState({}, "", expectedPath);
        }
      } else {
        // Not logged in! Redirect to login/auth view
        window.history.replaceState({}, "", "/");
        setView("login");
        setRole(null);
      }
    } else if (path === "/register") {
      setView("register");
    } else if (path === "/login") {
      setView("login");
    }
  }, []);

  const handleAuthSuccess = (authenticatedUser: any, rememberMe: boolean) => {
    setUser(authenticatedUser);
    setRole(authenticatedUser.role);
    setView("dashboard");
    setSubTab("dashboard");

    // Persist login sessions securely
    if (rememberMe) {
      localStorage.setItem("learnlift_session", JSON.stringify(authenticatedUser));
    } else {
      sessionStorage.setItem("learnlift_session", JSON.stringify(authenticatedUser));
    }

    // Sync state
    fetchState(authenticatedUser);

    // Set URL path elegantly matching role
    const path = authenticatedUser.role === "admin" ? "/admin" : `/${authenticatedUser.role}`;
    window.history.pushState({}, "", path);
  };

  const handleLogout = () => {
    localStorage.removeItem("learnlift_session");
    sessionStorage.removeItem("learnlift_session");
    setUser(null);
    setRole(null);
    setView("welcome");
    setSubTab("dashboard");
    setShowRoleSelectorDropdown(false);
    window.history.pushState({}, "", "/");
  };

  const handleSelectRole = (newRole: UserRole) => {
    // Dynamically fetch matching seeded user so switching roles keeps authorization aligned
    const matchingSeed = [
      { id: "u1", name: "Ama Boateng", username: "ama", email: "ama@learnlift.com", phone: "1234567890", password: "password123", role: "student", targetId: "s1" },
      { id: "u2", name: "Mrs. Mensah", username: "teacher", email: "teacher@learnlift.com", phone: "0987654321", password: "password123", role: "teacher", targetId: "t1" },
      { id: "u3", name: "Mr. Boateng", username: "parent", email: "parent@learnlift.com", phone: "1122334455", password: "password123", role: "parent", targetId: "s1" },
      { id: "u4", name: "District Admin", username: "admin", email: "admin@learnlift.com", phone: "5566778899", password: "password123", role: "admin", targetId: "a1" }
    ].find(u => u.role === newRole);

    if (matchingSeed) {
      setUser(matchingSeed);
      if (localStorage.getItem("learnlift_session")) {
        localStorage.setItem("learnlift_session", JSON.stringify(matchingSeed));
      } else {
        sessionStorage.setItem("learnlift_session", JSON.stringify(matchingSeed));
      }
    }

    setRole(newRole);
    setSubTab("dashboard");
    setShowRoleSelectorDropdown(false);

    // Sync URL path matching role
    const path = newRole === "admin" ? "/admin" : `/${newRole}`;
    window.history.pushState({}, "", path);
  };

  const handleResetDb = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/state/reset", { 
        method: "POST",
        headers: getHeaders()
      });
      const data = await res.json();
      setStateData(data.state);
      
      // Clear sessions
      localStorage.removeItem("learnlift_session");
      sessionStorage.removeItem("learnlift_session");
      setUser(null);
      setRole(null);
      setView("welcome");
      setSubTab("dashboard");
      window.history.replaceState({}, "", "/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async (lessonId: string) => {
    if (!stateData) return;
    try {
      const res = await fetch("/api/student/lesson-complete", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ studentId: stateData.activeStudentId, lessonId })
      });
      const data = await res.json();
      if (data.success) {
        setStateData(data.state);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssessSubmit = async (scores: GapScores) => {
    if (!stateData) return;
    try {
      const res = await fetch("/api/student/assess", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ studentId: stateData.activeStudentId, scores })
      });
      const data = await res.json();
      if (data.success) {
        setStateData(data.state);
        setSubTab("report");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismissAlert = async (alertId: string) => {
    try {
      const res = await fetch("/api/alert/dismiss", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ alertId })
      });
      const data = await res.json();
      if (data.success) {
        setStateData(data.state);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (sender: "teacher" | "parent", text: string) => {
    try {
      const res = await fetch("/api/message/send", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ sender, text })
      });
      const data = await res.json();
      if (data.success) {
        setStateData(data.state);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignHomework = async (
    studentId: string, 
    title: string, 
    category: "reading" | "vocabulary" | "numeracy" | "critical_thinking"
  ) => {
    if (!stateData) return;
    // We can update locally on the client and push the updated state to the server
    const updatedStudents = stateData.students.map(s => {
      if (s.id === studentId) {
        const newLesson: Lesson = {
          id: `l_custom_${Date.now()}`,
          title,
          description: "Custom practice assigned by your teacher.",
          category,
          type: category === "reading" ? "story" : "game",
          durationMinutes: 10,
          completed: false,
          content: "Enjoy practicing this customized focus challenge! Complete the worksheet or practice voicing key vocabularies.",
          interactivePrompt: "Write down 2 things you learned from this task!"
        };
        const existingLessons = s.lessons || [];
        return {
          ...s,
          lessons: [newLesson, ...existingLessons]
        };
      }
      return s;
    });

    try {
      const res = await fetch("/api/state", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ students: updatedStudents })
      });
      const data = await res.json();
      if (data.success) {
        setStateData(data.state);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    if (!stateData) return;
    const updatedStudents = stateData.students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    try {
      const res = await fetch("/api/state", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ students: updatedStudents })
      });
      const data = await res.json();
      if (data.success) {
        setStateData(data.state);
      }
    } catch (err) {
      console.error("Failed to sync student update:", err);
    }
  };

  // Helper selectors
  const activeStudent = stateData?.students.find(s => {
    if (user && (role === "student" || role === "parent")) {
      return s.id === user.targetId;
    }
    return s.id === stateData.activeStudentId;
  }) || stateData?.students[0];

  // If loading, show elegant, responsive page loader
  if (loading || !stateData || !activeStudent) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans gap-4 text-center">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 animate-bounce">
          <BookOpen className="w-7 h-7" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-lg">Lifting up learning spaces...</h2>
          <p className="text-slate-400 text-xs font-semibold mt-1 uppercase tracking-widest animate-pulse">LearnLift Platform</p>
        </div>
      </div>
    );
  }

  // Handle Authentication Views
  if (view === "login") {
    return (
      <LoginScreen
        onSuccess={handleAuthSuccess}
        onBack={() => {
          setView("welcome");
          window.history.pushState({}, "", "/");
        }}
        onSignUp={() => {
          setView("register");
          window.history.pushState({}, "", "/register");
        }}
      />
    );
  }

  if (view === "register") {
    return (
      <RegisterScreen
        onSuccess={handleAuthSuccess}
        onBackToLogin={() => {
          setView("login");
          window.history.pushState({}, "", "/login");
        }}
      />
    );
  }

  // Welcome / Splash Page View (Not Logged In)
  if (role === null || view === "welcome") {
    return (
      <WelcomeScreen 
        onStart={() => {
          setView("login");
          window.history.pushState({}, "", "/login");
        }} 
        onSelectRole={(selectedRole) => {
          setView("login");
          window.history.pushState({}, "", "/login");
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Dynamic Master Top Bar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
          {/* Logo */}
          <div 
            onClick={() => setRole(null)}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <div className="relative flex items-center justify-center">
                <BookOpen className="w-5 h-5 absolute -translate-y-0.5" />
                <ArrowUpRight className="w-3 h-3 absolute translate-x-2.5 -translate-y-2.5" />
              </div>
            </div>
            <div className="text-left">
              <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">Learn<span className="text-indigo-600">Lift</span></span>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mt-0.5">Intervention</p>
            </div>
          </div>

          {/* Center Tabs: Dependent on Active Role */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/40">
            {role === "student" && (
              <>
                <button
                  onClick={() => setSubTab("dashboard")}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${subTab === "dashboard" || subTab === "quiz" || subTab === "report" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                >
                  My Plan
                </button>
                <button
                  onClick={() => setSubTab("ai-tutor")}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${subTab === "ai-tutor" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Liftie AI
                </button>
                <button
                  onClick={() => setSubTab("adventure-game")}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${subTab === "adventure-game" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                >
                  <Compass className="w-3.5 h-3.5" /> Adventure Game
                </button>
                <button
                  onClick={() => setSubTab("leaderboard")}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${subTab === "leaderboard" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                >
                  <Trophy className="w-3.5 h-3.5" /> Leaderboard
                </button>
                <button
                  onClick={() => setSubTab("achievements")}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${subTab === "achievements" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Badges
                </button>
              </>
            )}

            {role === "teacher" && (
              <>
                <button
                  onClick={() => setSubTab("dashboard")}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${subTab === "dashboard" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Classroom Heatmap
                </button>
              </>
            )}

            {role === "parent" && (
              <>
                <button
                  onClick={() => setSubTab("dashboard")}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${subTab === "dashboard" ? "bg-white text-amber-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Parenting Dashboard
                </button>
                <button
                  onClick={() => setSubTab("ai-tutor")}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${subTab === "ai-tutor" ? "bg-white text-amber-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Coaching Tutor
                </button>
              </>
            )}

            {role === "admin" && (
              <>
                <button
                  onClick={() => setSubTab("dashboard")}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${subTab === "dashboard" ? "bg-white text-rose-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                >
                  District Growth Metrics
                </button>
              </>
            )}

            {/* Shared links */}
            <button
              onClick={() => setSubTab("settings")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${subTab === "settings" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSubTab("help")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${subTab === "help" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </nav>

          {/* Right Role Switcher Selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSelectorDropdown(!showRoleSelectorDropdown)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-2xl text-left text-xs font-bold text-slate-800 transition-colors shadow-2xs"
            >
              {role === "student" && <span className="flex items-center gap-1 text-indigo-600">🎓 Student: Ama</span>}
              {role === "teacher" && <span className="flex items-center gap-1 text-emerald-600">👩‍🏫 Teacher: Mrs. Mensah</span>}
              {role === "parent" && <span className="flex items-center gap-1 text-amber-600">👨‍👧 Parent: Mr. Boateng</span>}
              {role === "admin" && <span className="flex items-center gap-1 text-rose-600">🏛️ Admin Mode</span>}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleSelectorDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-2 text-left animate-in fade-in slide-in-from-top-3 duration-250">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5">Change Active Persona</p>
                
                <button
                  onClick={() => handleSelectRole("student")}
                  className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-indigo-50 hover:text-indigo-700 rounded-xl flex items-center gap-2 transition-colors text-slate-700"
                >
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>Student (Ama)</span>
                </button>

                <button
                  onClick={() => handleSelectRole("teacher")}
                  className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-emerald-50 hover:text-emerald-700 rounded-xl flex items-center gap-2 transition-colors text-slate-700"
                >
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Teacher (Mrs. Mensah)</span>
                </button>

                <button
                  onClick={() => handleSelectRole("parent")}
                  className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-amber-50 hover:text-amber-700 rounded-xl flex items-center gap-2 transition-colors text-slate-700"
                >
                  <Heart className="w-4 h-4 text-amber-600" />
                  <span>Parent (Mr. Boateng)</span>
                </button>

                <button
                  onClick={() => handleSelectRole("admin")}
                  className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-rose-50 hover:text-rose-700 rounded-xl flex items-center gap-2 transition-colors text-slate-700"
                >
                  <Building2 className="w-4 h-4 text-rose-600" />
                  <span>School Admin</span>
                </button>

                <div className="border-t border-slate-100 my-1.5" />

                <button
                  onClick={handleResetDb}
                  className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-50 text-slate-500 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                  <span>Reset Demo Data</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-red-50 text-red-600 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out Session</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main SubTab Router View Body */}
      <main className="flex-1 bg-slate-50 relative overflow-y-auto">
        {role === "student" && (
          <>
            {subTab === "dashboard" && (
              <StudentDashboard 
                student={activeStudent}
                onLaunchAssessment={() => setSubTab("quiz")}
                onLaunchAITutor={(lesson) => {
                  setActiveLesson(lesson);
                  setSubTab("ai-tutor");
                }}
                onCompleteLesson={handleCompleteLesson}
                onViewAchievements={() => setSubTab("achievements")}
              />
            )}

            {subTab === "quiz" && (
              <DiagnosticQuiz 
                studentName={activeStudent.name}
                onComplete={handleAssessSubmit}
                onCancel={() => setSubTab("dashboard")}
              />
            )}

            {subTab === "report" && activeStudent.gapReport && (
              <LearningGapReport 
                studentName={activeStudent.name}
                report={activeStudent.gapReport}
                onStartLearning={() => setSubTab("dashboard")}
              />
            )}

            {subTab === "ai-tutor" && (
              <AITutor 
                studentId={activeStudent.id}
                studentName={activeStudent.name}
                passageContext={activeLesson?.content}
                lessonTitle={activeLesson?.title}
                interactivePrompt={activeLesson?.interactivePrompt}
                onBack={() => {
                  setActiveLesson(undefined);
                  setSubTab("dashboard");
                }}
              />
            )}

            {subTab === "achievements" && (
              <AchievementsView 
                student={activeStudent}
                onBack={() => setSubTab("dashboard")}
              />
            )}

            {subTab === "adventure-game" && (
              <AdventureGameMode 
                student={activeStudent}
                onBack={() => setSubTab("dashboard")}
                onUpdateStudent={handleUpdateStudent}
              />
            )}

            {subTab === "leaderboard" && (
              <LeaderboardView 
                currentStudent={activeStudent}
                allStudents={stateData.students}
                onBack={() => setSubTab("dashboard")}
                onUpdateStudent={handleUpdateStudent}
              />
            )}
          </>
        )}

        {role === "teacher" && (
          <>
            {subTab === "dashboard" && (
              <TeacherDashboard 
                students={stateData.students}
                classroom={stateData.classroom}
                parentMessages={stateData.parentMessages}
                onDismissAlert={handleDismissAlert}
                onSendMessage={handleSendMessage}
                onAssignHomework={handleAssignHomework}
              />
            )}
          </>
        )}

        {role === "parent" && (
          <>
            {subTab === "dashboard" && (
              <ParentDashboard 
                student={activeStudent}
                parentMessages={stateData.parentMessages}
                onSendMessage={handleSendMessage}
                onLaunchAITutor={() => setSubTab("ai-tutor")}
              />
            )}

            {subTab === "ai-tutor" && (
              <AITutor 
                studentId={activeStudent.id}
                studentName={activeStudent.name}
                passageContext="The shiny ship carried chocolate chips across the choppy ocean."
                onBack={() => setSubTab("dashboard")}
              />
            )}
          </>
        )}

        {role === "admin" && (
          <>
            {subTab === "dashboard" && (
              <AdminDashboard 
                students={stateData.students}
                onResetDb={handleResetDb}
              />
            )}
          </>
        )}

        {/* Shared Tabs router */}
        {subTab === "settings" && (
          <SettingsProfile 
            student={activeStudent}
            onResetDb={handleResetDb}
          />
        )}

        {subTab === "help" && (
          <HelpCenter />
        )}
      </main>

      {/* Dynamic Mobile Tab bar selector */}
      <footer className="md:hidden bg-white border-t border-slate-100 px-6 py-2 flex justify-around items-center sticky bottom-0 z-50">
        <button 
          onClick={() => setSubTab("dashboard")}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${subTab === "dashboard" ? "text-indigo-600" : "text-slate-400"}`}
        >
          <GraduationCap className="w-5.5 h-5.5" />
          <span>Plan</span>
        </button>

        <button 
          onClick={() => setSubTab("ai-tutor")}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${subTab === "ai-tutor" ? "text-indigo-600" : "text-slate-400"}`}
        >
          <Sparkles className="w-5.5 h-5.5" />
          <span>Liftie AI</span>
        </button>

        <button 
          onClick={() => setSubTab("settings")}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${subTab === "settings" ? "text-indigo-600" : "text-slate-400"}`}
        >
          <Settings className="w-5.5 h-5.5" />
          <span>Setting</span>
        </button>
      </footer>
    </div>
  );
}
