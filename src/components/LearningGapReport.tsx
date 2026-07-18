import React from "react";
import { GraduationCap, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Bookmark, Sparkles, BookOpen, Clock } from "lucide-react";
import { LearningGapReport as GapReportType, GapScores } from "../types";

interface LearningGapReportProps {
  studentName: string;
  report: GapReportType;
  onStartLearning: () => void;
}

export default function LearningGapReport({ studentName, report, onStartLearning }: LearningGapReportProps) {
  const { scores, riskLevel, confidenceScore, strengths, weaknesses, recommendations, estimatedImprovementWeeks } = report;

  // SVG Coordinates setup for custom clean Radar Chart
  // Center of chart is 150, 150. Radius is 90.
  const cx = 150;
  const cy = 150;
  const r = 90;

  // 4 Axes: Reading (Top), Vocabulary (Right), Critical Thinking (Bottom), Numeracy (Left)
  const getPoint = (subject: keyof GapScores, value: number) => {
    const pct = value / 100;
    switch (subject) {
      case "reading": // Angle -90 degrees -> x = cx, y = cy - r*pct
        return { x: cx, y: cy - r * pct };
      case "vocabulary": // Angle 0 degrees -> x = cx + r*pct, y = cy
        return { x: cx + r * pct, y: cy };
      case "critical_thinking": // Angle 90 degrees -> x = cx, y = cy + r*pct
        return { x: cx, y: cy + r * pct };
      case "numeracy": // Angle 180 degrees -> x = cx - r*pct, y = cy
        return { x: cx - r * pct, y: cy };
      default:
        return { x: cx, y: cy };
    }
  };

  // Coordinates for student polygon
  const pReading = getPoint("reading", scores.reading);
  const pVocabulary = getPoint("vocabulary", scores.vocabulary);
  const pThinking = getPoint("critical_thinking", scores.critical_thinking);
  const pNumeracy = getPoint("numeracy", scores.numeracy);

  const pointsString = `${pReading.x},${pReading.y} ${pVocabulary.x},${pVocabulary.y} ${pThinking.x},${pThinking.y} ${pNumeracy.x},${pNumeracy.y}`;

  return (
    <div className="max-w-5xl w-full mx-auto px-4 py-8 font-sans">
      {/* Title Header */}
      <div className="text-center flex flex-col items-center gap-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Diagnostic Results Saved</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Learning Gap Report</h1>
        <p className="text-slate-500 max-w-xl text-sm">
          Excellent effort, {studentName}! Our early diagnostic model analyzed your performance across 4 core educational dimensions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Radar Chart Card */}
        <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-3xl shadow-lg flex flex-col items-center gap-6">
          <h3 className="font-bold text-slate-900 text-sm tracking-wide self-start uppercase text-slate-400">
            Skills Radar Profile
          </h3>

          {/* Clean Custom SVG Radar Chart */}
          <div className="relative w-[300px] h-[300px]">
            <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
              {/* Grid concentric diamonds (representing 25%, 50%, 75%, 100% boundary limits) */}
              {[0.25, 0.5, 0.75, 1.0].map((scale, index) => {
                const gr = r * scale;
                return (
                  <polygon
                    key={index}
                    points={`${cx},${cy - gr} ${cx + gr},${cy} ${cx},${cy + gr} ${cx - gr},${cy}`}
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="1.2"
                    strokeDasharray={index === 3 ? "none" : "3,3"}
                  />
                );
              })}

              {/* Grid Axis lines */}
              <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#E2E8F0" strokeWidth="1" />
              <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="#E2E8F0" strokeWidth="1" />

              {/* Axis value texts */}
              <text x={cx} y={cy - r - 12} textAnchor="middle" className="text-[11px] font-bold fill-slate-500 uppercase tracking-wider">
                Reading ({scores.reading}%)
              </text>
              <text x={cx + r + 12} y={cy + 4} textAnchor="start" className="text-[11px] font-bold fill-slate-500 uppercase tracking-wider">
                Vocabulary ({scores.vocabulary}%)
              </text>
              <text x={cx} y={cy + r + 20} textAnchor="middle" className="text-[11px] font-bold fill-slate-500 uppercase tracking-wider">
                Thinking ({scores.critical_thinking}%)
              </text>
              <text x={cx - r - 12} y={cy + 4} textAnchor="end" className="text-[11px] font-bold fill-slate-500 uppercase tracking-wider">
                Numeracy ({scores.numeracy}%)
              </text>

              {/* Fill area */}
              <polygon
                points={pointsString}
                fill="rgba(91, 76, 240, 0.15)"
                stroke="#5B4CF0"
                strokeWidth="2.5"
                className="transition-all duration-700"
              />

              {/* Data points (dots) */}
              <circle cx={pReading.x} cy={pReading.y} r="4.5" fill="#5B4CF0" className="stroke-white stroke-2" />
              <circle cx={pVocabulary.x} cy={pVocabulary.y} r="4.5" fill="#5B4CF0" className="stroke-white stroke-2" />
              <circle cx={pThinking.x} cy={pThinking.y} r="4.5" fill="#5B4CF0" className="stroke-white stroke-2" />
              <circle cx={pNumeracy.x} cy={pNumeracy.y} r="4.5" fill="#5B4CF0" className="stroke-white stroke-2" />
            </svg>
          </div>

          {/* Quick Stats list */}
          <div className="grid grid-cols-2 gap-4 w-full border-t border-slate-100 pt-5 text-center">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Confidence Score</span>
              <p className="text-xl font-bold text-slate-900">{confidenceScore}%</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Intervention Risk</span>
              <p className={`text-sm font-bold uppercase py-0.5 mt-1 rounded-md ${
                riskLevel === "High" ? "bg-red-50 text-red-600" : riskLevel === "Medium" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
              }`}>
                {riskLevel} Risk
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Educational Insights and Plan Details */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Risk Callout */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            riskLevel === "High" ? "bg-red-50/50 border-red-100 text-red-900" : "bg-amber-50/50 border-amber-100 text-amber-900"
          }`}>
            <AlertTriangle className={`w-5.5 h-5.5 shrink-0 ${riskLevel === "High" ? "text-red-500" : "text-amber-500"}`} />
            <div className="text-left text-sm">
              <span className="font-bold">Early Detection Insight: </span>
              {riskLevel === "High" 
                ? "Multiple high-risk developmental gaps detected. Recommend launching the active intervention tutoring sequence immediately." 
                : "Moderate vocabulary learning gaps detected. Targeted daily reading practice can bridge this vocabulary gap in 3 weeks."
              }
            </div>
          </div>

          {/* Strengths and Weaknesses bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strengths card */}
            <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase mb-3 bg-emerald-50 px-2.5 py-1 rounded-md">
                <CheckCircle className="w-3.5 h-3.5" /> Strengths
              </span>
              <ul className="flex flex-col gap-2">
                {strengths.map((str, i) => (
                  <li key={i} className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    {str}
                  </li>
                ))}
                {strengths.length === 0 && (
                  <li className="text-xs text-slate-400 italic">No strong indicators detected yet.</li>
                )}
              </ul>
            </div>

            {/* Weaknesses card */}
            <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase mb-3 bg-amber-50 px-2.5 py-1 rounded-md">
                <AlertTriangle className="w-3.5 h-3.5" /> Growth Gaps
              </span>
              <ul className="flex flex-col gap-2">
                {weaknesses.map((weak, i) => (
                  <li key={i} className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    {weak}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations list */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase mb-4 bg-indigo-50 px-2.5 py-1 rounded-md">
              <Sparkles className="w-3.5 h-3.5" /> Personalized Homework Directives
            </span>
            <div className="flex flex-col gap-3.5">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {rec}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-4 items-center bg-indigo-50/40 p-3.5 rounded-2xl mt-5 border border-indigo-50/80">
              <Clock className="w-5 h-5 text-indigo-600" />
              <div className="text-xs text-indigo-950 font-semibold">
                Estimated improvement cycle: <span className="text-indigo-600 underline font-bold">{estimatedImprovementWeeks} Weeks</span> with consistent app practice.
              </div>
            </div>
          </div>

          {/* CTA Submit Button */}
          <button
            onClick={onStartLearning}
            className="w-full py-4.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 text-base"
          >
            <BookOpen className="w-5 h-5" /> Start Personalized Learning Plan <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
