import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Mic, MicOff, Volume2, ArrowLeft, RefreshCw, Smile, AlertCircle } from "lucide-react";
import { ChatMessage } from "../types";

interface AITutorProps {
  studentId: string;
  studentName: string;
  passageContext?: string;
  lessonTitle?: string;
  interactivePrompt?: string;
  onBack: () => void;
}

export default function AITutor({ studentId, studentName, passageContext, lessonTitle, interactivePrompt, onBack }: AITutorProps) {
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const defaultInit = {
      id: "ai_init",
      sender: "ai",
      text: `Hello ${studentName}! I am **Liftie**, your cozy AI Reading Assistant. 🐢✨ I'm so excited to read with you today! \n\nWe can read stories, sound out tricky words together, or play word quizzes. What would you like to explore?`,
      timestamp: "Just Now"
    };

    if (lessonTitle && passageContext) {
      return [
        {
          id: "ai_init",
          sender: "ai",
          text: `Hello ${studentName}! 🌟 Today we are exploring the activity: **${lessonTitle}**.\n\nHere is the passage:\n\n*"${passageContext}"*\n\n**Your Interactive Goal**: ${interactivePrompt || "Let's read this story together! Ask me any questions or type your response below."}`,
          timestamp: "Just Now"
        }
      ];
    }

    return [defaultInit];
  });
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (!textToSend) setInputText("");

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Just Now"
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const savedSession = localStorage.getItem("learnlift_session") || sessionStorage.getItem("learnlift_session");
      let authHeaderValue = "";
      if (savedSession) {
        try {
          const uObj = JSON.parse(savedSession);
          authHeaderValue = uObj.id;
        } catch (e) {}
      }

      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(authHeaderValue ? { "Authorization": authHeaderValue } : {})
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ sender: m.sender, text: m.text })),
          passageContext: passageContext || "Kofi went to the market with his mother...",
          moralPrompt: "Moral of the wise turtle and monkey story"
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: "ai",
          text: data.response,
          timestamp: "Just Now"
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: "ai",
          text: "Oh no! 🍂 I had a small hiccup connecting to the educational servers. But don't worry, let's keep practicing! Speak into your microphone or try saying another word!",
          timestamp: "Just Now"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  // Speaks aloud the text using standard HTML5 SpeechSynthesis (Very impressive for hackathon!)
  const speakAloud = (text: string) => {
    if ("speechSynthesis" in window) {
      // Clean up markdown formatting symbols
      const cleanText = text.replace(/[*#_`()]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 1.1; // Friendly kid-oriented high-pitch
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not fully supported in this browser environment.");
    }
  };

  const toggleVoiceRecording = () => {
    if (recording) {
      setRecording(false);
      // Simulate recognized spoken text
      handleQuickPrompt(interactivePrompt ? `Here is my answer to the prompt: "I think patience and planning are much better than quick tricks!"` : "Listen & Repeat: 'The shiny ship carried chocolate chips.'");
    } else {
      setRecording(true);
      setTimeout(() => {
        setRecording(false);
        handleQuickPrompt(interactivePrompt ? `Here is my answer to the prompt: "I think patience and planning are much better than quick tricks!"` : "Listen & Repeat: 'The shiny ship carried chocolate chips.'");
      }, 4000);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-6 font-sans h-[calc(100vh-140px)] flex flex-col justify-between">
      {/* Top Assistance Bar */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center font-bold text-lg border border-indigo-200">
              🐢
            </div>
            <div className="text-left">
              <h4 className="font-bold text-slate-900 text-sm">Liftie • AI Reading Assistant</h4>
              <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Online &amp; Encouraging
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => speakAloud("Hi there! I am Liftie. Let's learn together!")}
          className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
          title="Speak greeting"
        >
          <Volume2 className="w-4 h-4" /> Listen
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-1 py-3 flex flex-col gap-4 text-left">
        {messages.map((m) => {
          const isAI = m.sender === "ai";
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${isAI ? "self-start" : "self-end flex-row-reverse"}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm border ${
                isAI ? "bg-indigo-100 text-indigo-700 border-indigo-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"
              }`}>
                {isAI ? "🐢" : "👦"}
              </div>

              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                isAI 
                  ? "bg-white border border-slate-100 text-slate-800 shadow-xs" 
                  : "bg-indigo-600 text-white shadow-xs font-medium"
              }`}>
                {/* Parse simple custom markdown bolding for kid display */}
                {m.text.split("\n\n").map((para, i) => {
                  return (
                    <p key={i} className="mb-2 last:mb-0">
                      {para.split("**").map((chunk, j) => {
                        if (j % 2 === 1) {
                          return <strong key={j} className={isAI ? "text-indigo-700 font-bold" : "font-extrabold text-white"}>{chunk}</strong>;
                        }
                        return chunk;
                      })}
                    </p>
                  );
                })}

                {/* Speaker button on AI messages for reading aloud */}
                {isAI && (
                  <button 
                    onClick={() => speakAloud(m.text)}
                    className="mt-2 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50/50 hover:bg-indigo-50 px-2.5 py-1 rounded-md transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Read Aloud
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 self-start items-center">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center text-sm">
              🐢
            </div>
            <div className="bg-slate-100/80 border border-slate-200/50 px-4 py-3.5 rounded-2xl text-xs font-semibold text-slate-500 animate-pulse flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>Liftie is reading and writing...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Interactive prompts recommendations */}
      <div className="py-3 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
        <button
          onClick={() => handleQuickPrompt("What is the moral of Tutu's Turtle story?")}
          className="bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all"
        >
          🐢 Explain Turtle Story moral
        </button>
        <button
          onClick={() => handleQuickPrompt("Explain the word 'Cozy' in a fun kids sentence.")}
          className="bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all"
        >
          💡 Explain 'Cozy' simply
        </button>
        <button
          onClick={() => handleQuickPrompt("Let's do a quick vocabulary game!")}
          className="bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all"
        >
          🎮 Ask me a word quiz
        </button>
      </div>

      {/* Bottom Text Inputs & Voice mic triggers */}
      <div className="border-t border-slate-100 pt-4 flex gap-3.5 items-center bg-white shrink-0">
        <button
          onClick={toggleVoiceRecording}
          className={`p-3.5 rounded-2xl flex items-center justify-center transition-all ${
            recording 
              ? "bg-red-500 text-white animate-ping" 
              : "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100"
          }`}
          title="Practice voice-reading aloud"
        >
          <Mic className="w-5 h-5" />
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex-1 flex gap-2 relative"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a word or ask Liftie to explain something..."
            className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-4 py-3.5 text-sm transition-all outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {recording && (
        <div className="text-center mt-2 text-xs font-bold text-red-500 animate-pulse">
          🎙️ Microphone active! Read out loud: "The shiny ship carried chocolate chips."
        </div>
      )}
    </div>
  );
}
