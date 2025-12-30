
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

  const toggleMute = useCallback(() => {
    const newState = !isMutedRef.current;
    isMutedRef.current = newState;
    setIsMuted(newState);
  }, []);

  const disconnect = useCallback(() => {
    // Stop Microphone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Disconnect Nodes
    if (sourceRef.current) sourceRef.current.disconnect();
    if (processorRef.current) processorRef.current.disconnect();
    
    // Close Contexts
    if (inputContextRef.current) inputContextRef.current.close();
    if (outputContextRef.current) outputContextRef.current.close();
    
    // Close Session
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close());
    }
    
    // Stop Audio Playback
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

      // Ensure API Key
      if (!await window.aistudio.hasSelectedApiKey()) {
        await window.aistudio.openSelectKey();
      }
      
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key not found. Please select a valid key.");
      }

      const client = new GoogleGenAI({ apiKey });
      
      // 1. Setup Audio Contexts
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      nextStartTimeRef.current = outputContextRef.current.currentTime;

      // 2. Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 3. Connect to Gemini Live
      const sessionPromise = client.live.connect({
        model: MODELS.LIVE,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, // Female voice
          },
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Connected');
            setIsConnected(true);

            // Setup Input Processing
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
              
              // Simple volume meter logic
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              const rms = Math.sqrt(sum / inputData.length);
              setVolume(Math.min(rms * 5, 1)); // Scale for visualizer

              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                 session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputContextRef.current.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const outputCtx = outputContextRef.current;
            if (!outputCtx) return;

            // Handle Audio Output
            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              setIsSpeaking(true);
              const audioBytes = decode(base64Audio);
              const audioBuffer = await decodeAudioData(audioBytes, outputCtx, 24000, 1);
              
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              
              // Determine start time to ensure smooth playback
              const startTime = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              source.start(startTime);
              nextStartTimeRef.current = startTime + audioBuffer.duration;
              
              sourcesRef.current.add(source);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              };
            }

            // Handle Interruption
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onclose: () => {
            console.log('Gemini Live Closed');
            disconnect();
          },
          onerror: (err) => {
            console.error('Gemini Live Error', err);
            // Handle specific 404/400 error by prompting for key selection
            const errStr = String(err);
            if (errStr.includes('Requested entity was not found') || errStr.includes('404') || errStr.includes('400') || errStr.includes('API Key not found')) {
                try {
                    (window as any).aistudio?.openSelectKey();
                } catch (e) {
                    console.error(e);
                }
            }
            setError("Connection error. Please try again.");
            disconnect();
          }
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (err: any) {
      console.error("Failed to connect", err);
      // Handle specific 404/400 error by prompting for key selection
      const errStr = err.message || String(err);
      if (errStr.includes('Requested entity was not found') || errStr.includes('404') || errStr.includes('400') || errStr.includes('API Key not found')) {
          try {
             (window as any).aistudio?.openSelectKey();
          } catch (e) {
              console.error(e);
          }
      }
      setError("Could not access microphone or connect to service.");
      disconnect();
    }
  }, [disconnect]);

  useEffect(() => {
    return () => {
        disconnect();
    }
  }, [disconnect]);

  return { isConnected, isSpeaking, volume, error, connect, disconnect, isMuted, toggleMute };
};
