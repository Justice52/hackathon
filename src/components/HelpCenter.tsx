import React from "react";
import { HelpCircle, BookOpen, Star, Sparkles, Heart } from "lucide-react";

export default function HelpCenter() {
  const faqs = [
    {
      q: "What is LearnLift?",
      a: "LearnLift is an Early Learning Intervention Platform designed to identify hidden learning gaps (such as phonics blends, reading comprehension, or pattern recognition) before they become permanent barriers to success. It provides students with gamified lessons, teachers with risk-modeling dashboards, parents with home-support plans, and administrators with district metrics."
    },
    {
      q: "How does the AI Reading Assistant ('Liftie') work?",
      a: "Liftie is powered server-side by Google Gemini (gemini-3.5-flash). It reads stories with children, explains difficult terms using warm age-appropriate metaphors, and listens to microphone voice reading to check pronunciation confidence. (If the API key is not present in secrets, Liftie runs in a friendly local offline backup demo mode)."
    },
    {
      q: "Why is early childhood intervention critical?",
      a: "Research shows that learning gaps left unresolved by the end of primary school are extremely difficult and expensive to close later. LearnLift takes a human-centered, early-intervention stance: instead of waiting for term-end exams, it catches gaps weekly through micro-diagnostics."
    },
    {
      q: "How does the parent-teacher sync function?",
      a: "LearnLift provides dual-synchronized chat portals. When a teacher leaves an alert or recommends an exercise, the parent instantly receives tips. They can message each other directly on the platform with instant correspondence sync."
    }
  ];

  return (
    <div className="max-w-3xl w-full mx-auto px-4 py-8 font-sans text-left">
      <div className="text-center flex flex-col items-center gap-2 mb-10">
        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">Help Center &amp; Research Theory</h1>
        <p className="text-slate-500 text-sm max-w-md">Learn about early learning diagnostics, gamification, and technical specs.</p>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-2">Frequently Asked Questions</h3>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-2xs">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="text-indigo-600 font-extrabold text-sm">Q.</span>
                {faq.q}
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm mt-2.5 leading-relaxed font-medium pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Hackathon citation */}
        <div className="bg-indigo-50/50 border border-indigo-50 p-6 rounded-3xl mt-6">
          <h4 className="font-bold text-indigo-950 text-sm flex items-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            LearnLift Innovation Design Stand
          </h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            Designed and engineered for educational breakthrough, emphasizing accessible color contrasts, responsive micro-interactions, full mobile-desktop layouts, and server-side artificial intelligence interfaces. LearnLift provides immediate, actionable support.
          </p>
        </div>
      </div>
    </div>
  );
}
