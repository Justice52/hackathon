import React, { useState } from "react";
import { BookOpen, Heart, Volume2, Sparkles, Send, CheckCircle, Award, ClipboardList, BookMarked, MessageSquare } from "lucide-react";
import { Student, ChatMessage } from "../types";

interface ParentDashboardProps {
  student: Student;
  parentMessages: ChatMessage[];
  onSendMessage: (sender: "teacher" | "parent", text: string) => void;
  onLaunchAITutor: () => void;
}

export default function ParentDashboard({
  student,
  parentMessages,
  onSendMessage,
  onLaunchAITutor
}: ParentDashboardProps) {
  const [parentMsg, setParentMsg] = useState("");
  const [tipsExpanded, setTipsExpanded] = useState<number | null>(0);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentMsg.trim()) return;
    onSendMessage("parent", parentMsg);
    setParentMsg("");
  };

  const tips = [
    {
      title: "📖 Interactive Evening Reading",
      content: "Spend 15 minutes reading folktales like 'The Wise Turtle' with Ama. If she gets stuck on adjectives (e.g. 'lush', 'cozy'), ask her to tap them in LearnLift or sound them out with Liftie AI."
    },
    {
      title: "🗣️ Active Vocabulary Comprehension",
      content: "Ask Ama questions about what she read. Example: 'Why did the playful monkey Momo run out of food?' It strengthens sentence structure and contextual inference."
    },
    {
      title: "🔢 Spatial Pattern Arithmetic",
      content: "Use common kitchen spoons or baskets to reinforce patterns. Have her count in pairs, or do basic visual arithmetic blocks in her LearnLift dashboard."
    }
  ];

  return (
    <div className="max-w-7xl w-full mx-auto px-4 py-6 font-sans flex flex-col gap-8 text-left">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 text-2xl font-bold border border-amber-100">
            👨‍👧
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome back, Mr. Boateng! 👋
            </h1>
            <p className="text-slate-500 text-sm">Parent Portal • Actively supporting Ama Boateng's growth</p>
          </div>
        </div>

        <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" /> Synchronized with School
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Home Intervention Plan and Tips */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Ama's Progress and Strengths Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between gap-6">
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider bg-amber-50 px-2.5 py-1 rounded-md mb-3 inline-block">
                  Ama's Improvement Journey
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Focusing on Reading &amp; Context</h3>
                <p className="text-slate-500 text-xs leading-relaxed max-w-md">
                  Ama is excelling at Numeracy (90%) and basic word recognition, but she requires guided confidence exercises in vocabulary comprehension.
                </p>
              </div>

              {/* Badges unlocked showcase */}
              <div className="flex gap-2.5 mt-5">
                <span className="text-xs font-semibold text-slate-400 self-center">Achievements:</span>
                <div className="flex gap-1.5">
                  <span className="bg-slate-50 border border-slate-100 p-1 rounded-md text-xs" title="Reading Hero">📖</span>
                  <span className="bg-slate-50 border border-slate-100 p-1 rounded-md text-xs" title="7-Day Streak">🔥</span>
                </div>
              </div>
            </div>

            {/* Micro stats widgets */}
            <div className="sm:w-[240px] flex flex-col gap-3 shrink-0">
              <div className="bg-amber-50/50 border border-amber-100/50 p-4 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Streaks of effort</span>
                <p className="text-2xl font-extrabold text-amber-600">🔥 {student.streak} Days</p>
              </div>
              <div className="bg-indigo-50/50 border border-indigo-100/50 p-4 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Active Assignments</span>
                <p className="text-2xl font-extrabold text-indigo-600">
                  {student.lessons.filter(l => !l.completed).length} Tasks
                </p>
              </div>
            </div>
          </div>

          {/* At-Home Supportive Coaching Tips */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5.5 h-5.5 text-amber-500" />
              <span>Recommended Parenting Directives</span>
            </h3>

            <div className="flex flex-col gap-3">
              {tips.map((tip, idx) => {
                const isOpen = tipsExpanded === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-2xs"
                  >
                    <button
                      onClick={() => setTipsExpanded(isOpen ? null : idx)}
                      className="w-full p-4.5 text-left font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50 flex justify-between items-center transition-colors"
                    >
                      <span>{tip.title}</span>
                      <span className="text-slate-400 text-xs font-semibold">{isOpen ? "Hide" : "Expand"}</span>
                    </button>
                    {isOpen && (
                      <div className="p-4.5 bg-slate-50/50 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {tip.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Practice voice together widget */}
          <div className="bg-amber-500 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full" />
            <div className="text-left relative z-10">
              <h4 className="font-extrabold text-lg flex items-center gap-1.5">
                <Volume2 className="w-5.5 h-5.5" /> Practice Voice Reading Together
              </h4>
              <p className="text-xs text-amber-50 mt-1 max-w-lg">
                Sit down with Ama and let her read aloud into our speech assistance interface. Liftie listens and analyzes her phonics blendings securely.
              </p>
            </div>
            <button
              onClick={onLaunchAITutor}
              className="px-5 py-3 bg-white text-amber-600 text-xs font-bold rounded-xl shadow-md hover:bg-amber-50 transition-all shrink-0 relative z-10"
            >
              Open Liftie Voice Tutor
            </button>
          </div>
        </div>

        {/* Right Column: Correspondence synchronized with Mrs. Mensah */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Active Homework tracker checklist */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm text-left">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 uppercase mb-3 bg-indigo-50 px-2.5 py-1 rounded-md">
              <ClipboardList className="w-3.5 h-3.5" /> Homework Progress
            </span>
            <div className="flex flex-col gap-3">
              {student.lessons.map((lesson) => (
                <div 
                  key={lesson.id}
                  className="flex items-center justify-between border-b border-slate-50 pb-2.5 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{lesson.type === "story" ? "📖" : "🎮"}</span>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800">{lesson.title}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{lesson.category}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                    lesson.completed ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  }`}>
                    {lesson.completed ? "Completed" : "Assigned"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher inbox synchronization */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm text-left flex flex-col justify-between h-[380px]">
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-indigo-600" />
                <span>Inbox Sync</span>
              </h3>
              <p className="text-[11px] text-slate-400 mb-4">Direct thread with class teacher Mrs. Mensah</p>

              {/* Message scroll list */}
              <div className="overflow-y-auto h-[200px] flex flex-col gap-3.5 pr-1">
                {parentMessages.map((m) => {
                  const isParent = m.sender === "parent";
                  return (
                    <div 
                      key={m.id}
                      className={`flex gap-2 max-w-[90%] ${isParent ? "self-end flex-row-reverse" : "self-start"}`}
                    >
                      <div className={`p-3 rounded-2xl text-xs ${
                        isParent ? "bg-amber-500 text-white font-medium" : "bg-slate-100 text-slate-800"
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="border-t border-slate-100 pt-3 flex gap-2">
              <input
                type="text"
                value={parentMsg}
                onChange={(e) => setParentMsg(e.target.value)}
                placeholder="Type messages to send Mrs. Mensah..."
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl px-3 py-2 text-xs outline-none font-medium"
              />
              <button
                type="submit"
                className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
