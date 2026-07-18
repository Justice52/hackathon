import React from "react";
import { BookOpen, ArrowUpRight, ShieldCheck, TrendingUp, Sparkles, User, Users, GraduationCap, Building2, Heart } from "lucide-react";
import { UserRole } from "../types";

interface WelcomeScreenProps {
  onStart: () => void;
  onSelectRole: (role: UserRole) => void;
}

export default function WelcomeScreen({ onStart, onSelectRole }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between overflow-x-hidden">
      {/* Top Bar Navigation */}
      <header className="max-w-7xl w-full mx-auto px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center">
              <BookOpen className="w-5.5 h-5.5 absolute -translate-y-0.5" />
              <ArrowUpRight className="w-3.5 h-3.5 absolute translate-x-2.5 -translate-y-2.5" />
            </div>
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-slate-950">Learn<span className="text-indigo-600">Lift</span></span>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none">Intervention</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onStart}
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={onStart}
            className="text-sm font-medium bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 transition-all active:scale-98"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Hero Showcase */}
      <main className="max-w-7xl w-full mx-auto px-6 py-12 lg:py-20 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Text details */}
        <div className="lg:col-span-6 flex flex-col items-start gap-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hackathon Project Showcase</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-1.1">
            Every learner deserves to be <span className="text-indigo-600 underline decoration-indigo-300 decoration-wavy">seen</span> before they fall behind.
          </h1>

          <p className="text-slate-500 text-lg sm:text-xl leading-relaxed max-w-xl">
            LearnLift is an Early Learning Intervention Platform designed to identify hidden learning gaps, personalize study paths, and connect students, teachers, and parents before failure occurs.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={onStart}
              className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-98"
            >
              Get Started Now
            </button>
            <a
              href="#roles"
              className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 shadow-xs"
            >
              Explore Roles
            </a>
          </div>

          {/* Social Proof metrics */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 w-full">
            <div>
              <p className="text-2xl font-bold text-slate-900">100%</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Early Detection</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600">3 Weeks</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Avg. Turnaround</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">4 Core</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Key Dashboards</p>
            </div>
          </div>
        </div>

        {/* Right Column Interactive Mockup illustration */}
        <div className="lg:col-span-6 relative flex justify-center">
          <div className="absolute -inset-4 bg-radial from-indigo-100/60 to-transparent blur-3xl rounded-full -z-10" />
          
          <div className="relative bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-xl max-w-lg w-full flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Ama"
                  className="w-12 h-12 rounded-full border-2 border-indigo-100 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Ama Boateng</h4>
                  <p className="text-xs text-slate-400">Student • Form 1 - Blue</p>
                </div>
              </div>
              <div className="bg-amber-50 text-amber-600 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Level 5</span>
              </div>
            </div>

            {/* Quick Micro Diagnostic Card Visual */}
            <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-3 border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Active Learning Plan</span>
                <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Progress: 72%</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">Reading Comprehension &amp; Phonics</p>
              
              {/* Fake animated progress */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full w-[72%] animate-pulse" />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Weekly diagnostic completed successfully</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400">Early Intervention Impact</span>
                <span className="text-xs text-emerald-500 font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +12% growth
                </span>
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1 bg-indigo-50/60 border border-indigo-50 p-3 rounded-xl text-center">
                  <p className="text-xs text-slate-400 font-medium">Confidence</p>
                  <p className="text-lg font-bold text-slate-900">72%</p>
                </div>
                <div className="flex-1 bg-emerald-50/60 border border-emerald-50 p-3 rounded-xl text-center">
                  <p className="text-xs text-slate-400 font-medium">Daily Streak</p>
                  <p className="text-lg font-bold text-emerald-600 flex items-center justify-center gap-1">
                    🔥 12
                  </p>
                </div>
                <div className="flex-1 bg-indigo-50/60 border border-indigo-50 p-3 rounded-xl text-center">
                  <p className="text-xs text-slate-400 font-medium">Risk Profiling</p>
                  <p className="text-sm font-bold text-amber-500 bg-amber-50 rounded-md py-0.5 mt-1">Medium</p>
                </div>
              </div>
            </div>

            <button 
              onClick={onStart}
              className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-sm transition-all"
            >
              Take Demo Walkthrough
            </button>
          </div>
        </div>
      </main>

      {/* Role Selection Drawer section */}
      <section id="roles" className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-7xl w-full mx-auto">
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-3 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Choose Your Persona</h2>
            <p className="text-slate-400">
              Select one of the roles below to experience their dedicated workflow, synchronization features, and diagnostics tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Student card */}
            <div 
              onClick={() => onSelectRole("student")}
              className="bg-slate-800 border border-slate-700 hover:border-indigo-500 p-6 rounded-3xl hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Student Flow</h3>
                <p className="text-slate-400 text-sm">
                  Take the diagnostic quiz, view learning gap reports, and interact with the Gemini AI Reading Assistant.
                </p>
              </div>
              <span className="text-indigo-400 text-xs font-semibold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch Student Dashboard &rarr;
              </span>
            </div>

            {/* Teacher card */}
            <div 
              onClick={() => onSelectRole("teacher")}
              className="bg-slate-800 border border-slate-700 hover:border-emerald-500 p-6 rounded-3xl hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Teacher Dashboard</h3>
                <p className="text-slate-400 text-sm">
                  Monitor at-risk alerts, inspect learning gap heatmaps, and assign targeted homework plans.
                </p>
              </div>
              <span className="text-emerald-400 text-xs font-semibold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch Teacher Dashboard &rarr;
              </span>
            </div>

            {/* Parent card */}
            <div 
              onClick={() => onSelectRole("parent")}
              className="bg-slate-800 border border-slate-700 hover:border-amber-500 p-6 rounded-3xl hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Parent Portal</h3>
                <p className="text-slate-400 text-sm">
                  View child's homework recommendations, daily progress, and chat directly with teacher Mrs. Mensah.
                </p>
              </div>
              <span className="text-amber-400 text-xs font-semibold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch Parent Dashboard &rarr;
              </span>
            </div>

            {/* School Admin card */}
            <div 
              onClick={() => onSelectRole("admin")}
              className="bg-slate-800 border border-slate-700 hover:border-rose-500 p-6 rounded-3xl hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-rose-600 group-hover:text-white transition-all">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">School Admin</h3>
                <p className="text-slate-400 text-sm">
                  Track macro student metrics, intervention rates, gap distributions, and export reports instantly.
                </p>
              </div>
              <span className="text-rose-400 text-xs font-semibold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch School Admin Dashboard &rarr;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer copyright */}
      <footer className="bg-slate-950 text-slate-500 py-6 border-t border-slate-800 text-center text-xs">
        <p>© 2026 LearnLift Early Intervention Platform. Designed for the Education Innovation Hackathon.</p>
        <p className="text-indigo-400 mt-1 font-semibold">"Every learner deserves to be seen before they fall behind."</p>
      </footer>
    </div>
  );
}
