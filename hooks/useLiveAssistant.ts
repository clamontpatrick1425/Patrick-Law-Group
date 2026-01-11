
import { useState, useRef, useEffect, useCallback } from 'react';
import { Modality, LiveServerMessage, GoogleGenAI } from '@google/genai';
import { MODELS, SYSTEM_INSTRUCTION } from '../services/geminiService';
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils';

export const useLiveAssistant = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Model is speaking
  const [volume, setVolume] = useState(0); // For visualizer
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  // Refs
  const isMutedRef = useRef(false);
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Session
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  /**
   * Internal helper to announce status using the AI's voice via TTS.
   */
  const announceStatus = useCallback(async (text: string) => {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) return;
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: MODELS.TTS,
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // Matching Hannah's live voice
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio && outputContextRef.current && outputContextRef.current.state !== 'closed') {
        const audioBytes = decode(base64Audio);
        const audioBuffer = await decodeAudioData(audioBytes, outputContextRef.current, 24000, 1);
        
        const source = outputContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outputContextRef.current.destination);
        source.start(outputContextRef.current.currentTime);
      }
    } catch (err) {
      console.error("Failed to announce status:", err);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const newState = !isMutedRef.current;
    isMutedRef.current = newState;
    setIsMuted(newState);
    announceStatus(newState ? "Microphone muted" : "Microphone unmuted");
  }, [announceStatus]);

  const disconnect = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (sourceRef.current) sourceRef.current.disconnect();
    if (processorRef.current) processorRef.current.disconnect();
    if (inputContextRef.current) inputContextRef.current.close();
    if (outputContextRef.current) outputContextRef.current.close();
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close());
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();

    setIsConnected(false);
    setIsSpeaking(false);
    setVolume(0);
    setIsMuted(false);
    isMutedRef.current = false;
    inputContextRef.current = null;
    outputContextRef.current = null;
  }, []);

  const connect = useCallback(async () => {
    try {
      setError(null);
      
      // 1. Check API Key
      if (!await window.aistudio.hasSelectedApiKey()) {
        await window.aistudio.openSelectKey();
      }
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        setError("Secure connection failed. A valid API key is required to initiate intake.");
        return;
      }

      // 2. Request Microphone Access
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
      } catch (micErr: any) {
        if (micErr.name === 'NotAllowedError') {
          setError("I apologize, but I need microphone access to hear you. Please check your browser's security settings.");
        } else if (micErr.name === 'NotFoundError') {
          setError("I couldn't detect a microphone. Please ensure your device's audio input is properly connected.");
        } else {
          setError("I'm having trouble accessing your microphone. Please verify your system settings.");
        }
        return;
      }

      // 3. Initialize Audio Contexts
      try {
        inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        nextStartTimeRef.current = outputContextRef.current.currentTime;
      } catch (audioCtxErr) {
        setError("Browser audio initialization failed. Please try refreshing the page.");
        return;
      }

      const client = new GoogleGenAI({ apiKey });

      // 4. Connect to Live API
      const sessionPromise = client.live.connect({
        model: MODELS.LIVE,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, 
          },
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setError(null);
            
            // Proactive trigger: Nudge the model to start speaking the greeting immediately
            sessionPromise.then(session => {
              session.sendRealtimeInput({ parts: [{ text: "Please begin the legal intake process greeting." }] });
            });

            if (!inputContextRef.current) return;
            const source = inputContextRef.current.createMediaStreamSource(stream);
            sourceRef.current = source;
            const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              if (isMutedRef.current) {
                setVolume(0);
                return;
              }
              const inputData = e.inputBuffer.getChannelData(0);
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              const rms = Math.sqrt(sum / inputData.length);
              // Normalize volume for UI
              setVolume(Math.min(rms * 10, 1)); 

              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                 session.sendRealtimeInput({ media: pcmBlob });
              }).catch(err => {
                 console.error("Failed to send realtime input:", err);
              });
            };
            source.connect(processor);
            processor.connect(inputContextRef.current.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const outputCtx = outputContextRef.current;
            if (!outputCtx || outputCtx.state === 'closed') return;

            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              setIsSpeaking(true);
              const audioBytes = decode(base64Audio);
              const audioBuffer = await decodeAudioData(audioBytes, outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              const startTime = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              source.start(startTime);
              nextStartTimeRef.current = startTime + audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              };
            }
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onclose: (e) => {
            if (e.code === 1006) {
              setError("The connection was lost unexpectedly due to network instability.");
            }
            disconnect();
          },
          onerror: (err: any) => {
            console.error("Live Assistant Error:", err);
            setError("Connection error encountered. Please check your internet connection and try again.");
            disconnect();
          }
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err: any) {
      console.error("Root connect error:", err);
      setError("I'm sorry, I'm having trouble initializing the secure voice system.");
      disconnect();
    }
  }, [disconnect, announceStatus]);

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return { isConnected, isSpeaking, volume, error, connect, disconnect, isMuted, toggleMute };
};
