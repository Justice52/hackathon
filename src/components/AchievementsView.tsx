import React from "react";
import { Award, Star, Flame, Trophy, CheckCircle, ShieldCheck, Zap } from "lucide-react";
import { Student } from "../types";

interface AchievementsViewProps {
  student: Student;
  onBack: () => void;
}

export default function AchievementsView({ student, onBack }: AchievementsViewProps) {
  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-8 font-sans text-left">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
            My Achievements 🏆
          </h1>
          <p className="text-slate-500 text-sm">Every learning effort is rewarded! Keep unlocking badges.</p>
        </div>
        <button
          onClick={onBack}
          className="text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl transition-all"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-5 rounded-3xl shadow-sm">
          <p className="text-xs font-semibold text-indigo-100 uppercase tracking-wider">Overall Level</p>
          <p className="text-3xl font-black mt-1">Level {student.level}</p>
          <div className="w-full bg-indigo-400/50 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-white h-full rounded-full" style={{ width: "65%" }} />
          </div>
          <p className="text-[10px] text-indigo-200 mt-1.5 font-medium">65% to Level {student.level + 1}</p>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total XP Earned</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{student.xp} XP</p>
          <p className="text-[10px] text-emerald-500 mt-1.5 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> +200 XP earned this week
          </p>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coins Saved</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{student.coins} Coins</p>
          <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Use coins to purchase custom avatar gear</p>
        </div>
      </div>

      {/* Badges Grid */}
      <h3 className="font-bold text-slate-900 text-lg mb-4">My Badges Directory</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {student.badges.map((badge) => (
          <div 
            key={badge.id}
            className={`p-5 rounded-3xl border flex gap-4 items-start transition-all ${
              badge.unlocked 
                ? "bg-white border-amber-200 hover:shadow-md" 
                : "bg-slate-50/50 border-slate-200/50 opacity-60 grayscale"
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${
              badge.unlocked ? "bg-amber-50" : "bg-slate-100"
            }`}>
              {badge.icon === "BookOpen" ? "📖" : badge.icon === "Flame" ? "🔥" : badge.icon === "Award" ? "🏆" : "🛡️"}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">{badge.title}</h4>
                {badge.unlocked && (
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded uppercase">
                    Unlocked
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">{badge.description}</p>
              
              {badge.unlocked ? (
                <p className="text-[10px] text-slate-400 mt-2 font-semibold">
                  Date unlocked: {badge.dateUnlocked} (+{badge.xpValue} XP awarded)
                </p>
              ) : (
                <p className="text-[10px] text-indigo-600 mt-2 font-semibold">
                  Progressing... Complete tasks to unlock (+{badge.xpValue} XP reward)
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
