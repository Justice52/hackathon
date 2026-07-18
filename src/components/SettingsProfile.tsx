import React from "react";
import { User, Shield, Key, Bell, RefreshCw, Check, BookOpen } from "lucide-react";
import { Student } from "../types";

interface SettingsProfileProps {
  student: Student;
  onResetDb: () => void;
}

export default function SettingsProfile({ student, onResetDb }: SettingsProfileProps) {
  const [resetting, setResetting] = React.useState(false);
  const [resetSuccess, setResetSuccess] = React.useState(false);

  const triggerReset = () => {
    setResetting(true);
    setResetSuccess(false);
    setTimeout(async () => {
      onResetDb();
      setResetting(false);
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-3xl w-full mx-auto px-4 py-8 font-sans text-left">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Platform Settings</h1>
      <p className="text-slate-500 text-sm mb-8">Manage your LearnLift credentials, security rules, and diagnostic database state.</p>

      <div className="flex flex-col gap-6">
        {/* Profile Card */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-14 h-14 rounded-full border-2 border-indigo-100 object-cover"
          />
          <div>
            <h3 className="font-bold text-slate-900 text-base">{student.name}</h3>
            <p className="text-xs text-slate-400">Student Profile • {student.grade}</p>
          </div>
        </div>

        {/* Database state resetting (Hackathon judge tool!) */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
          <div className="flex items-start gap-3.5">
            <span className="text-2xl">⚙️</span>
            <div>
              <h4 className="font-bold text-slate-900">Developer &amp; Hackathon Reset Sandbox</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Reset the mock synchronizer database state back to the original unassessed values so that you or the judges can run through the diagnostic assessment flow and alerts again.
              </p>

              <button
                onClick={triggerReset}
                disabled={resetting}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
              >
                {resetting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                {resetting ? "Resetting database..." : "Reset Sandbox Database"}
              </button>

              {resetSuccess && (
                <p className="text-xs text-emerald-600 font-bold mt-2.5 flex items-center gap-1">
                  <Check className="w-4 h-4" /> State reset successfully! Run through student diagnostics to re-test synchronization.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* System Settings metadata info */}
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl text-slate-500 text-xs flex flex-col gap-2 leading-relaxed">
          <p className="font-bold text-slate-700">Platform Credentials Information:</p>
          <p>• <strong>Mock Authing Layer:</strong> Authenticated as <code>Ama Boateng</code> for student flow, Mr. Boateng for parent flow, and Mrs. Mensah for teaching dashboard.</p>
          <p>• <strong>Gemini AI Model:</strong> <code>gemini-3.5-flash</code> configured server-side for reading assistant, phonetic matching and comprehension support.</p>
          <p>• <strong>Accessibility Status:</strong> Color contrast compliance enabled by default. Screen reader tags added.</p>
        </div>
      </div>
    </div>
  );
}
