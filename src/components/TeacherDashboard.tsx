import React, { useState } from "react";
import { Users, AlertTriangle, CheckCircle, TrendingUp, Sparkles, BookOpen, Clock, Heart, Trash2, Send, MessageSquare, ClipboardCheck, Plus, Check } from "lucide-react";
import { Student, ClassroomAlert, TeacherClassroom, ChatMessage } from "../types";

interface TeacherDashboardProps {
  students: Student[];
  classroom: TeacherClassroom;
  parentMessages: ChatMessage[];
  onDismissAlert: (alertId: string) => void;
  onSendMessage: (sender: "teacher" | "parent", text: string) => void;
  onAssignHomework: (studentId: string, title: string, category: "reading" | "vocabulary" | "numeracy" | "critical_thinking") => void;
}

export default function TeacherDashboard({
  students,
  classroom,
  parentMessages,
  onDismissAlert,
  onSendMessage,
  onAssignHomework
}: TeacherDashboardProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [teacherMsg, setTeacherMsg] = useState("");
  const [newHomeworkTitle, setNewHomeworkTitle] = useState("");
  const [newHomeworkCat, setNewHomeworkCat] = useState<"reading" | "vocabulary" | "numeracy" | "critical_thinking">("reading");
  const [homeworkAssignedSuccess, setHomeworkAssignedSuccess] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherMsg.trim()) return;
    onSendMessage("teacher", teacherMsg);
    setTeacherMsg("");
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !newHomeworkTitle.trim()) return;
    onAssignHomework(selectedStudent.id, newHomeworkTitle, newHomeworkCat);
    setNewHomeworkTitle("");
    setHomeworkAssignedSuccess(true);
    setTimeout(() => {
      setHomeworkAssignedSuccess(false);
    }, 3000);
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 py-6 font-sans flex flex-col gap-8 text-left">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Welcome back, Mrs. Mensah! 👋
          </h1>
          <p className="text-slate-500 text-sm">Monitor classroom risk, manage interventions, and align support with parents.</p>
        </div>

        <div className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          📍 School Year: 2026/2027 • Form 1 - Blue &amp; Red
        </div>
      </div>

      {/* Classroom stats KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-2xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-900">{students.length}</span>
            <span className="text-xs text-slate-500 font-medium">Assessed: {students.filter(s => s.assessed).length}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-2xs border-l-4 border-l-rose-500">
          <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">High Priority</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-rose-600">{classroom.highPriority}</span>
            <span className="text-xs text-rose-400 font-semibold bg-rose-50 px-2 py-0.5 rounded-full">Requires Attention</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-2xs border-l-4 border-l-amber-500">
          <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Moderate Risk</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-amber-600">{classroom.moderatePriority}</span>
            <span className="text-xs text-amber-400 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">Gap Spotted</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-2xs border-l-4 border-l-emerald-500">
          <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">On Track</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-emerald-600">{classroom.onTrack}</span>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Improving</span>
          </div>
        </div>
      </div>

      {/* Main Grid: At-Risk Grid and Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Alerts and student heatmap */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Active At-Risk Alerts */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5.5 h-5.5 text-rose-500 animate-bounce" />
              <span>Priority Intervention Alerts</span>
            </h3>

            <div className="flex flex-col gap-3">
              {classroom.alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className="bg-white border border-slate-100 p-4 rounded-3xl shadow-2xs hover:border-slate-200 transition-all flex justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={alert.studentAvatar}
                      alt={alert.studentName}
                      className="w-10 h-10 rounded-full border border-slate-200 object-cover shrink-0"
                    />
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{alert.studentName}</span>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          alert.risk === "High" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                        }`}>
                          {alert.risk} Risk
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{alert.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const s = students.find(item => item.id === alert.studentId);
                        if (s) setSelectedStudent(s);
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline px-3 py-1.5"
                    >
                      Inspect Gaps
                    </button>
                    <button
                      onClick={() => onDismissAlert(alert.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Clear alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {classroom.alerts.length === 0 && (
                <div className="bg-emerald-50/50 border border-dashed border-emerald-200 p-5 rounded-2xl text-center text-emerald-800 font-semibold text-xs flex items-center justify-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
                  <span>All priority intervention alerts cleared! Class performance is stable.</span>
                </div>
              )}
            </div>
          </div>

          {/* Student Skills Heatmap Grid */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 text-lg">Classroom Skills Heatmap</h3>
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Gaps Color-coded by score
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4 text-center">Reading</th>
                    <th className="py-3 px-4 text-center">Vocab</th>
                    <th className="py-3 px-4 text-center">Numeracy</th>
                    <th className="py-3 px-4 text-center">Logic</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {students.map((student) => {
                    const assessed = student.assessed && student.gapReport;
                    const scores = assessed ? student.gapReport?.scores : null;

                    // Color matrix utility function
                    const getCellBg = (score: number | undefined) => {
                      if (score === undefined || score === null) return "bg-slate-50 text-slate-400";
                      if (score < 50) return "bg-rose-50 text-rose-700 font-bold border border-rose-100/50";
                      if (score < 75) return "bg-amber-50 text-amber-700 font-bold border border-amber-100/50";
                      return "bg-emerald-50 text-emerald-700 font-bold border border-emerald-100/50";
                    };

                    return (
                      <tr 
                        key={student.id}
                        className="hover:bg-slate-50/60 cursor-pointer transition-colors"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-8.5 h-8.5 rounded-full border border-slate-200 object-cover"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{student.name}</p>
                            <p className="text-[10px] text-slate-400">{student.grade}</p>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className={`px-3 py-1.5 rounded-lg text-xs ${getCellBg(scores?.reading)}`}>
                            {assessed ? `${scores?.reading}%` : "-"}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className={`px-3 py-1.5 rounded-lg text-xs ${getCellBg(scores?.vocabulary)}`}>
                            {assessed ? `${scores?.vocabulary}%` : "-"}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className={`px-3 py-1.5 rounded-lg text-xs ${getCellBg(scores?.numeracy)}`}>
                            {assessed ? `${scores?.numeracy}%` : "-"}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className={`px-3 py-1.5 rounded-lg text-xs ${getCellBg(scores?.critical_thinking)}`}>
                            {assessed ? `${scores?.critical_thinking}%` : "-"}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          {assessed ? (
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              student.gapReport?.riskLevel === "High" ? "bg-rose-50 text-rose-600" : student.gapReport?.riskLevel === "Medium" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                            }`}>
                              {student.gapReport?.riskLevel} Risk
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-full">
                              Unassessed
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column: Student details card and Parent Chat synchronizer */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Selected Student Details Panel */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm text-left">
            <h3 className="font-bold text-slate-900 text-base mb-4">Intervention Inspector</h3>
            
            {selectedStudent ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{selectedStudent.name}</h4>
                    <p className="text-[11px] text-slate-400">Class: {selectedStudent.grade}</p>
                  </div>
                </div>

                {selectedStudent.assessed && selectedStudent.gapReport ? (
                  <div className="flex flex-col gap-3.5 pt-3.5 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Identified Gaps</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {selectedStudent.gapReport.weaknesses.map((weak, i) => (
                          <span key={i} className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded border border-amber-100/50">
                            {weak}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quick Homework Assigning Form */}
                    <form onSubmit={handleAssignSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-2 flex flex-col gap-3">
                      <span className="text-[11px] font-bold text-indigo-700 flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" /> Assign Targeted Homework
                      </span>
                      
                      <input
                        type="text"
                        value={newHomeworkTitle}
                        onChange={(e) => setNewHomeworkTitle(e.target.value)}
                        placeholder="e.g. Vocabulary cards chapter 3"
                        className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs outline-none font-medium"
                        required
                      />

                      <select
                        value={newHomeworkCat}
                        onChange={(e) => setNewHomeworkCat(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none font-medium text-slate-600"
                      >
                        <option value="reading">Reading Stories</option>
                        <option value="vocabulary">Vocabulary Fun</option>
                        <option value="numeracy">Numeracy Puzzles</option>
                        <option value="critical_thinking">Logical Puzzles</option>
                      </select>

                      <button
                        type="submit"
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all"
                      >
                        Assign Homework
                      </button>

                      {homeworkAssignedSuccess && (
                        <span className="text-[10px] text-emerald-600 font-bold text-center flex items-center justify-center gap-1 mt-1">
                          <Check className="w-3.5 h-3.5" /> Assigned successfully!
                        </span>
                      )}
                    </form>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs text-slate-400">Student has not completed their diagnostic assessment yet.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Select a student from the heatmap to inspect growth and assign learning plans.</p>
              </div>
            )}
          </div>

          {/* Parent-Teacher Chat inbox widget */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm text-left flex flex-col justify-between h-[380px]">
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
                <Heart className="w-4.5 h-4.5 text-rose-500" />
                <span>Parent Correspondence</span>
              </h3>
              <p className="text-[11px] text-slate-400 mb-4">Direct sync with Mr. Boateng (Ama's father)</p>

              {/* Chat messages log */}
              <div className="overflow-y-auto h-[200px] flex flex-col gap-3.5 pr-1">
                {parentMessages.map((m) => {
                  const isTeacher = m.sender === "teacher";
                  return (
                    <div 
                      key={m.id}
                      className={`flex gap-2 max-w-[90%] ${isTeacher ? "self-end flex-row-reverse" : "self-start"}`}
                    >
                      <div className={`p-3 rounded-2xl text-xs ${
                        isTeacher ? "bg-indigo-600 text-white font-medium" : "bg-slate-100 text-slate-800"
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSend} className="border-t border-slate-100 pt-3 flex gap-2">
              <input
                type="text"
                value={teacherMsg}
                onChange={(e) => setTeacherMsg(e.target.value)}
                placeholder="Type messages to send Mr. Boateng..."
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs outline-none font-medium"
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
