
import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, User, Video, Loader2, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface HeroProps {
  voiceState: any; 
  onOpenAssistant: (tab: 'chat' | 'voice') => void;
}

const HANNAH_AVATAR = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400";

export const Hero: React.FC<HeroProps> = ({ voiceState, onOpenAssistant }) => {
  const { isConnected, isSpeaking, volume, error, connect, disconnect, isMuted, toggleMute } = voiceState;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Video Generation State
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStatus, setGenStatus] = useState('');
  const [genError, setGenError] = useState<string | null>(null);

  const defaultVideoUrl = "https://drive.google.com/uc?id=1VUVvEVm7tpAix6g9GzYuThqdQUqZTV7Q&export=download";
  const posterImageUrl = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070";

  const handleOrbClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    if (isConnected) {
      onOpenAssistant('voice');
    } else {
      connect().then(() => onOpenAssistant('voice'));
    }
  };

  const handleGenerateVideo = async () => {
    try {
      setIsGenerating(true);
      setGenError(null);
      setGenStatus('Checking credentials...');

      if (!await window.aistudio.hasSelectedApiKey()) {
        await window.aistudio.openSelectKey();
      }

      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("A paid API key is required for cinematic generation.");
      }

      const ai = new GoogleGenAI({ apiKey });
      setGenStatus('Hannah is sketching the scene...');
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: 'A professionally dressed male client and a female attorney sitting in an upscale, modern boardroom with floor-to-ceiling windows. They are engaged in signing high-end legal documents and nodding in agreement. In the background, the beautiful Kansas City skyline is visible through the window during a bright sunset. Cinematic lighting, photorealistic, 4k detail.',
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      const messages = [
        'Crafting the upscale boardroom...',
        'Rendering the Kansas City skyline...',
        'Simulating cinematic sunset lighting...',
        'Polishing the legal documents detail...',
        'Finalizing your cinematic experience...'
      ];
      let msgIdx = 0;

      while (!operation.done) {
        setGenStatus(messages[msgIdx % messages.length]);
        msgIdx++;
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      if (operation.response?.generatedVideos?.[0]?.video?.uri) {
        const downloadLink = operation.response.generatedVideos[0].video.uri;
        setGenStatus('Downloading cinematic assets...');
        const response = await fetch(`${downloadLink}&key=${apiKey}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setGeneratedVideoUrl(url);
        setIsGenerating(false);
      } else {
        throw new Error("Generation completed but no video found.");
      }
    } catch (err: any) {
      console.error(err);
      setGenError(err.message || "Failed to generate video. Ensure a paid API key is selected.");
      setIsGenerating(false);
    }
  };

  let interactionScale = isPressed ? 0.9 : isHovered ? 1.1 : 1.0;
  const orbScale = isSpeaking 
    ? (interactionScale + 0.05 + (volume * 0.15)) 
    : isConnected 
      ? (interactionScale + (volume * 0.05)) 
      : interactionScale;

  const glowIntensity = isSpeaking ? 0.8 + (volume * 0.5) : isConnected ? 0.5 : isHovered ? 0.7 : 0.3;

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-navy-900">
      
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <video 
          key={generatedVideoUrl || 'default'}
          autoPlay 
          loop 
          muted 
          playsInline 
          poster={posterImageUrl}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-1000"
          style={{ filter: 'brightness(0.35) contrast(1.1) saturate(0.9)' }}
        >
          <source src={generatedVideoUrl || defaultVideoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/40 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 via-transparent to-navy-900/80 z-10"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left pt-20 lg:pt-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/20 border border-accent-500/30 text-accent-400 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-top-4 duration-1000 shadow-xl backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
              </span>
              Est. 1981 • Strategic Protection
            </div>

            <h1 className="text-5xl lg:text-8xl font-serif font-bold text-white leading-[1.1] mb-8 drop-shadow-2xl">
              Strategic Law. <br />
              <span className="text-accent-500 italic font-normal">Proven</span> Results.
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-200 leading-relaxed max-w-2xl mx-auto lg:mx-0 drop-shadow-lg font-light mb-10">
              Protecting high-stakes corporate interests and personal legacies with aggressive representation and high-tech AI advocacy.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
               <button 
                onClick={handleGenerateVideo}
                disabled={isGenerating}
                className="group relative px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl backdrop-blur-md transition-all flex items-center gap-3 shadow-2xl disabled:opacity-50 overflow-hidden"
               >
                 {isGenerating ? (
                   <>
                    <Loader2 size={20} className="animate-spin text-accent-400" />
                    <span className="relative z-10">{genStatus}</span>
                    <div className="absolute bottom-0 left-0 h-1 bg-accent-500 transition-all duration-1000" style={{ width: '40%' }}></div>
                   </>
                 ) : generatedVideoUrl ? (
                   <>
                    <CheckCircle size={20} className="text-green-400" />
                    Custom Experience Active
                   </>
                 ) : (
                   <>
                    <Video size={20} className="text-accent-500 group-hover:scale-110 transition-transform" />
                    Generate Firm Cinematic Intro
                   </>
                 )}
               </button>
               
               {genError && (
                 <div className="flex items-center gap-2 text-red-400 text-xs font-bold animate-in fade-in slide-in-from-left-2">
                    <AlertCircle size={14} /> {genError}
                 </div>
               )}
            </div>
          </div>

          {/* AI Avatar Orb */}
          <div className="flex-1 flex flex-col items-center justify-center relative w-full lg:max-w-xl">
            
            <div className={`mb-8 px-6 py-2 rounded-full border backdrop-blur-md transition-all duration-500 ${isConnected ? 'bg-accent-500/10 border-accent-500/30 text-accent-400 shadow-[0_0_20px_rgba(20,184,166,0.2)]' : 'bg-white/5 border-white/10 text-white/60'}`}>
              <p className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                {isConnected ? (
                  <>
                    <span className="flex h-2 w-2 rounded-full bg-accent-400 animate-pulse"></span>
                    {isSpeaking ? 'Hannah is speaking...' : 'Hannah is listening...'}
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="text-accent-500" />
                    Meet Your Legal Assistant
                  </>
                )}
              </p>
            </div>

            <div 
              className="relative group cursor-pointer" 
              onClick={handleOrbClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className={`absolute -top-20 left-1/2 -translate-x-1/2 px-6 py-3 bg-white text-navy-900 rounded-2xl shadow-2xl text-sm font-bold transition-all duration-300 pointer-events-none z-30 whitespace-nowrap flex items-center gap-3 border border-slate-100 ${isHovered ? 'opacity-100 -translate-y-2' : 'opacity-0 translate-y-0'}`}>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-accent-500">
                    <img src={HANNAH_AVATAR} className="w-full h-full object-cover" />
                </div>
                Tap to Speak with Hannah
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 -translate-y-1.5 border-r border-b border-slate-100"></div>
              </div>

              <div className={`absolute inset-0 rounded-full border border-accent-400/30 transition-all duration-1000 pointer-events-none z-0 ${isHovered ? 'animate-ping opacity-100 scale-150' : 'opacity-0 scale-100'}`}></div>
              
              <div 
                className={`relative w-64 h-64 lg:w-80 lg:h-80 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ease-out border-4 border-white/20 overflow-hidden ${!isConnected && !isHovered ? 'animate-pulse' : ''} ${isPressed ? 'brightness-110' : ''}`}
                style={{ 
                  transform: `scale(${orbScale})`,
                  boxShadow: `0 0 ${50 + (volume * 120) + (isHovered ? 40 : 0) + (isPressed ? 60 : 0)}px rgba(20, 184, 166, ${glowIntensity})`,
                }}
              >
                <img 
                  src={HANNAH_AVATAR} 
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isMuted ? 'grayscale' : 'grayscale-0'}`} 
                  alt="Hannah"
                />
                
                {/* Dynamic Overlays */}
                <div className={`absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent transition-opacity ${isConnected || isHovered ? 'opacity-30' : 'opacity-0'}`}></div>

                {/* Interaction States */}
                <div className="relative z-10 flex flex-col items-center">
                  {isConnected && isSpeaking ? (
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 animate-bounce">
                        <Volume2 size={32} className="text-white" />
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Reactive Rings */}
              {(isSpeaking || (isConnected && isHovered)) && (
                <div className="absolute inset-0 -z-10">
                  <div className="absolute inset-0 border-2 border-accent-500/20 rounded-full animate-ping [animation-duration:1.5s]"></div>
                  <div className="absolute inset-0 border-2 border-accent-400/10 rounded-full animate-ping [animation-delay:0.3s] [animation-duration:2.5s]"></div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-8 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-bottom-4 shadow-lg backdrop-blur-sm">
                {error}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
