import React, { useState } from "react";
import { BookOpen, Flame, Award, Calendar, Volume2, Star, CheckCircle, Clock, BookMarked, BrainCircuit, Play, ArrowRight, UserCheck } from "lucide-react";
import { Student, Lesson } from "../types";

interface StudentDashboardProps {
  student: Student;
  onLaunchAssessment: () => void;
  onLaunchAITutor: (lesson?: Lesson) => void;
  onCompleteLesson: (lessonId: string) => void;
  onViewAchievements: () => void;
}

export default function StudentDashboard({ student, onLaunchAssessment, onLaunchAITutor, onCompleteLesson, onViewAchievements }: StudentDashboardProps) {
  const [reflectionText, setReflectionText] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);

  // Filter lessons based on status for beautiful layout
  const completedLessons = student.lessons.filter(l => l.completed);
  const pendingLessons = student.lessons.filter(l => !l.completed);
  const wiseTurtleLesson = student.lessons.find(l => l.id === "l1" || l.title.toLowerCase().includes("turtle"));

  // SVG Sparkline drawing for Weekly progress [55, 60, 68, 72]
  const dataPoints = student.weeklyProgress || [55, 60, 68, 72];
  const width = 240;
  const height = 70;
  const padding = 10;
  const maxValue = 100;
  
  // Calculate points
  const points = dataPoints.map((val, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (dataPoints.length - 1);
    const y = height - padding - (val / maxValue) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;
    setReflectionSaved(true);
    setTimeout(() => {
      setReflectionSaved(false);
      setReflectionText("");
    }, 3000);
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 py-6 font-sans flex flex-col gap-8 text-left">
      {/* Hello Student Header cards */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs">
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-16 h-16 rounded-full border-3 border-indigo-100 object-cover"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
              Hello {student.name.split(" ")[0]}! 👋
            </h1>
            <p className="text-slate-500 text-sm">Let's continue your learning journey and lift your skills!</p>
          </div>
        </div>

        {/* Level & Streak Stats */}
        <div className="flex gap-4">
          <div className="bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-2xl flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <div>
              <p className="text-xs text-amber-500 font-bold uppercase tracking-wider leading-none">Day Streak</p>
              <p className="text-lg font-bold text-amber-600">{student.streak} Days</p>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-2xl flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <div>
              <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider leading-none">XP Points</p>
              <p className="text-lg font-bold text-indigo-600">{student.xp} XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Goals & Weekly Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Goal Card */}
        <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md mb-4 inline-block">
              Today's Key Objective
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Improve Reading Comprehension</h3>
            <p className="text-xs text-slate-400 font-semibold mb-4">Complete 1 Story and practice with Liftie AI</p>
            
            {/* Goal Progress bar */}
            <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden relative mb-4">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: "60%" }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-600">60% Completed</span>
            </div>
          </div>

          <div className="flex justify-between items-center bg-indigo-50/40 p-3.5 rounded-2xl border border-indigo-50/60 mt-2">
            <div className="flex items-center gap-2.5 text-xs text-indigo-950 font-medium">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <span>Recommended story: <strong>The Wise Turtle</strong></span>
            </div>
            <button
              onClick={() => onLaunchAITutor(wiseTurtleLesson)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              Start Story &rarr;
            </button>
          </div>
        </div>

        {/* Weekly Progress Chart Card */}
        <div className="lg:col-span-5 bg-indigo-600 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-indigo-500/20 rounded-full -z-0" />
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider">Weekly Progress</p>
              <h3 className="text-3xl font-extrabold mt-1">72%</h3>
              <p className="text-indigo-200 text-xs mt-0.5 font-medium">Your skill improvement index</p>
            </div>
            <span className="text-xs bg-indigo-500/50 px-2.5 py-1 rounded-full font-bold">
              +12% this week
            </span>
          </div>

          {/* Inline Sparkline SVG Chart */}
          <div className="w-full h-[80px] my-4 relative z-10">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              <path
                d={`M ${points}`}
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Highlight last dot */}
              {dataPoints.length > 0 && (
                <circle
                  cx={padding + ((dataPoints.length - 1) * (width - padding * 2)) / (dataPoints.length - 1)}
                  cy={height - padding - (dataPoints[dataPoints.length - 1] / maxValue) * (height - padding * 2)}
                  r="5"
                  fill="#FFB703"
                  className="stroke-white stroke-2"
                />
              )}
            </svg>
          </div>

          <button
            onClick={onViewAchievements}
            className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-center text-xs font-bold transition-all relative z-10"
          >
            View Weekly Analysis
          </button>
        </div>
      </div>

      {/* Main Flow: Quick Diagnostic & Pending Lessons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Columns: Today's Tasks */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Quick diagnostic alert if available */}
          {!student.assessed && (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">⚠️</span>
                <div>
                  <h4 className="font-bold text-amber-900">Weekly Diagnostic Pending</h4>
                  <p className="text-xs text-amber-700 mt-1 max-w-lg">
                    Take the 2-minute diagnostic assessment to update your skills roadmap. It keeps your teacher informed about your progress!
                  </p>
                </div>
              </div>
              <button
                onClick={onLaunchAssessment}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs shrink-0 transition-all"
              >
                Launch Assessment
              </button>
            </div>
          )}

          {student.assessed && (
            <div className="bg-emerald-50 border border-emerald-100 p-4.5 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <div className="text-left">
                  <p className="text-xs text-emerald-800 font-bold">Skills profile is updated</p>
                  <p className="text-[11px] text-slate-500">Your custom learning plan has been generated based on your weaknesses.</p>
                </div>
              </div>
              <button
                onClick={onLaunchAssessment}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
              >
                Retake assessment
              </button>
            </div>
          )}

          {/* Today's Lessons List */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Today's Interactive Activities</span>
            </h3>

            <div className="flex flex-col gap-4">
              {pendingLessons.map((lesson) => (
                <div 
                  key={lesson.id}
                  onClick={() => onLaunchAITutor(lesson)}
                  className="bg-white border border-slate-100 p-5 rounded-3xl shadow-2xs hover:shadow-md hover:border-slate-200 hover:bg-slate-50/40 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-4 text-left">
                    <div className="w-11 h-11 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                      {lesson.type === "story" ? <BookMarked className="w-5.5 h-5.5" /> : <Volume2 className="w-5.5 h-5.5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                          {lesson.category}
                        </span>
                        <span className="text-[10px] font-semibold text-indigo-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {lesson.durationMinutes} min
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base mt-1.5">{lesson.title}</h4>
                      <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{lesson.description}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto self-end sm:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLaunchAITutor(lesson);
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <BrainCircuit className="w-3.5 h-3.5" /> Practice AI
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCompleteLesson(lesson.id);
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" /> Mark Completed
                    </button>
                  </div>
                </div>
              ))}

              {pendingLessons.length === 0 && (
                <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-3xl text-center">
                  <span className="text-3xl">🎉</span>
                  <h4 className="font-bold text-slate-900 mt-2">All Caught Up!</h4>
                  <p className="text-xs text-slate-400 mt-1">Excellent job Ama! You completed all assigned lessons for today.</p>
                </div>
              )}
            </div>
          </div>

          {/* Finished activities section */}
          {completedLessons.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-900 text-sm tracking-wide uppercase text-slate-400 mb-3 text-left">
                Completed Today ({completedLessons.length})
              </h3>
              <div className="flex flex-col gap-3 opacity-70">
                {completedLessons.map((lesson) => (
                  <div 
                    key={lesson.id}
                    className="bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                      <span className="text-slate-700 font-semibold text-sm line-through">{lesson.title}</span>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      +100 XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Gamification elements & Reflection journal */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Recent Achievement Badges widget */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm text-left">
            <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center justify-between">
              <span>My Badges</span>
              <button 
                onClick={onViewAchievements}
                className="text-[11px] font-bold text-indigo-600 hover:underline"
              >
                View All
              </button>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {student.badges.map((badge) => (
                <div 
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 ${
                    badge.unlocked 
                      ? "bg-amber-50/50 border-amber-100 text-amber-950" 
                      : "bg-slate-50/50 border-slate-100 text-slate-400 grayscale"
                  }`}
                >
                  <span className="text-2xl">
                    {badge.icon === "BookOpen" ? "📖" : badge.icon === "Flame" ? "🔥" : badge.icon === "Award" ? "🏆" : "🛡️"}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{badge.title}</p>
                    <p className="text-[10px] text-slate-400 leading-none mt-1">{badge.unlocked ? "Unlocked" : "Locked"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Reflection Journal widget */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm text-left">
            <h3 className="font-bold text-slate-900 text-base mb-2">My Reflection Journal</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Writing down your thoughts helps develop critical thinking. What did you enjoy reading most today?
            </p>

            <form onSubmit={handleSaveReflection} className="flex flex-col gap-3">
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="I enjoyed reading about Tutu the turtle because he was patient..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none font-medium"
              />

              <button
                type="submit"
                disabled={!reflectionText.trim()}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-40"
              >
                Save entry
              </button>
            </form>

            {reflectionSaved && (
              <div className="text-center text-[10px] text-emerald-600 font-bold mt-2 animate-pulse">
                ⭐ Reflection saved! You earned +10 XP!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
