import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { generateContentWithImage } from '../../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';


const MeetingCopilotTool: React.FC = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [initialContext, setInitialContext] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const stopStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  useEffect(() => {
    return () => {
      // The stream is stopped in the component's return statement logic based on mediaStream's presence
      // but this ensures it's also stopped on component unmount.
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStartSession = async () => {
    stopStream();
    setError('');
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error starting screen share:", err);
      setError("Could not start screen share. Please grant permission and try again.");
    }
  };

  const captureFrameAsBase64 = (): { mimeType: string; data: string } | null => {
    if (!videoRef.current) return null;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    
    const [header, data] = dataUrl.split(',');
    const mimeType = header.split(':')[1].split(';')[0];
    return { mimeType, data };
  };

  const handleAsk = async () => {
    const frame = captureFrameAsBase64();
    if (!frame) {
      setError("Could not capture a frame from the video stream.");
      return;
    }

    setIsLoading(true);
    setAnswer('');
    setError('');

    try {
      const fullPrompt = `
        System Instruction: You are an AI meeting assistant. Your task is to analyze the provided screenshot from a live meeting. Identify the primary question being asked (e.g., in a chat log or on a slide) or the key information being presented. Provide a concise, direct answer based ONLY on the visual information in the screenshot. Do not ask clarifying questions; provide the best possible answer with the given context.
        
        Initial Meeting Context: "${initialContext || 'No context provided.'}"
      `;
      const response = await generateContentWithImage(fullPrompt, frame.data, frame.mimeType);
      setAnswer(response);
    // Fix: Add missing opening brace for the catch block
    } catch (err) {
      console.error("Error getting AI answer:", err);
      setError("Sorry, there was an error getting an answer from the AI.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mediaStream) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold font-grotesk text-brand-secondary">Meeting Co-Pilot</h2>
        <p className="mt-2 text-brand-text max-w-lg">Get live assistance during your meetings. Share your screen or tab, and ask AI questions based on the visual content.</p>
        <Card className="mt-6 w-full max-w-md">
            <label className="text-lg font-poppins text-brand-text mb-2 block">Optional: Meeting Context</label>
            <textarea
                value={initialContext}
                onChange={(e) => setInitialContext(e.target.value)}
                placeholder="e.g., This is a technical review for the Q3 roadmap..."
                className="w-full h-24 p-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text text-sm"
            />
        </Card>
        <Button onClick={handleStartSession} variant="glow" className="mt-6">
          Start Session & Share Screen
        </Button>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
       <PanelGroup direction="horizontal" className="flex-grow">
          <Panel defaultSize={65} minSize={30}>
            <div className="h-full bg-black flex items-center justify-center p-2">
                <video ref={videoRef} autoPlay muted className="max-w-full max-h-full object-contain"></video>
            </div>
          </Panel>
          <PanelResizeHandle className="w-2 bg-white/10 hover:bg-brand-primary transition-colors cursor-col-resize" />
          <Panel defaultSize={35} minSize={20}>
            <div className="h-full flex flex-col p-4 bg-black/20">
                <h3 className="text-xl font-poppins text-brand-secondary mb-2 flex-shrink-0">Co-Pilot</h3>
                <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                    <Card>
                        <h4 className="font-semibold text-brand-text mb-2">Answer</h4>
                         {isLoading ? (
                            <div className="flex items-center justify-center h-24">
                                <div className="w-8 h-8 border-2 border-brand-secondary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="prose prose-invert text-brand-text prose-sm max-w-none">
                                <ReactMarkdown>{answer || "Click 'Analyze Screen & Answer' to get AI insights."}</ReactMarkdown>
                            </div>
                        )}
                         {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
                    </Card>
                </div>
                <div className="flex-shrink-0 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center mt-2">
                         <Button onClick={handleAsk} isLoading={isLoading} variant="glow" className="w-full">
                            Analyze Screen & Answer
                        </Button>
                    </div>
                     <div className="flex justify-center mt-4">
                        <Button onClick={stopStream} variant="default">
                            Stop Session
                        </Button>
                    </div>
                </div>
            </div>
          </Panel>
       </PanelGroup>
    </div>
  );
};

export default MeetingCopilotTool;
