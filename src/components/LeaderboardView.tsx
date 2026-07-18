import React, { useState } from "react";
import { 
  Crown, Share2, Flame, Trophy, Sparkles, ChevronRight, 
  ArrowLeft, Heart, Send, Search, Award, Copy, Check, Star 
} from "lucide-react";
import { Student } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface LeaderboardViewProps {
  currentStudent: Student;
  allStudents: Student[];
  onBack: () => void;
  onUpdateStudent: (updated: Student) => void;
}

export default function LeaderboardView({ 
  currentStudent, 
  allStudents, 
  onBack, 
  onUpdateStudent 
}: LeaderboardViewProps) {
  const [filter, setFilter] = useState<"all" | "weekly" | "grade">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [cheersSent, setCheersSent] = useState<{ [studentId: string]: string }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter students
  const filteredStudents = allStudents
    .filter(s => {
      if (filter === "grade") {
        return s.grade === currentStudent.grade;
      }
      return true;
    })
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    // Sort by XP descending
    .sort((a, b) => b.xp - a.xp);

  // Find ranks
  const currentRankIndex = filteredStudents.findIndex(s => s.id === currentStudent.id);
  const currentRank = currentRankIndex !== -1 ? currentRankIndex + 1 : 1;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyShareText = () => {
    const text = `🏰 I'm learning on LearnLift! I'm ranked #${currentRank} with ${currentStudent.xp} XP and keeping a 🔥 ${currentStudent.streak}-day streak alive! Can you beat my score? 🚀`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("🎉 Copied share message to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendCheer = (studentId: string, studentName: string, emoji: string) => {
    setCheersSent(prev => ({
      ...prev,
      [studentId]: emoji
    }));
    showToast(`💖 You sent a "${emoji}" cheer to ${studentName.split(" ")[0]}!`);
    
    // Add 5 XP to current student for being encouraging!
    const updated = {
      ...currentStudent,
      xp: currentStudent.xp + 5
    };
    onUpdateStudent(updated);
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-6 font-sans flex flex-col gap-6 text-left relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-800"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 transition-all shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Leaderboard Arena</h1>
            <p className="text-xs text-slate-500 font-medium">Celebrate progress and challenge your friends!</p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Leaderboard Card */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          {/* Filters & Search Header */}
          <div className="p-5 border-b border-slate-100 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              {/* Filter Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  All-Time
                </button>
                <button
                  onClick={() => setFilter("grade")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filter === "grade" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  My Grade
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search classmate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl pl-9 pr-4 py-2 text-xs font-medium outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Leaderboard Rankings List */}
          <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto">
            {filteredStudents.map((student, idx) => {
              const rank = idx + 1;
              const isMe = student.id === currentStudent.id;
              const isFirst = rank === 1;
              const isSecond = rank === 2;
              const isThird = rank === 3;

              return (
                <div 
                  key={student.id}
                  className={`p-4.5 flex items-center justify-between gap-4 transition-all ${
                    isMe 
                      ? "bg-indigo-50/60 border-y border-indigo-100/40" 
                      : "hover:bg-slate-50/40"
                  }`}
                >
                  {/* Left: Rank, Avatar, Name */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Rank indicator */}
                    <div className="w-8 flex justify-center items-center shrink-0">
                      {isFirst ? (
                        <Crown className="w-6 h-6 text-amber-500 fill-amber-100 drop-shadow-xs" />
                      ) : isSecond ? (
                        <Award className="w-5.5 h-5.5 text-slate-400 fill-slate-50" />
                      ) : isThird ? (
                        <Award className="w-5.5 h-5.5 text-amber-600 fill-amber-50" />
                      ) : (
                        <span className="text-xs font-extrabold text-slate-400">#{rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img 
                        src={student.avatar} 
                        alt={student.name}
                        className={`w-11 h-11 rounded-full object-cover border-2 ${
                          isMe ? "border-indigo-500 shadow-md shadow-indigo-100" : "border-slate-200"
                        }`}
                      />
                      {student.streak >= 3 && (
                        <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 text-[8px] leading-none shadow-sm flex items-center justify-center border border-white">
                          🔥
                        </span>
                      )}
                    </div>

                    {/* Name & Grade */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-bold truncate ${isMe ? "text-indigo-950" : "text-slate-800"}`}>
                          {student.name}
                        </span>
                        {isMe && (
                          <span className="bg-indigo-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                        {student.grade}
                      </p>
                    </div>
                  </div>

                  {/* Right: XP, Streak and Encouragement Cheer */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500 shrink-0" />
                        <span className="text-sm font-black text-slate-900">{student.xp}</span>
                        <span className="text-[10px] font-bold text-slate-400">XP</span>
                      </div>
                      <p className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5 justify-end">
                        🔥 {student.streak} day streak
                      </p>
                    </div>

                    {/* Classmate cheer button */}
                    {!isMe && (
                      <div className="flex gap-1 bg-slate-50 border border-slate-100 p-1 rounded-xl">
                        {["🔥", "👍", "👏"].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleSendCheer(student.id, student.name, emoji)}
                            className="w-6 h-6 hover:scale-125 transition-transform text-xs flex items-center justify-center bg-white border border-slate-100 rounded-lg shadow-2xs hover:bg-slate-50 cursor-pointer"
                            title={`Send ${emoji} Cheer!`}
                          >
                            {cheersSent[student.id] === emoji ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredStudents.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-slate-400 font-bold">No classmates found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Player Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Current Student's Standing Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden text-left">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/20 rounded-full" />
            <div className="absolute -left-6 -top-6 w-24 h-24 bg-violet-500/20 rounded-full" />
            
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-lg">
                  Rank Standing
                </span>
                <Trophy className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
              </div>

              <div className="flex items-center gap-3.5">
                <img 
                  src={currentStudent.avatar} 
                  alt={currentStudent.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/80"
                />
                <div>
                  <h3 className="text-lg font-bold">{currentStudent.name}</h3>
                  <p className="text-xs text-indigo-100 font-medium">Currently ranked #{currentRank} overall</p>
                </div>
              </div>

              <div className="border-t border-white/10 my-1" />

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 p-2.5 rounded-xl text-center">
                  <p className="text-[9px] text-indigo-200 uppercase font-black tracking-wider leading-none">Days Active</p>
                  <p className="text-lg font-extrabold mt-1 text-amber-300">🔥 {currentStudent.streak} Days</p>
                </div>
                <div className="bg-white/10 p-2.5 rounded-xl text-center">
                  <p className="text-[9px] text-indigo-200 uppercase font-black tracking-wider leading-none">Total Score</p>
                  <p className="text-lg font-extrabold mt-1 text-white">⭐ {currentStudent.xp} XP</p>
                </div>
              </div>

              {/* Share Streak button */}
              <button
                onClick={() => setShowShareModal(true)}
                className="w-full mt-2 py-3 bg-white hover:bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black shadow-md shadow-indigo-800/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share My Standing!</span>
              </button>
            </div>
          </div>

          {/* Social Milestones Card */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs text-left">
            <h3 className="font-bold text-slate-900 text-sm mb-3.5 flex items-center gap-1.5">
              <Flame className="w-4.5 h-4.5 text-amber-500" />
              <span>Streak Milestones</span>
            </h3>

            <div className="space-y-3">
              {[
                { name: "Three-Day Flame", desc: "Keep learning for 3 straight days", target: 3, xp: 50 },
                { name: "Super Seven", desc: "Complete daily quests for 7 straight days", target: 7, xp: 150 },
                { name: "Unstoppable Fortnight", desc: "Maintain learning flow for 14 straight days", target: 14, xp: 400 }
              ].map(m => {
                const completed = currentStudent.streak >= m.target;
                const progressPercent = Math.min((currentStudent.streak / m.target) * 100, 100);

                return (
                  <div key={m.name} className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className={`text-xs font-bold ${completed ? "text-indigo-950" : "text-slate-700"}`}>
                          {m.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold">{m.desc}</p>
                      </div>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${
                        completed ? "bg-emerald-100 text-emerald-800" : "bg-indigo-50 text-indigo-700"
                      }`}>
                        +{m.xp} XP
                      </span>
                    </div>

                    <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden relative">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          completed ? "bg-emerald-500" : "bg-indigo-600"
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                      <span>{currentStudent.streak}/{m.target} Days</span>
                      <span>{completed ? "Completed!" : `${Math.round(progressPercent)}%`}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-md w-full rounded-3xl border border-slate-100 shadow-2xl p-6 relative overflow-hidden"
            >
              {/* Decorative sparkle bg */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -z-0 opacity-40 translate-x-12 -translate-y-12" />

              <div className="relative z-10 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center text-3xl">
                  🏆
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">Bragging Rights Secured!</h3>
                  <p className="text-xs text-slate-400 mt-1">Copy and share this status directly with family or friends!</p>
                </div>

                {/* Styled Share Box Preview */}
                <div className="w-full bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl text-left relative group">
                  <p className="text-xs font-bold text-slate-700 leading-relaxed italic pr-8">
                    "🏰 I'm learning on LearnLift! I'm ranked #{currentRank} with {currentStudent.xp} XP and keeping a 🔥 {currentStudent.streak}-day streak alive! Can you beat my score? 🚀"
                  </p>
                  <button 
                    onClick={handleCopyShareText}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-indigo-600"
                    title="Copy Text"
                  >
                    {copied ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <Copy className="w-4.5 h-4.5" />}
                  </button>
                </div>

                <div className="flex gap-3 w-full mt-2">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer"
                  >
                    Close Window
                  </button>
                  <button
                    onClick={handleCopyShareText}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy status</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
