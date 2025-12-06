
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Mic, X, Send, Bot, User, MicOff, Sparkles, Trash2, ExternalLink, BookOpen } from 'lucide-react';
import { ai, MODELS, SYSTEM_INSTRUCTION } from '../services/geminiService';
import { useLiveAssistant } from '../hooks/useLiveAssistant';
import { GenerateContentResponse, Chat } from "@google/genai";
import { Message } from '../types';

interface AIAssistantWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Helper to format text with simple markdown (bold, bullets)
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  // Split by double newlines for paragraphs
  const paragraphs = text.split(/\n\n+/);

  return (
    <div className="space-y-2">
      {paragraphs.map((para, i) => {
        // Handle Bullet points
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

        // Standard paragraph with bold formatting
        return (
          <p key={i} dangerouslySetInnerHTML={{ 
            __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
          }} />
        );
      })}
    </div>
  );
};

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({ isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('chat');
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello, thank you for calling Patrick Law Group. My name is Hannah, and I’m your AI legal assistant on a recorded line. I’m here to learn about your situation and help connect you with the right attorney for a FREE consultation. How can I assist you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hook for Live Audio API
  const { isConnected, isSpeaking, volume, error: voiceError, connect, disconnect, isMuted, toggleMute } = useLiveAssistant();

  // Conversation Starters
  const starters = [
    "I was in a car accident",
    "I need to start a business",
    "Review a contract",
    "Intellectual Property help"
  ];

  const handleStarterClick = (text: string) => {
      setInputText(text);
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear this conversation?")) {
        setChatMessages([
            { role: 'model', text: 'Hello, thank you for calling Patrick Law Group. My name is Hannah, and I’m your AI legal assistant on a recorded line. I’m here to learn about your situation and help connect you with the right attorney for a FREE consultation. How can I assist you today?' }
        ]);
    }
  };

  // Chat Logic
  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim()) return;

    const newMsg: Message = { role: 'user', text: textToSend };
    setChatMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const chat: Chat = ai.chats.create({
        model: MODELS.CHAT,
        config: { 
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }] // Enable Grounding
        }
      });
      
      // Rebuild history for context
      // Note: We don't pass previous grounding metadata back to history in this simple implementation
      // typically you would clean the history to just text parts.
      const history = chatMessages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
      }));

      const responseStream = await chat.sendMessageStream({ message: newMsg.text });
      
      let fullResponse = "";
      let groundingMetadata: any = null;

      setChatMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        
        // Capture grounding metadata if available in any chunk
        if (c.candidates?.[0]?.groundingMetadata) {
           groundingMetadata = c.candidates[0].groundingMetadata;
        }

        if (text) {
           fullResponse += text;
           setChatMessages(prev => {
             const newArr = [...prev];
             const lastMsg = newArr[newArr.length - 1];
             lastMsg.text = fullResponse;
             // Update metadata if found
             if (groundingMetadata) {
               lastMsg.groundingMetadata = groundingMetadata;
             }
             return newArr;
           });
        }
      }
    } catch (err: any) {
      // Handle "Requested entity was not found" error
      const errStr = err.message || String(err);
      if (errStr.includes('Requested entity was not found') || errStr.includes('404')) {
          try {
            await (window as any).aistudio?.openSelectKey();
          } catch(e) {
            console.error(e);
          }
      }
      setChatMessages(prev => [...prev, { role: 'model', text: 'I apologize, but I am having trouble connecting right now.', isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (!isOpen) {
        disconnect(); // Ensure mic is off if closed
    }
  }, [isOpen, disconnect]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Main Widget Panel */}
      {isOpen && (
        <div className="mb-4 w-[90vw] md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right h-[600px] max-h-[80vh]">
          
          {/* Header */}
          <div className="bg-navy-900 p-4 shrink-0">
            <div className="flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <div className="bg-accent-500 p-1.5 rounded-full">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold leading-tight">Hannah (AI Assistant)</h3>
                  <p className="text-xs text-slate-300">Patrick Law Firm</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                  <button 
                      onClick={handleClearChat} 
                      className="p-2 text-slate-400 hover:text-white hover:bg-navy-800 rounded-full transition"
                      title="Clear Conversation"
                  >
                      <Trash2 size={18} />
                  </button>
                  <button onClick={onToggle} className="p-2 text-slate-400 hover:text-white hover:bg-navy-800 rounded-full transition">
                      <X size={20} />
                  </button>
              </div>
            </div>
            {/* Header Disclaimer */}
            <div className="mt-2 inline-block">
                <span className="text-[10px] text-accent-200 bg-navy-800/80 px-2 py-0.5 rounded border border-navy-700/50 uppercase tracking-wide font-medium">
                    No legal advice – info only
                </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100 shrink-0">
            <button
              onClick={() => { setActiveTab('chat'); disconnect(); }}
              className={`flex-1 py-3 text-sm font-medium transition ${activeTab === 'chat' ? 'text-accent-600 border-b-2 border-accent-600' : 'text-slate-500 hover:text-navy-900'}`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`flex-1 py-3 text-sm font-medium transition ${activeTab === 'voice' ? 'text-accent-600 border-b-2 border-accent-600' : 'text-slate-500 hover:text-navy-900'}`}
            >
              Voice Call
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-slate-50 overflow-hidden relative flex flex-col">
            
            {/* CHAT TAB */}
            {activeTab === 'chat' && (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Date Stamp */}
                  <div className="text-center text-xs text-slate-400 my-2">Today</div>
                  
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-navy-900 text-white rounded-br-none shadow-md' 
                          : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                      }`}>
                        {msg.role === 'model' ? <FormattedText text={msg.text} /> : msg.text}
                      </div>

                      {/* Grounding Sources (Sources) */}
                      {msg.groundingMetadata?.groundingChunks && msg.groundingMetadata.groundingChunks.length > 0 && (
                        <div className="mt-2 max-w-[85%] bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs">
                          <div className="flex items-center gap-1 text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                            <BookOpen size={10} /> Sources
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.groundingMetadata.groundingChunks.map((chunk, cIdx) => (
                              chunk.web?.uri && (
                                <a 
                                  key={cIdx} 
                                  href={chunk.web.uri} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded text-accent-600 hover:text-accent-700 hover:border-accent-300 transition truncate max-w-full"
                                >
                                  <span className="truncate max-w-[150px]">{chunk.web.title || "Source"}</span>
                                  <ExternalLink size={8} />
                                </a>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                       <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                         <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center animate-pulse">
                            <Bot size={14} className="text-accent-600" />
                         </div>
                         <span className="text-xs text-slate-500 font-medium animate-pulse">Hannah is typing...</span>
                       </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Conversation Starters */}
                {chatMessages.length < 3 && !isTyping && (
                    <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
                        {starters.map((start, i) => (
                            <button 
                                key={i}
                                onClick={() => handleStarterClick(start)}
                                className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-accent-500 hover:text-accent-600 transition shadow-sm flex items-center gap-1"
                            >
                                <Sparkles size={10} className="text-accent-500" />
                                {start}
                            </button>
                        ))}
                    </div>
                )}

                <div className="p-4 bg-white border-t border-slate-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your legal question..."
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                    />
                    <button 
                      onClick={() => handleSendMessage()}
                      disabled={!inputText.trim() || isTyping}
                      className="bg-accent-600 text-white p-2 rounded-full hover:bg-accent-500 disabled:opacity-50 transition shadow-md"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  {/* Footer Disclaimer */}
                  <p className="text-[9px] text-slate-400 text-center mt-3 leading-tight px-4">
                     Do not share confidential information. This chat does not create an attorney–client relationship.
                  </p>
                </div>
              </div>
            )}

            {/* VOICE TAB */}
            {activeTab === 'voice' && (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center relative">
                
                {!isConnected ? (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                     <div className="mb-8 bg-blue-50 text-blue-800 p-6 rounded-xl text-sm max-w-xs border border-blue-100 shadow-sm">
                        <p className="font-semibold mb-1">Safe Simulation Mode</p>
                        You are about to speak with our AI legal assistant on a simulated recorded line.
                     </div>
                     <button
                        onClick={connect}
                        className="w-24 h-24 bg-accent-600 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all duration-300 hover:bg-accent-500 group relative"
                     >
                       <span className="absolute inset-0 rounded-full bg-accent-400 animate-ping opacity-20"></span>
                       <Mic size={36} className="text-white group-hover:drop-shadow-md" />
                     </button>
                     <p className="mt-6 text-navy-900 font-bold text-lg">Tap to Start Call</p>
                     <p className="text-slate-400 text-sm">Powered by Gemini Live</p>
                     {voiceError && <p className="mt-4 text-red-500 text-xs bg-red-50 px-3 py-1 rounded-full">{voiceError}</p>}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-between h-full w-full py-4">
                    
                    {/* Visualizer Area */}
                    <div className="relative w-48 h-48 flex items-center justify-center mt-8">
                       {/* Visualizer Rings */}
                       {!isMuted && (
                         <>
                            <div className="absolute w-full h-full rounded-full border-2 border-accent-200/30 animate-[ping_3s_linear_infinite]"></div>
                            <div className="absolute w-3/4 h-3/4 rounded-full border border-accent-300/40 animate-[ping_2s_linear_infinite]"></div>
                            <div className="absolute w-full h-full rounded-full bg-accent-100/10 blur-xl" 
                                style={{ transform: `scale(${1 + volume * 1.5})`, transition: 'transform 0.05s ease-out' }}></div>
                         </>
                       )}
                       
                       <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 relative z-10 ${isMuted ? 'bg-slate-200' : isSpeaking ? 'bg-gradient-to-br from-accent-500 to-accent-600 scale-105' : 'bg-navy-900'}`}>
                          {isMuted ? <MicOff size={48} className="text-slate-400" /> : isSpeaking ? <Bot size={48} className="text-white animate-pulse" /> : <User size={48} className="text-white" />}
                       </div>
                    </div>
                    
                    {/* Status & Captions Placeholder */}
                    <div className="space-y-4 max-w-xs mx-auto">
                       <div className="flex items-center justify-center gap-2">
                           {isSpeaking && <span className="flex gap-1 h-3 items-end">
                                <span className="w-1 bg-accent-500 animate-[bounce_1s_infinite] h-2"></span>
                                <span className="w-1 bg-accent-500 animate-[bounce_1s_infinite_0.2s] h-3"></span>
                                <span className="w-1 bg-accent-500 animate-[bounce_1s_infinite_0.4s] h-1"></span>
                           </span>}
                           <h4 className="text-xl font-serif font-bold text-navy-900 transition-all">
                              {isMuted ? 'Microphone Muted' : isSpeaking ? 'Hannah is speaking...' : 'Listening...'}
                           </h4>
                       </div>
                       
                       <div className="h-16 flex items-center justify-center">
                            <p className="text-sm text-slate-500 animate-in fade-in">
                                {isMuted ? 'Tap the microphone to resume.' : isSpeaking ? '' : 'Speak clearly into your microphone.'}
                            </p>
                       </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-6 mb-4">
                        <button
                            onClick={toggleMute}
                            className={`p-4 rounded-full border shadow-sm transition-all duration-200 ${
                                isMuted 
                                    ? 'bg-red-50 border-red-200 text-red-500 scale-95' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:scale-105'
                            }`}
                            title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
                        >
                            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                        </button>
                        
                        <button
                            onClick={disconnect}
                            className="px-8 py-3 bg-red-50 border border-red-200 text-red-600 rounded-full hover:bg-red-100 hover:border-red-300 transition-all shadow-sm text-sm font-bold flex items-center gap-2"
                        >
                            <X size={16} /> End Call
                        </button>
                    </div>
                    {/* Footer Disclaimer for Voice */}
                    <p className="text-[9px] text-slate-400 text-center mt-2 leading-tight px-4">
                        Do not share confidential information. This chat does not create an attorney–client relationship.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={onToggle}
        className={`${isOpen ? 'bg-navy-800 rotate-90' : 'bg-accent-600 hover:bg-accent-500'} text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center relative group z-50`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
        {!isOpen && (
           <span className="absolute -top-1 -right-1 flex h-4 w-4">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
           </span>
        )}
      </button>
    </div>
  );
};
