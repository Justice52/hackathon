import React, { useState } from "react";
import { GraduationCap, Users, Heart, Building2, ArrowLeft, AlertCircle, BookOpen, ArrowUpRight, Lock, Mail, User, Phone, Check } from "lucide-react";
import { UserRole } from "../types";

interface RegisterScreenProps {
  onSuccess: (user: any, rememberMe: boolean) => void;
  onBackToLogin: () => void;
}

export default function RegisterScreen({ onSuccess, onBackToLogin }: RegisterScreenProps) {
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Role Specific States
  const [studentGrade, setStudentGrade] = useState("Form 1 - Blue");
  const [classroomName, setClassroomName] = useState("Form 1 - Blue");
  const [childName, setChildName] = useState("Ama Boateng");
  const [districtName, setDistrictName] = useState("Accra Metropolitan District");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const roles = [
    { id: "student" as UserRole, title: "Student", icon: GraduationCap, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { id: "teacher" as UserRole, title: "Teacher", icon: Users, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { id: "parent" as UserRole, title: "Parent", icon: Heart, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { id: "admin" as UserRole, title: "Administrator", icon: Building2, color: "text-rose-600 bg-rose-50 border-rose-100" }
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setValidationErrors({});

    // Client-side validations
    const errors: { [key: string]: string } = {};
    if (!name.trim()) errors.name = "Full Name is required.";
    if (!username.trim()) errors.username = "Username is required.";
    if (!email.trim()) {
      errors.email = "Email Address is required.";
    } else if (!email.includes("@")) {
      errors.email = "Please enter a valid email address.";
    }
    if (!phone.trim()) errors.phone = "Phone Number is required.";
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // Collect extraInfo based on active selected role
      let extraInfo = "";
      if (selectedRole === "student") extraInfo = studentGrade;
      else if (selectedRole === "teacher") extraInfo = classroomName;
      else if (selectedRole === "parent") extraInfo = childName;
      else if (selectedRole === "admin") extraInfo = districtName;

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          username,
          phone,
          password,
          role: selectedRole,
          extraInfo
        })
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        onSuccess(data.user, rememberMe);
      } else {
        setErrorMsg(data.message || "Registration failed. Try again.");
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
        onClick={onBackToLogin}
        className="flex items-center gap-2.5 mb-6 cursor-pointer hover:opacity-90 transition-opacity"
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

      <div className="max-w-xl w-full bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-100/60 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Your Account</h2>
          <p className="text-slate-500 text-sm mt-1">Join the LearnLift Early Intervention Platform</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-start gap-2 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Role Selector Grid */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">Select your role</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {roles.map((r) => {
              const IconComp = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    isSelected 
                      ? "border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600/30" 
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className={`p-2 rounded-xl ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-500"}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{r.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (validationErrors.name) delete validationErrors.name;
                  }}
                  placeholder="Ama Boateng"
                  className={`w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border text-sm rounded-xl pl-11 pr-4 py-2.5 outline-none transition-all ${
                    validationErrors.name ? "border-red-300" : "border-slate-200 focus:border-indigo-500"
                  }`}
                />
              </div>
              {validationErrors.name && (
                <p className="text-xs text-red-600 font-semibold">{validationErrors.name}</p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (validationErrors.username) delete validationErrors.username;
                  }}
                  placeholder="amaboateng"
                  className={`w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border text-sm rounded-xl pl-11 pr-4 py-2.5 outline-none transition-all ${
                    validationErrors.username ? "border-red-300" : "border-slate-200 focus:border-indigo-500"
                  }`}
                />
              </div>
              {validationErrors.username && (
                <p className="text-xs text-red-600 font-semibold">{validationErrors.username}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationErrors.email) delete validationErrors.email;
                  }}
                  placeholder="ama@learnlift.com"
                  className={`w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border text-sm rounded-xl pl-11 pr-4 py-2.5 outline-none transition-all ${
                    validationErrors.email ? "border-red-300" : "border-slate-200 focus:border-indigo-500"
                  }`}
                />
              </div>
              {validationErrors.email && (
                <p className="text-xs text-red-600 font-semibold">{validationErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (validationErrors.phone) delete validationErrors.phone;
                  }}
                  placeholder="0244112233"
                  className={`w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border text-sm rounded-xl pl-11 pr-4 py-2.5 outline-none transition-all ${
                    validationErrors.phone ? "border-red-300" : "border-slate-200 focus:border-indigo-500"
                  }`}
                />
              </div>
              {validationErrors.phone && (
                <p className="text-xs text-red-600 font-semibold">{validationErrors.phone}</p>
              )}
            </div>
          </div>

          {/* Role-Specific Additional Fields */}
          {selectedRole === "student" && (
            <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/60 animate-in fade-in duration-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Grade / Class Assignment</label>
              <select
                value={studentGrade}
                onChange={(e) => setStudentGrade(e.target.value)}
                className="w-full bg-white border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500"
              >
                <option value="Form 1 - Blue">Form 1 - Blue (Mrs. Mensah's Main intervention class)</option>
                <option value="Form 1 - Red">Form 1 - Red</option>
                <option value="Grade 4-B">Grade 4-B</option>
              </select>
            </div>
          )}

          {selectedRole === "teacher" && (
            <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/60 animate-in fade-in duration-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Classroom Identifier Name</label>
              <input
                type="text"
                value={classroomName}
                onChange={(e) => setClassroomName(e.target.value)}
                placeholder="Form 1 - Blue"
                className="w-full bg-white border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {selectedRole === "parent" && (
            <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/60 animate-in fade-in duration-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Child's Full Name (for Student Connection)</label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Ama Boateng"
                className="w-full bg-white border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-amber-500"
              />
              <p className="text-[10px] text-slate-400">We will link your parent portal automatically to this student's intervention reports.</p>
            </div>
          )}

          {selectedRole === "admin" && (
            <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/60 animate-in fade-in duration-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">School District / Institution Name</label>
              <input
                type="text"
                value={districtName}
                onChange={(e) => setDistrictName(e.target.value)}
                placeholder="Accra Metropolitan District"
                className="w-full bg-white border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-rose-500"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) delete validationErrors.password;
                  }}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border text-sm rounded-xl pl-11 pr-4 py-2.5 outline-none transition-all ${
                    validationErrors.password ? "border-red-300" : "border-slate-200"
                  }`}
                />
              </div>
              {validationErrors.password && (
                <p className="text-xs text-red-600 font-semibold">{validationErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (validationErrors.confirmPassword) delete validationErrors.confirmPassword;
                  }}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border text-sm rounded-xl pl-11 pr-4 py-2.5 outline-none transition-all ${
                    validationErrors.confirmPassword ? "border-red-300" : "border-slate-200"
                  }`}
                />
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-xs text-red-600 font-semibold">{validationErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
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
          <div className="space-y-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-indigo-100/80 active:scale-98"
            >
              {loading ? "Registering Account..." : "Register & Sign In"}
            </button>
            
            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
