import React, { useState, useRef, useEffect, useCallback } from 'react';
// Fix: Removed LiveSession from import as it is not an exported member.
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenaiBlob } from "@google/genai";
import Button from '../ui/Button';
import Card from '../ui/Card';
import { blobToBase64 } from '../../utils/fileUtils';

// Helper function to encode audio data for the Live API
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): GenaiBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// Fix: Added a local interface for LiveSession since it's not exported from the library.
interface LiveSession {
  sendRealtimeInput(input: { media: GenaiBlob | { data: string; mimeType: string; }; }): void;
  close(): void;
}

interface Transcript {
    id: number;
    type: 'meeting' | 'ai';
    text: string;
}

const FRAME_RATE = 1; // Send 1 frame per second
const JPEG_QUALITY = 0.7;

const LiveMeetingCopilotTool: React.FC = () => {
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);
    const [isAssistanceActive, setIsAssistanceActive] = useState(false);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const frameIntervalRef = useRef<number | null>(null);
    const isAssistanceActiveRef = useRef(isAssistanceActive);

    useEffect(() => {
        isAssistanceActiveRef.current = isAssistanceActive;
    }, [isAssistanceActive]);

    const stopSession = useCallback(() => {
        console.log("Stopping session...");
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }
        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            inputAudioContextRef.current.close();
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
        }
        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
        }
        if (frameIntervalRef.current) {
            clearInterval(frameIntervalRef.current);
            frameIntervalRef.current = null;
        }
        setIsLoading(false);
        setIsAssistanceActive(false);
    }, [mediaStream]);

    useEffect(() => {
        return () => stopSession();
    }, [stopSession]);
    
    const handleStartSession = async () => {
        if (mediaStream) {
            stopSession();
        }
        setError('');
        setIsLoading(true);
        setTranscripts([]);

        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { frameRate: 15 },
                audio: true,
            });
            setMediaStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        console.log('Live session opened.');
                        setIsLoading(false);
                        // Stream audio from microphone
                        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        mediaStreamSourceRef.current = inputAudioContextRef.current.createMediaStreamSource(stream);
                        scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                            if (!isAssistanceActiveRef.current) return;
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            if (sessionPromiseRef.current) {
                                sessionPromiseRef.current.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
                        scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);

                        // Stream video frames
                        const canvasEl = document.createElement('canvas');
                        const ctx = canvasEl.getContext('2d');

                        frameIntervalRef.current = window.setInterval(() => {
                            if (!isAssistanceActiveRef.current || !videoRef.current || !ctx) return;
                            canvasEl.width = videoRef.current.videoWidth;
                            canvasEl.height = videoRef.current.videoHeight;
                            ctx.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
                            canvasEl.toBlob(async (blob) => {
                                if (blob && sessionPromiseRef.current && isAssistanceActiveRef.current) {
                                    const base64Data = await blobToBase64(blob);
                                    sessionPromiseRef.current.then((session) => {
                                        session.sendRealtimeInput({ media: { data: base64Data, mimeType: 'image/jpeg' } });
                                    });
                                }
                            }, 'image/jpeg', JPEG_QUALITY);
                        }, 1000 / FRAME_RATE);
                    },
                    onmessage: (message: LiveServerMessage) => {
                       if (message.serverContent?.inputTranscription) {
                            const text = message.serverContent.inputTranscription.text;
                             setTranscripts(prev => {
                                const last = prev[prev.length - 1];
                                if (last && last.type === 'meeting') {
                                    last.text += text;
                                    return [...prev];
                                }
                                return [...prev, { id: Date.now(), type: 'meeting', text }];
                            });
                       } else if (message.serverContent?.outputTranscription) {
                            const text = message.serverContent.outputTranscription.text;
                             setTranscripts(prev => {
                                const last = prev[prev.length - 1];
                                if (last && last.type === 'ai') {
                                    last.text += text;
                                    return [...prev];
                                }
                                return [...prev, { id: Date.now(), type: 'ai', text }];
                            });
                       }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setError('A connection error occurred.');
                        stopSession();
                    },
                    onclose: () => {
                        console.log('Live session closed.');
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: "You are a meeting co-pilot. You will receive a stream of audio and video frames. Listen and watch continuously. Proactively identify key topics, action items, and questions. Provide real-time, concise answers and insights based on the combined information. When a question is asked, answer it directly.",
                },
            });
        } catch (err) {
            console.error("Error starting screen share:", err);
            setError("Could not start screen share. Please grant permission.");
            setIsLoading(false);
        }
    };
    
    if (!mediaStream) {
        return (
            <div className="p-4 h-full flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold font-grotesk text-brand-secondary">Live Meeting Co-Pilot</h2>
                <p className="mt-2 text-brand-text max-w-lg">Get continuous, real-time AI analysis of your meeting's audio and video content.</p>
                <Button onClick={handleStartSession} isLoading={isLoading} variant="glow" className="mt-6">
                    Start Live Session
                </Button>
                {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-4 gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow h-0">
                 <div className="bg-black rounded-lg flex items-center justify-center overflow-hidden">
                    <video ref={videoRef} autoPlay muted className="max-w-full max-h-full object-contain"></video>
                </div>
                <Card className="flex flex-col">
                    <h3 className="text-xl font-poppins text-brand-secondary mb-2 flex-shrink-0">Live Analysis</h3>
                    <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-4">
                        {transcripts.length === 0 && (
                             <p className="text-gray-400 text-center mt-4">
                                {isAssistanceActive ? "Listening..." : "AI assistance is paused. Click 'Start AI Assistance' to begin analysis."}
                             </p>
                        )}
                        {transcripts.map(t => (
                            <div key={t.id}>
                                <span className={`font-semibold text-sm ${t.type === 'ai' ? 'text-brand-secondary' : 'text-brand-primary'}`}>
                                    {t.type === 'ai' ? 'AI Insight:' : 'Meeting Transcript:'}
                                </span>
                                <p className="text-brand-text text-sm whitespace-pre-wrap">{t.text}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            <div className="flex-shrink-0 flex justify-center gap-4 pt-4 border-t border-white/10">
                <Button onClick={() => setIsAssistanceActive(p => !p)} variant="glow">
                    {isAssistanceActive ? 'Stop AI Assistance' : 'Start AI Assistance'}
                </Button>
                <Button onClick={stopSession} variant="default">
                    Stop Session
                </Button>
            </div>
        </div>
    );
};

export default LiveMeetingCopilotTool;