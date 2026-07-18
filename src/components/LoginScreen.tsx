import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, HelpCircle, BookOpen, ArrowUpRight } from "lucide-react";

interface LoginScreenProps {
  onSuccess: (user: any, rememberMe: boolean) => void;
  onBack: () => void;
  onSignUp: () => void;
}

export default function LoginScreen({ onSuccess, onBack, onSignUp }: LoginScreenProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [validationErrors, setValidationErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  const handleForgotPassword = () => {
    alert("Password reset instructions have been sent to your registered email or phone! (Demo system simulation)");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setValidationErrors({});

    // 1. Validate all required fields
    const errors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) {
      errors.identifier = "Please enter your email, username, or phone number.";
    }
    if (!password) {
      errors.password = "Password is required.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // Verify against the database via server-side endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password })
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        onSuccess(data.user, rememberMe);
      } else {
        // Authentication fails -> Display error and do NOT redirect
        setErrorMsg(data.message || "Invalid email/username or password.");
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg("Unable to connect to server. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-6 font-sans">
      {/* Brand Header */}
      <div 
        onClick={onBack}
        className="flex items-center gap-2.5 mb-8 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200">
          <div className="relative flex items-center justify-center">
            <BookOpen className="w-5.5 h-5.5 absolute -translate-y-0.5" />
            <ArrowUpRight className="w-3.5 h-3.5 absolute translate-x-2.5 -translate-y-2.5" />
          </div>
        </div>
        <div>
          <span className="font-bold text-xl tracking-tight text-slate-950">Learn<span className="text-indigo-600">Lift</span></span>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none mt-0.5">Intervention Suite</p>
        </div>
      </div>

      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-100/60 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back to LearnLift</h2>
          <p className="text-slate-500 text-sm mt-1">Sign in to continue your learning journey</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-start gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-5">
          {/* Email / Username / Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Email Address OR Username OR Phone</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (validationErrors.identifier) {
                    setValidationErrors({ ...validationErrors, identifier: undefined });
                  }
                }}
                placeholder="ama@learnlift.com or 'teacher'"
                className={`w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border text-sm rounded-xl pl-11 pr-4 py-2.5 outline-none transition-all ${
                  validationErrors.identifier 
                    ? "border-red-300 focus:ring-2 focus:ring-red-100" 
                    : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                }`}
              />
            </div>
            {validationErrors.identifier && (
              <p className="text-xs text-red-600 font-semibold">{validationErrors.identifier}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors({ ...validationErrors, password: undefined });
                  }
                }}
                placeholder="••••••••"
                className={`w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border text-sm rounded-xl pl-11 pr-11 py-2.5 outline-none transition-all ${
                  validationErrors.password 
                    ? "border-red-300 focus:ring-2 focus:ring-red-100" 
                    : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-xs text-red-600 font-semibold">{validationErrors.password}</p>
            )}
          </div>

          {/* Options: Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4.5 h-4.5 text-indigo-600 border-slate-300 rounded-md focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-500">Remember Me</span>
            </label>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-indigo-100/80 active:scale-98 flex items-center justify-center gap-2"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            
            <button
              type="button"
              onClick={onBack}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Don't have an account?{" "}
            <button
              onClick={onSignUp}
              className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>

        {/* Demo Credentials Helper Box to make reviewing easy */}
        <div className="mt-6 p-4 bg-indigo-50/50 border border-indigo-100/40 rounded-2xl text-left">
          <h4 className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-2">💡 Demo Credentials Hint:</h4>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div>
              <p className="font-bold">Student Ama</p>
              <p className="font-mono text-[10px]">ama / password123</p>
            </div>
            <div>
              <p className="font-bold">Teacher Mrs. Mensah</p>
              <p className="font-mono text-[10px]">teacher / password123</p>
            </div>
            <div>
              <p className="font-bold">Parent Mr. Boateng</p>
              <p className="font-mono text-[10px]">parent / password123</p>
            </div>
            <div>
              <p className="font-bold">School Admin</p>
              <p className="font-mono text-[10px]">admin / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
