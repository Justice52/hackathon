import React from "react";
import { GraduationCap, Users, Heart, Building2, BookOpen, ArrowUpRight } from "lucide-react";
import { UserRole } from "../types";

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
  onBack: () => void;
}

export default function RoleSelection({ onSelectRole, onBack }: RoleSelectionProps) {
  const roles = [
    {
      id: "student" as UserRole,
      title: "Student",
      description: "Access your personalized learning materials, chat with Liftie (AI Tutor), and complete assessments.",
      icon: GraduationCap,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-500 hover:shadow-indigo-50",
      accent: "bg-indigo-600",
      stats: "🚀 Quizzes, AI Assist, Streaks & Badges"
    },
    {
      id: "teacher" as UserRole,
      title: "Teacher",
      description: "Monitor classroom progress, check learning gap heatmaps, receive alerts for at-risk students, and assign exercises.",
      icon: Users,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-500 hover:shadow-emerald-50",
      accent: "bg-emerald-600",
      stats: "📊 Heatmaps, alerts, plans & chat sync"
    },
    {
      id: "parent" as UserRole,
      title: "Parent",
      description: "View homework progress, get recommended study tips to do at home, and message the teacher directly.",
      icon: Heart,
      color: "bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-500 hover:shadow-amber-50",
      accent: "bg-amber-600",
      stats: "🏡 Reading tasks, tips & teacher inbox"
    },
    {
      id: "admin" as UserRole,
      title: "School Administrator",
      description: "View school-wide growth analytics, teacher activities, learning risk dashboards, and export reports in CSV.",
      icon: Building2,
      color: "bg-rose-50 text-rose-600 border-rose-100 hover:border-rose-500 hover:shadow-rose-50",
      accent: "bg-rose-600",
      stats: "🏛️ Macro KPIs, trend lines & report downloads"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-center items-center py-12 px-6">
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-10 cursor-pointer" onClick={onBack}>
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200">
          <div className="relative flex items-center justify-center">
            <BookOpen className="w-5.5 h-5.5 absolute -translate-y-0.5" />
            <ArrowUpRight className="w-3.5 h-3.5 absolute translate-x-2.5 -translate-y-2.5" />
          </div>
        </div>
        <div>
          <span className="font-bold text-xl text-slate-900">Learn<span className="text-indigo-600">Lift</span></span>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none">Intervention</p>
        </div>
      </div>

      <div className="max-w-4xl w-full text-center flex flex-col items-center gap-4 mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Choose Your Role</h1>
        <p className="text-slate-500 max-w-xl text-sm sm:text-base">
          To demonstrate the early learning intervention model, select a role. You can switch between roles at any time from the navigation menu!
        </p>
      </div>

      {/* Grid of Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {roles.map((role) => {
          const IconComponent = role.icon;
          return (
            <div
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className={`p-6 bg-white border rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1 ${role.color}`}
            >
              <div className="flex flex-col gap-4 text-left">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${role.accent} text-white shadow-md`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {role.title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  {role.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  {role.stats}
                </span>
                <span className="text-indigo-600 font-bold text-xs group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                  Access &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onBack}
        className="mt-10 text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors"
      >
        &larr; Back to Landing Page
      </button>
    </div>
  );
}
