
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MessageCircle, Mic, X, Send, User, MicOff, Sparkles, Trash2, Maximize2, Minimize2, ShieldCheck, Check, ArrowRight, Volume2, Info, ClipboardCheck, AlertCircle, RefreshCw, PhoneOff } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { MODELS, SYSTEM_INSTRUCTION } from '../services/geminiService';
import { Message } from '../types';

interface AIAssistantWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  initialTab?: 'chat' | 'voice';
  voiceState: any;
}

// Professional Avatar URL for Hannah
const HANNAH_AVATAR = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256";

const INTAKE_STEPS = [
  { id: 'identity', label: 'Identity', question: 'What is your name?' },
  { id: 'issue', label: 'Legal Issue', question: 'What can we help with?' },
  { id: 'timeline', label: 'Timeline', question: 'When did this happen?' },
  { id: 'urgency', label: 'Urgency', question: 'Are there deadlines?' },
  { id: 'jurisdiction', label: 'Location', question: 'MO or KS?' },
  { id: 'contact', label: 'Contact', question: 'Callback number?' }
];

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  const paragraphs = text.split(/\n\n+/);
  return (
    <div className="space-y-2">
      {paragraphs.map((para, i) => {
        if (para.trim().startsWith('•') || para.trim().startsWith('-') || para.trim().startsWith('* ')) {
          const items = para.split(/\n/).filter(line => line.trim().length > 0);
          return (
            <ul key={i} className="list-disc pl-4 space-y-1">
              {items.map((item, j) => (
                <li key={j} className="pl-1">
                   <span dangerouslySetInnerHTML={{ 
                     __html: item.replace(/^[•\-*]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                   }} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} dangerouslySetInnerHTML={{ 
            __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
          }} />
        );
      })}
    </div>
  );
};

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({ isOpen, onToggle, initialTab = 'chat', voiceState }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>(initialTab);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isListeningSTT, setIsListeningSTT] = useState(false);
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const { isConnected, isSpeaking, volume, error: voiceError, connect, disconnect, isMuted, toggleMute } = voiceState;

  // Initial proactive greeting for Chat
  useEffect(() => {
    if (isOpen && chatMessages.length === 0) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setChatMessages([
          { 
            role: 'model', 
            text: 'Hello, thank you for calling Patrick Law Group. My name is Hannah, and I’m your AI legal assistant. Before we get started, may I ask whom I have the pleasure of speaking with?' 
          }
        ]);
        setIsTyping(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, chatMessages.length]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListeningSTT(false);
      };

      recognitionRef.current.onend = () => setIsListeningSTT(false);
      recognitionRef.current.onerror = () => setIsListeningSTT(false);
    }
  }, []);

  const toggleSTT = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (isListeningSTT) {
      recognitionRef.current.stop();
    } else {
      setIsListeningSTT(true);
      recognitionRef.current.start();
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Erase conversation history and start over?")) {
      setChatMessages([]);
      setCurrentStepIndex(0);
      setIsTyping(true);
      setTimeout(() => {
        setChatMessages([{ role: 'model', text: 'Hello! History cleared. My name is Hannah, how can I help you today?' }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const contextualChips = useMemo(() => {
    switch (INTAKE_STEPS[currentStepIndex].id) {
      case 'identity': return ["John Doe", "Jane Smith", "Prefer not to say"];
      case 'issue': return ["Business Dispute", "Personal Injury", "IP / Copyright", "Corporate Merger"];
      case 'timeline': return ["Today", "Within last month", "Over a year ago"];
      case 'urgency': return ["Immediate Emergency", "Notice received", "Just researching"];
      case 'jurisdiction': return ["Missouri", "Kansas", "Other"];
      case 'contact': return ["Call me", "Email me", "Text me"];
      default: return [];
    }
  }, [currentStepIndex]);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hannah_onboarding_seen');
    if (!hasSeenOnboarding && isOpen) {
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const dismissOnboarding = () => {
    localStorage.setItem('hannah_onboarding_seen', 'true');
    setShowOnboarding(false);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'voice' && !isConnected) {
        connect();
    }
  }, [isOpen, activeTab, isConnected, connect]);

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim()) return;
    
    const newMsg: Message = { role: 'user', text: textToSend };
    setChatMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      if (!await window.aistudio.hasSelectedApiKey()) await window.aistudio.openSelectKey();
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key not found.");
      
      const client = new GoogleGenAI({ apiKey });
      const history = chatMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      
      const chat: Chat = client.chats.create({
        model: MODELS.CHAT,
        history: history,
        config: { systemInstruction: SYSTEM_INSTRUCTION, tools: [{ googleSearch: {} }] }
      });
      
      const responseStream = await chat.sendMessageStream({ message: newMsg.text });
      let fullResponse = "";
      setChatMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
           fullResponse += text;
           setChatMessages(prev => {
             const newArr = [...prev];
             const lastMsg = newArr[newArr.length - 1];
             lastMsg.text = fullResponse;
             return newArr;
           });
        }
      }

      if (currentStepIndex < INTAKE_STEPS.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      }
    } catch (err: any) {
      setChatMessages(prev => [...prev, { role: 'model', text: 'I apologize, I am having trouble connecting.', isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const containerClasses = isExpanded 
    ? "fixed inset-0 md:inset-12 z-50 bg-white md:rounded-3xl shadow-2xl flex flex-col transition-all duration-500 animate-in fade-in zoom-in-95"
    : `fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-500 origin-bottom-right h-[650px] max-h-[85vh] ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`;

  const triggerScale = isConnected ? 1.0 + (volume * 0.25) : 1.0;

  // Pre-calculate content to avoid complex ternary syntax errors
  const renderVoiceContent = () => {
    if (voiceError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-300 px-8">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={40} />
          </div>
          <h4 className="text-xl font-serif font-bold text-navy-900 mb-2 text-center">Connection Refused</h4>
          <p className="text-slate-600 text-sm text-center mb-8 leading-relaxed">
            {voiceError}
          </p>
          <button 
            onClick={connect} 
            className="flex items-center gap-2 px-10 py-4 bg-navy-900 text-white font-bold rounded-2xl hover:bg-accent-600 transition-all shadow-xl"
          >
            <RefreshCw size={18} /> Retry Connection
          </button>
        </div>
      );
    }

    if (!isConnected) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in">
           <div className="w-32 h-32 rounded-full border-4 border-slate-200 overflow-hidden mb-8 opacity-50 grayscale animate-pulse">
              <img src={HANNAH_AVATAR} className="w-full h-full object-cover" alt="Hannah" />
           </div>
           <p className="text-navy-900 font-bold text-xl">Connecting Intake Line...</p>
           <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black mt-3">Establishing Secure Protocol</p>
        </div>
      );
    }

    return (
      <>
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div className="relative mb-14">
            {!isMuted && isSpeaking && (
               <div className="absolute inset-0 flex items-center justify-center scale-[1.6]">
                   <div className="w-48 h-48 border-2 border-accent-400 rounded-full animate-ping opacity-20"></div>
                   <div className="w-64 h-64 border border-accent-300 rounded-full animate-ping [animation-delay:0.5s] opacity-10"></div>
               </div>
            )}
            <div className={`w-44 h-44 rounded-full border-4 transition-all duration-500 relative z-10 overflow-hidden shadow-2xl ${isMuted ? 'border-slate-300 grayscale' : isSpeaking ? 'border-accent-500 scale-110 shadow-accent-500/40' : 'border-navy-900 shadow-navy-900/40'}`}>
              <img src={HANNAH_AVATAR} className="w-full h-full object-cover" alt="Hannah" />
            </div>
          </div>
          
          <h4 className="text-2xl font-serif font-bold text-navy-900 mb-3 h-8">
            {isMuted ? 'Line Muted' : isSpeaking ? 'Hannah Speaking' : 'Listening...'}
          </h4>
          
          <div className="flex justify-center gap-1.5 h-8 items-center">
             {[...Array(5)].map((_, i) => (
                 <div key={i} className="w-1.5 rounded-full bg-accent-500 transition-all duration-75" style={{ height: (isSpeaking || (!isMuted && volume > 0.05)) ? `${10 + (volume * (40 + i * 8))}px` : '4px' }}></div>
             ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 mb-4 w-full px-6">
            <div className="flex items-center gap-6">
              <button 
                onClick={toggleMute} 
                title={isMuted ? "Unmute" : "Mute"} 
                className={`p-6 rounded-full border shadow-xl transition-all active:scale-90 ${isMuted ? 'bg-red-50 text-red-500 border-red-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                  {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
              </button>
              <button 
                onClick={disconnect} 
                className="px-10 py-6 bg-red-600 text-white rounded-full hover:bg-red-500 font-bold flex items-center gap-2 shadow-2xl active:scale-95 transition-all uppercase tracking-widest text-sm"
              >
                  <PhoneOff size={22} /> END CALL
              </button>
            </div>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck size={12} className="text-green-500" /> Secure Live Intake Active
            </p>
        </div>
      </>
    );
  };

  return (
    <>
      {(isOpen && (isExpanded || showOnboarding)) && (
        <div className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-40 transition-opacity" />
      )}

      <div className={containerClasses} role="dialog" aria-modal="true">
        {showOnboarding && (
          <div className="absolute inset-0 z-[60] bg-navy-900/95 flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
            <div className="w-24 h-24 rounded-full border-4 border-accent-500 overflow-hidden mb-6 shadow-2xl scale-125">
               <img src={HANNAH_AVATAR} className="w-full h-full object-cover" alt="Hannah" />
            </div>
            <h4 className="text-3xl font-serif font-bold text-white mb-2">I'm Hannah</h4>
            <p className="text-slate-300 mb-8 text-lg">I'll guide you through a brief pre-screening to get you the right legal help fast.</p>
            <button onClick={dismissOnboarding} className="px-10 py-4 bg-accent-600 text-white font-bold rounded-2xl shadow-xl hover:bg-accent-500 transition-all flex items-center gap-2">
              Start Now <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="bg-navy-900 p-4 shrink-0 flex justify-between items-center text-white relative z-10 shadow-lg border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-accent-500 overflow-hidden relative shadow-md">
              <img src={HANNAH_AVATAR} className="w-full h-full object-cover" alt="Hannah" />
              {isSpeaking && <span className="absolute inset-0 border-2 border-white rounded-full animate-ping opacity-40"></span>}
            </div>
            <div>
              <h3 className="font-serif font-semibold leading-tight text-white">Hannah</h3>
              <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}></span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isConnected ? 'On Line' : 'Legal Concierge'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
              {isConnected && (
                <button 
                  onClick={disconnect} 
                  className="mr-2 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-[10px] font-black uppercase tracking-widest text-white rounded-lg flex items-center gap-1.5 transition-all shadow-lg animate-in fade-in slide-in-from-right-2"
                  title="Stop Call"
                >
                  <PhoneOff size={12} /> End Call
                </button>
              )}
              <button onClick={handleClearHistory} className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-full transition" title="Clear History">
                  <Trash2 size={18} />
              </button>
              <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition hidden md:block">
                  {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button onClick={onToggle} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition">
                  <X size={20} />
              </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-navy-800 px-4 py-2 border-t border-white/5 relative z-10">
           <div className="flex justify-between items-center mb-1.5">
              <span className="text-[9px] text-accent-400 font-black uppercase tracking-widest flex items-center gap-1">
                 <ClipboardCheck size={10} /> Case Intake Progress
              </span>
              <span className="text-[9px] text-white/40 font-bold uppercase">
                 {Math.round(((currentStepIndex + 1) / 6) * 100)}%
              </span>
           </div>
           <div className="flex gap-1">
              {INTAKE_STEPS.map((step, idx) => (
                <div key={step.id} className={`h-1 flex-1 rounded-full transition-all duration-500 ${idx <= currentStepIndex ? 'bg-accent-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]' : 'bg-white/10'}`} />
              ))}
           </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 shrink-0 bg-white shadow-sm" role="tablist">
          <button onClick={() => setActiveTab('chat')} className={`flex-1 py-3.5 text-xs font-black tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'text-accent-600 border-b-2 border-accent-600 bg-accent-50/20' : 'text-slate-500 hover:bg-slate-50'}`}>
            <MessageCircle size={14} /> CHAT
          </button>
          <button onClick={() => setActiveTab('voice')} className={`flex-1 py-3.5 text-xs font-black tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'voice' ? 'text-accent-600 border-b-2 border-accent-600 bg-accent-50/20' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Mic size={14} /> VOICE
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-50 overflow-hidden relative flex flex-col">
          {activeTab === 'chat' ? (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`flex gap-2 max-w-[92%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1 overflow-hidden border ${msg.role === 'model' ? 'border-accent-200' : 'bg-navy-100 border-navy-200'}`}>
                           {msg.role === 'model' ? <img src={HANNAH_AVATAR} className="w-full h-full object-cover" alt="Hannah" /> : <User size={14} className="text-navy-600" />}
                       </div>
                       <div className={`rounded-2xl p-3.5 text-sm shadow-sm leading-relaxed ${msg.role === 'user' ? 'bg-navy-900 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                         <FormattedText text={msg.text} />
                       </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start items-center gap-2 pl-2">
                     <div className="w-8 h-8 rounded-full border border-accent-200 overflow-hidden shrink-0">
                        <img src={HANNAH_AVATAR} className="w-full h-full object-cover" alt="Hannah" />
                     </div>
                     <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                       <span className="w-1 h-1 bg-accent-400 rounded-full animate-bounce"></span>
                       <span className="w-1 h-1 bg-accent-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                       <span className="w-1 h-1 bg-accent-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                     </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 bg-white border-t border-slate-100 space-y-3 shadow-inner">
                {!isTyping && chatMessages.length > 0 && (
                  <div className="bg-accent-50/50 border border-accent-100 rounded-xl p-2.5 flex items-center gap-3 animate-in slide-in-from-bottom-1">
                     <div className="bg-accent-100 text-accent-700 p-1.5 rounded-lg">
                        <Info size={12} />
                     </div>
                     <p className="text-[11px] font-bold text-navy-900 leading-tight">
                        <span className="text-accent-600 uppercase tracking-tighter mr-1">Current Question:</span>
                        {INTAKE_STEPS[currentStepIndex].question}
                     </p>
                  </div>
                )}

                {!isTyping && contextualChips.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide shrink-0 py-1">
                    {contextualChips.map((chip) => (
                      <button key={chip} onClick={() => handleSendMessage(chip)} className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-500 hover:border-accent-500 hover:text-accent-600 hover:bg-accent-50 transition-all shadow-sm active:scale-95">
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={isListeningSTT ? "Listening..." : "Type your response..."}
                      className={`w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm transition-all text-slate-900 placeholder:text-slate-400 ${isListeningSTT ? 'ring-2 ring-accent-500 bg-accent-50' : ''}`}
                    />
                    <button onClick={toggleSTT} title="Voice Input" className={`absolute right-1.5 top-1.5 bottom-1.5 aspect-square flex items-center justify-center rounded-lg transition-all ${isListeningSTT ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-accent-600 hover:bg-slate-100'}`}>
                      <Mic size={18} />
                    </button>
                  </div>
                  <button onClick={() => handleSendMessage()} disabled={!inputText.trim() || isTyping} className="shrink-0 w-12 h-12 bg-navy-900 text-white rounded-xl hover:bg-accent-600 transition-all flex items-center justify-center disabled:opacity-50 shadow-lg">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-between p-8 text-center bg-gradient-to-b from-white to-slate-50 overflow-hidden">
               {renderVoiceContent()}
            </div>
          )}
        </div>
      </div>

      {!isOpen && (
          <div className="fixed bottom-8 right-8 z-50 group">
            <button onClick={onToggle} className="relative w-20 h-20 rounded-full shadow-[0_20px_50px_rgba(20,184,166,0.6)] border-4 border-white overflow-hidden transition-all duration-500 hover:scale-110 active:scale-95" style={{ transform: `scale(${triggerScale})` }}>
              <img src={HANNAH_AVATAR} className="w-full h-full object-cover" alt="Hannah" />
              <div className="absolute inset-0 bg-accent-500/20 rounded-full animate-ping opacity-20 group-hover:opacity-50"></div>
              {isConnected && (
                 <div className="absolute top-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                 </div>
              )}
            </button>
            <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 pointer-events-none">
               <div className="bg-navy-900 text-white px-5 py-2.5 rounded-2xl shadow-2xl whitespace-nowrap text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Bot size={14} className="text-accent-400" /> Speak with Hannah
               </div>
            </div>
          </div>
      )}
    </>
  );
};

// Internal Bot Icon used for simple rendering
const Bot: React.FC<{ size: number, className?: string }> = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);
