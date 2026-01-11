
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Mic, X, Send, Bot, User, MicOff, Sparkles, Trash2, ExternalLink, Maximize2, Minimize2, ShieldCheck } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { MODELS, SYSTEM_INSTRUCTION } from '../services/geminiService';
import { useLiveAssistant } from '../hooks/useLiveAssistant';
import { Message } from '../types';

interface AIAssistantWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  initialTab?: 'chat' | 'voice';
}

// Helper to format text with simple markdown (bold, bullets)
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

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({ isOpen, onToggle, initialTab = 'chat' }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>(initialTab);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello, thank you for calling Patrick Law Group. My name is Hannah, and I’m your AI legal assistant on a recorded line. Before we get started today, may I ask whom I have the pleasure of speaking with?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  const { isConnected, isSpeaking, volume, error: voiceError, connect, disconnect, isMuted, toggleMute } = useLiveAssistant();

  // Handle initial tab sync from props
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Keyboard navigation: Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggle]);

  // Focus trap for expanded mode
  useEffect(() => {
    if (isOpen && isExpanded && widgetRef.current) {
      const focusableElements = widgetRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabTrap = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };
      
      window.addEventListener('keydown', handleTabTrap);
      return () => window.removeEventListener('keydown', handleTabTrap);
    }
  }, [isOpen, isExpanded]);

  // AUTO-CONNECT VOICE when tab is active and widget is open
  useEffect(() => {
    if (isOpen && activeTab === 'voice' && !isConnected) {
        connect();
    } else if (!isOpen || activeTab !== 'voice') {
        disconnect();
    }
  }, [isOpen, activeTab, isConnected, connect, disconnect]);

  useEffect(() => {
    try {
      const savedHistory = sessionStorage.getItem('hannah_chat_history');
      if (savedHistory) setChatMessages(JSON.parse(savedHistory));
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
  }, []);

  useEffect(() => {
    if (chatMessages.length > 0) {
      sessionStorage.setItem('hannah_chat_history', JSON.stringify(chatMessages));
    }
  }, [chatMessages]);

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      // Focus input when chat opens or switches to chat
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, activeTab]);

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear this conversation?")) {
        const initialMsg: Message = { role: 'model', text: 'Hello, thank you for calling Patrick Law Group. My name is Hannah, and I’m your AI legal assistant on a recorded line. Before we get started today, may I ask whom I have the pleasure of speaking with?' };
        setChatMessages([initialMsg]);
        sessionStorage.setItem('hannah_chat_history', JSON.stringify([initialMsg]));
    }
  };

  const handleToggleExpand = () => setIsExpanded(!isExpanded);

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
      let groundingMetadata: any = null;
      setChatMessages(prev => [...prev, { role: 'model', text: '' }]);
      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (c.candidates?.[0]?.groundingMetadata) groundingMetadata = c.candidates[0].groundingMetadata;
        if (text) {
           fullResponse += text;
           setChatMessages(prev => {
             const newArr = [...prev];
             const lastMsg = newArr[newArr.length - 1];
             lastMsg.text = fullResponse;
             if (groundingMetadata) lastMsg.groundingMetadata = groundingMetadata;
             return newArr;
           });
        }
      }
    } catch (err: any) {
      setChatMessages(prev => [...prev, { role: 'model', text: 'I apologize, but I am having trouble connecting right now.', isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping, isExpanded]);

  useEffect(() => {
    if (!isOpen) disconnect();
  }, [isOpen, disconnect]);

  const containerClasses = isExpanded 
    ? "fixed inset-0 md:inset-12 z-50 bg-white md:rounded-2xl shadow-2xl flex flex-col transition-all duration-300 animate-in fade-in zoom-in-95"
    : "fixed bottom-6 right-6 z-50 w-[90vw] md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right h-[600px] max-h-[80vh]";

  return (
    <>
      {isOpen && isExpanded && (
        <div className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-40 transition-opacity" onClick={handleToggleExpand} />
      )}

      {isOpen && (
        <div 
          ref={widgetRef}
          className={containerClasses} 
          role="dialog" 
          aria-modal={isExpanded ? "true" : "false"}
          aria-labelledby="assistant-title"
        >
          <div className="bg-navy-900 p-4 shrink-0 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-accent-500 p-2 rounded-full shadow-lg" aria-hidden="true">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 id="assistant-title" className="font-serif font-semibold leading-tight text-lg">Hannah</h3>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true"></span>
                    <p className="text-xs text-slate-300 font-medium">AI Assistant</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
                <button 
                  onClick={handleToggleExpand} 
                  className="p-2 text-slate-400 hover:text-white hover:bg-navy-800 rounded-full transition hidden md:block"
                  aria-label={isExpanded ? "Minimize assistant" : "Maximize assistant"}
                >
                    {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button 
                  onClick={handleClearChat} 
                  className="p-2 text-slate-400 hover:text-white hover:bg-navy-800 rounded-full transition"
                  aria-label="Clear chat history"
                >
                    <Trash2 size={18} />
                </button>
                <button 
                  onClick={onToggle} 
                  className="p-2 text-slate-400 hover:text-white hover:bg-navy-800 rounded-full transition"
                  aria-label="Close assistant"
                >
                    <X size={20} />
                </button>
            </div>
          </div>

          <div className="bg-navy-800 px-4 py-1 flex justify-center border-t border-white/5">
             <span className="text-[10px] text-accent-200 uppercase tracking-wide font-medium flex items-center gap-1">
                 <ShieldCheck size={10} aria-hidden="true" /> Educational guidance only
             </span>
          </div>

          <div className="flex border-b border-slate-100 shrink-0 bg-white" role="tablist" aria-label="Assistant modes">
            <button
              id="chat-tab"
              role="tab"
              aria-selected={activeTab === 'chat'}
              aria-controls="chat-panel"
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-sm font-bold transition flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'text-accent-600 border-b-2 border-accent-600 bg-slate-50' : 'text-slate-500 hover:text-navy-900 hover:bg-slate-50'}`}
            >
              <MessageCircle size={16} aria-hidden="true" /> Chat
            </button>
            <button
              id="voice-tab"
              role="tab"
              aria-selected={activeTab === 'voice'}
              aria-controls="voice-panel"
              onClick={() => setActiveTab('voice')}
              className={`flex-1 py-3 text-sm font-bold transition flex items-center justify-center gap-2 ${activeTab === 'voice' ? 'text-accent-600 border-b-2 border-accent-600 bg-slate-50' : 'text-slate-500 hover:text-navy-900 hover:bg-slate-50'}`}
            >
              <Mic size={16} aria-hidden="true" /> Voice
            </button>
          </div>

          <div className="flex-1 bg-slate-50/50 overflow-hidden relative flex flex-col">
            <div 
              id="chat-panel"
              role="tabpanel"
              aria-labelledby="chat-tab"
              className={`h-full flex flex-col ${activeTab === 'chat' ? 'block' : 'hidden'}`}
            >
              <div 
                className="flex-1 overflow-y-auto p-4 space-y-4"
                aria-live="polite"
              >
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`flex gap-2 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1 ${msg.role === 'model' ? 'bg-accent-100 text-accent-700' : 'bg-navy-100 text-navy-700'}`} aria-hidden="true">
                           {msg.role === 'model' ? <Bot size={16} /> : <User size={16} />}
                       </div>
                       <div className={`rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-navy-900 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                         <span className="sr-only">{msg.role === 'model' ? 'Hannah said:' : 'You said:'}</span>
                         {msg.role === 'model' ? <FormattedText text={msg.text} /> : msg.text}
                         {msg.groundingMetadata?.groundingChunks && msg.groundingMetadata.groundingChunks.length > 0 && (
                           <div className="mt-3 pt-3 border-t border-slate-100" aria-label="Sources and references">
                             <div className="flex flex-wrap gap-2">
                               {msg.groundingMetadata.groundingChunks.map((chunk, cIdx) => (
                                 chunk.web?.uri && (
                                   <a key={cIdx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded text-accent-700 hover:bg-accent-50 text-xs truncate max-w-[150px]">
                                     <ExternalLink size={10} aria-hidden="true" /> {chunk.web.title || "Source"}
                                   </a>
                                 )
                               ))}
                             </div>
                           </div>
                         )}
                       </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start pl-10" aria-label="Hannah is typing">
                     <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-bounce"></span>
                       <span className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                       <span className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                     </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-2 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask Hannah anything..."
                    aria-label="Message Hannah"
                    className="flex-1 pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm transition-all"
                  />
                  <button 
                    onClick={() => handleSendMessage()} 
                    disabled={!inputText.trim() || isTyping} 
                    aria-label="Send message"
                    className="absolute right-1 top-1 bottom-1 aspect-square bg-navy-900 text-white rounded-lg hover:bg-accent-600 transition-all flex items-center justify-center disabled:opacity-50 disabled:bg-slate-300"
                  >
                    <Send size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div 
              id="voice-panel"
              role="tabpanel"
              aria-labelledby="voice-tab"
              className={`h-full flex flex-col items-center justify-center p-6 text-center relative bg-gradient-to-b from-slate-50 to-white ${activeTab === 'voice' ? 'block' : 'hidden'}`}
            >
              {!isConnected ? (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300" aria-live="polite">
                   <div className="relative">
                      <div className="absolute inset-0 bg-accent-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                      <div className="w-24 h-24 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-white">
                          <Bot size={36} className="text-white animate-bounce" aria-hidden="true" />
                      </div>
                   </div>
                   <p className="mt-8 text-navy-900 font-bold text-xl">Connecting to Hannah...</p>
                   <p className="text-slate-400 text-sm mt-1">Please wait a moment while we establish a secure line.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-between h-full w-full py-4" aria-live="polite">
                  <div className="relative w-full flex-1 flex items-center justify-center">
                     <div 
                        className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 relative z-10 border-4 border-white ${isMuted ? 'bg-slate-100' : isSpeaking ? 'bg-gradient-to-br from-accent-500 to-accent-600 scale-110 shadow-accent-500/50' : 'bg-navy-900'}`}
                        aria-hidden="true"
                      >
                        {isMuted ? <MicOff size={40} className="text-slate-300" /> : isSpeaking ? <Bot size={48} className="text-white animate-pulse" /> : <User size={40} className="text-white/90" />}
                     </div>
                     {!isMuted && isSpeaking && (
                         <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                             <div className="w-48 h-48 border-2 border-accent-400 rounded-full animate-ping opacity-20"></div>
                         </div>
                     )}
                  </div>
                  <h4 className="text-xl font-serif font-bold text-navy-900 mb-8 h-8">
                     {isMuted ? 'Microphone Muted' : isSpeaking ? 'Hannah is speaking...' : 'Listening...'}
                  </h4>
                  <div className="flex items-center gap-6 mb-6">
                      <button 
                        onClick={toggleMute} 
                        aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
                        aria-pressed={isMuted}
                        className={`p-4 rounded-full border shadow-sm transition-all ${isMuted ? 'bg-red-50 text-red-500 border-red-200' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}
                      >
                          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                      </button>
                      <button 
                        onClick={onToggle} 
                        className="px-8 py-4 bg-red-500 text-white rounded-full hover:bg-red-600 font-bold flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
                        aria-label="End voice call"
                      >
                          <X size={18} aria-hidden="true" /> End Call
                      </button>
                  </div>
                </div>
              )}
              {voiceError && (
                  <div 
                    className="absolute bottom-4 left-4 right-4 bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 animate-in fade-in"
                    role="alert"
                  >
                      {voiceError}
                  </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
          <button
            onClick={onToggle}
            className="fixed top-1/2 -translate-y-1/2 right-0 z-50 bg-accent-600 hover:bg-accent-500 text-white py-5 px-5 rounded-l-2xl shadow-2xl transition-all duration-300 flex flex-col items-center group border-y border-l border-white/20 hover:pl-8"
            aria-label="Open AI Legal Assistant"
          >
            <div className="relative">
                <MessageCircle size={36} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                </span>
            </div>
            
            <span className="absolute right-full mr-4 bg-navy-900 text-white text-[10px] font-bold px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10 uppercase tracking-widest">
                AI Assistant
            </span>
          </button>
      )}
    </>
  );
};
