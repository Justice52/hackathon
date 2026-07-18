import React, { useState } from "react";
import { Building2, Download, CheckCircle, TrendingUp, Sparkles, PieChart, BarChart2, ShieldAlert, FileSpreadsheet, RefreshCw } from "lucide-react";
import { Student } from "../types";

interface AdminDashboardProps {
  students: Student[];
  onResetDb: () => void;
}

export default function AdminDashboard({ students, onResetDb }: AdminDashboardProps) {
  const [exporting, setExporting] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const totalAssessed = students.filter(s => s.assessed).length;
  const highRisk = students.filter(s => s.assessed && s.gapReport?.riskLevel === "High").length;
  const mediumRisk = students.filter(s => s.assessed && s.gapReport?.riskLevel === "Medium").length;
  const lowRisk = students.filter(s => s.assessed && s.gapReport?.riskLevel === "Low").length;

  const handleExport = (format: "csv" | "pdf") => {
    setExporting(format);
    setSuccessMsg("");
    setTimeout(() => {
      setExporting(null);
      setSuccessMsg(`Successfully generated and downloaded LearnLift_${Date.now()}.${format}`);
    }, 2500);
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 py-6 font-sans flex flex-col gap-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
            School District Insights <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded font-bold uppercase tracking-wider">Super Administrator</span>
          </h1>
          <p className="text-slate-500 text-sm">Review macro district-level learning intervention impact, risk ratios, and gap distributions.</p>
        </div>

        <button
          onClick={onResetDb}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
        >
          Reset Demo Data
        </button>
      </div>

      {/* Macro stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-2xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{students.length} Students</p>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-2xs">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Assessed Rate</p>
          <p className="text-3xl font-bold text-indigo-600 mt-1">
            {Math.round((totalAssessed / students.length) * 100)}%
          </p>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-2xs">
          <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Average Intervention Speed</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">3.2 Weeks</p>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-2xs">
          <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">Active Risk Index</p>
          <p className="text-3xl font-bold text-rose-600 mt-1">
            {Math.round(((highRisk + mediumRisk) / students.length) * 100)}%
          </p>
        </div>
      </div>

      {/* Grid of charts and distribution logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Gap distribution bars & Export generators */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Learning gaps distribution bars */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <PieChart className="w-5.5 h-5.5 text-indigo-600" />
              <span>Identified Growth Gap Distributions</span>
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Reading Comprehension</span>
                  <span>40% (4 Students Affected)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full w-[40%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Vocabulary Range &amp; Lexicon</span>
                  <span>28% (3 Students Affected)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full w-[28%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Basic Arithmetic foundations</span>
                  <span>18% (2 Students Affected)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full w-[18%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Sentence Grammar &amp; Mechanics</span>
                  <span>10% (1 Student Affected)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full w-[10%]" />
                </div>
              </div>
            </div>
          </div>

          {/* District Growth Trends */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm text-left">
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <BarChart2 className="w-5.5 h-5.5 text-indigo-600" />
              <span>Intervention Impact Trend (District-wide)</span>
            </h3>

            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-indigo-50/50 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Pre-Intervention</span>
                <p className="text-lg font-bold text-slate-700 mt-1">32% score avg</p>
              </div>
              <div className="bg-indigo-50/50 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Week 2 Focus</span>
                <p className="text-lg font-bold text-indigo-600 mt-1">48% score avg</p>
              </div>
              <div className="bg-indigo-50/50 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Week 4 Focus</span>
                <p className="text-lg font-bold text-indigo-600 mt-1">64% score avg</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <span className="text-[10px] text-emerald-600 font-bold uppercase">Week 6 Recovery</span>
                <p className="text-lg font-bold text-emerald-700 mt-1">82% score avg</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Export Generators & logs */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Quick report exporter panel */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm text-left">
            <h3 className="font-bold text-slate-900 text-base mb-2">Export Data Reports</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Export diagnostic results and learning progress statistics as spreadsheets for reporting to state and parent boards.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleExport("csv")}
                className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                disabled={exporting !== null}
              >
                {exporting === "csv" ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4" />
                )}
                {exporting === "csv" ? "Exporting CSV..." : "Export CSV Spreadsheet"}
              </button>

              <button
                onClick={() => handleExport("pdf")}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                disabled={exporting !== null}
              >
                {exporting === "pdf" ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {exporting === "pdf" ? "Exporting PDF..." : "Export PDF Summary Report"}
              </button>

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-[10px] text-emerald-700 font-semibold rounded-lg mt-2 text-center animate-pulse">
                  {successMsg}
                </div>
              )}
            </div>
          </div>

          {/* Secure Audit Trail / Logs */}
          <div className="bg-slate-900 text-slate-400 p-5 rounded-3xl shadow-sm text-left font-mono text-[10px] flex flex-col gap-3">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-300 font-bold uppercase text-[9px]">District Action Log</span>
              <span className="text-indigo-400">● Live Feed</span>
            </div>
            
            <div className="flex flex-col gap-2 leading-relaxed">
              <p><span className="text-slate-500">[10:45 AM]</span> Student 'Ama Boateng' completed lesson: 'The Wise Turtle' (+100 XP)</p>
              <p><span className="text-slate-500">[10:24 AM]</span> ALERT TRIGGERED: 'Kofi Mensah' high priority reading deficit spotted</p>
              <p><span className="text-slate-500">[09:12 AM]</span> Teacher Mrs. Mensah dismissed 2 alert warnings</p>
              <p><span className="text-slate-500">[08:00 AM]</span> Automated system synchronizer backed up 5 student gap profiles to local store</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
