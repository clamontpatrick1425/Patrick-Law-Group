
import React from 'react';
import { ArrowRight, Mic, Sparkles } from 'lucide-react';

interface HeroProps {
    onOpenAI: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAI }) => {
  // Transformed the Google Drive link into a direct streamable source for the background video
  const backgroundVideoUrl = "https://drive.google.com/uc?id=1VUVvEVm7tpAix6g9GzYuThqdQUqZTV7Q&export=download";
  const posterImageUrl = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070";

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-navy-900">
      
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          poster={posterImageUrl}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ filter: 'brightness(0.4) contrast(1.1) saturate(0.8)' }}
        >
          <source src={backgroundVideoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/40 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 via-transparent to-navy-900/80 z-10"></div>
        <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none z-10" 
             style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/asfalt-dark.png')` }}></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Main Hero Content (Left) */}
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
            
            <p className="text-xl lg:text-2xl text-slate-200 leading-relaxed mb-12 max-w-2xl mx-auto lg:mx-0 drop-shadow-lg font-light">
              Protecting high-stakes corporate interests and personal legacies with aggressive, tech-forward representation for over 40 years.
            </p>
            
            <div className="flex justify-center lg:justify-start">
              <a href="#contact" className="px-10 py-5 bg-accent-600 text-white rounded-full font-bold hover:bg-accent-500 transition shadow-2xl flex items-center justify-center gap-2 group text-lg hover:scale-105 active:scale-95 duration-300">
                Book a Free Consultation
                <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
              </a>
            </div>

            <div className="mt-16 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-300 font-semibold tracking-wide">
               <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-navy-900 bg-slate-700 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Attorney" className="w-full h-full object-cover opacity-80" />
                    </div>
                  ))}
               </div>
               <p className="flex items-center gap-2">
                 <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.8)]"></span>
                 Expert Legal Team Standing By
               </p>
            </div>
          </div>

          {/* AI Interface Card (Far Right) */}
          <div className="flex-1 w-full lg:max-w-md animate-in fade-in slide-in-from-right-10 duration-1000">
            <div className="relative group">
              {/* Glowing Aura Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-500 to-blue-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative bg-navy-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 lg:p-10 shadow-2xl flex flex-col items-center text-center overflow-hidden">
                {/* Visualizer Lines decoration */}
                <div className="absolute top-0 left-0 w-full h-1 flex gap-1 opacity-20">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="flex-1 bg-accent-500 h-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>

                <div className="mb-6 relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-400 to-blue-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 ring-4 ring-white/5">
                    <Mic size={52} className="text-white drop-shadow-lg" />
                    <Sparkles size={16} className="absolute -top-1 -right-1 text-accent-300 animate-bounce" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-accent-500/30 animate-ping"></div>
                </div>

                <h3 className="text-2xl font-serif font-bold text-white mb-2">Talk to Hannah</h3>
                <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                  Experience our 24/7 AI-powered legal concierge. Hannah can evaluate your case and help schedule your consultation instantly.
                </p>

                <button 
                  onClick={onOpenAI}
                  className="w-full py-4 bg-white text-navy-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all duration-300 shadow-xl flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95"
                >
                  Chat or Speak
                  <Sparkles size={18} />
                </button>

                <p className="mt-6 text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Fully Operational • Zero Latency
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
