
import React, { useState } from 'react';
import { ArrowRight, Video, Loader2, Play, Bot, Mic } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface HeroProps {
    onOpenAI: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAI }) => {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  const handleGenerateVideo = async () => {
    try {
      if (!window.aistudio.hasSelectedApiKey()) {
          await window.aistudio.openSelectKey();
      }

      setIsGenerating(true);
      setLoadingMsg('Initializing AI Studio...');
      
      // Initialize client with key from env (injected after selection)
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      setLoadingMsg('Generating cinematic legal scene (this takes ~1 min)...');
      
      let operation = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: 'Cinematic 8-second looping video, professional attorney and client sitting in a modern sunlit office, reviewing documents, warm lighting, high resolution, photorealistic.',
          config: {
              numberOfVideos: 1,
              resolution: '1080p',
              aspectRatio: '16:9'
          }
      });

      while (!operation.done) {
          setLoadingMsg('Rendering pixels...');
          await new Promise(resolve => setTimeout(resolve, 5000));
          operation = await ai.operations.getVideosOperation({operation: operation});
      }

      if (operation.response?.generatedVideos?.[0]?.video?.uri) {
          setLoadingMsg('Finalizing video...');
          const downloadLink = operation.response.generatedVideos[0].video.uri;
          // Fetch with API key to access the actual media bytes
          const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
          const blob = await videoResponse.blob();
          const url = URL.createObjectURL(blob);
          setVideoUri(url);
      }
      
    } catch (e: any) {
      console.error(e);
      // Handle "Requested entity was not found" error by resetting key selection
      if (e.message?.includes('Requested entity was not found') || e.toString().includes('Requested entity was not found')) {
          try {
            await window.aistudio.openSelectKey();
          } catch (keyError) {
            console.error("Failed to open key selector", keyError);
          }
      } else {
          alert('Video generation failed. Please try again or check your API key permissions.');
      }
    } finally {
      setIsGenerating(false);
      setLoadingMsg('');
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 min-h-[700px] flex items-center">
      
      {/* Dynamic Background */}
      {videoUri ? (
        <div className="absolute inset-0 w-full h-full z-0">
           <video 
             src={videoUri} 
             autoPlay 
             loop 
             muted 
             playsInline 
             className="w-full h-full object-cover opacity-30"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent"></div>
        </div>
      ) : (
        /* Static Placeholder Background */
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-100 skew-x-12 translate-x-32 hidden lg:block z-0"></div>
      )}
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          <h1 className="text-4xl lg:text-7xl font-serif font-bold text-navy-900 leading-tight mb-8">
            Strategic Legal Protection for <span className="text-accent-600">Modern Business</span> & Innovation.
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10">
            Specializing in Corporate, IP, and Personal Injury law. We protect what you’ve built and fight for what you’re owed with aggressive, tech-forward representation.
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center w-full">
            <a href="#contact" className="px-8 py-4 bg-navy-900 text-white rounded-full font-medium hover:bg-navy-800 transition shadow-lg flex items-center justify-center gap-2 group min-w-[200px]">
              Book a Consultation
              <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </a>

             {/* AI Voice Orb Trigger */}
             <button 
                onClick={onOpenAI}
                className="pl-2 pr-6 py-2 bg-white text-navy-900 border border-slate-200 rounded-full font-medium hover:border-accent-400 hover:shadow-xl transition-all duration-300 shadow-md flex items-center gap-4 group min-w-[220px]"
             >
                {/* Visual Orb Icon */}
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-accent-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <span className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></span>
                    <div className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-transparent to-white/40"></div>
                    <Mic size={20} className="text-white relative z-10 drop-shadow-md" />
                </div>
                
                <div className="text-left">
                    <span className="block text-xs text-slate-500 font-semibold uppercase tracking-wider">AI Assistant</span>
                    <span className="block text-lg font-serif font-bold text-accent-600 leading-none">Talk to Hannah</span>
                </div>
             </button>
            
            {!videoUri ? (
              <button 
                onClick={handleGenerateVideo}
                disabled={isGenerating}
                className="px-8 py-4 bg-white text-navy-900 border border-slate-200 rounded-full font-medium hover:border-accent-600 hover:text-accent-600 transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-accent-600" />
                    <span className="text-sm">{loadingMsg}</span>
                  </>
                ) : (
                  <>
                    <Video size={18} />
                    Generate Hero Video
                  </>
                )}
              </button>
            ) : (
               <button className="px-8 py-4 bg-white text-green-700 border border-green-200 rounded-full font-medium shadow-sm flex items-center justify-center gap-2 cursor-default min-w-[200px]">
                  <Play size={18} className="fill-current" />
                  AI Video Active
               </button>
            )}
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             Available for immediate case review
          </div>

        </div>
      </div>
    </section>
  );
};
