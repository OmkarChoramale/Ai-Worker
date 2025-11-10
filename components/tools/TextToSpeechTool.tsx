import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { generateSpeech } from '../../services/geminiService';

// Fix: Add helper functions from Gemini docs for audio decoding to handle raw PCM data.
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


const TextToSpeechTool: React.FC = () => {
  const [text, setText] = useState('');
  // Fix: Change state to hold AudioBuffer instead of a URL.
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setAudioBuffer(null);
    try {
      // Fix: Get base64 audio data and decode it for playback.
      const base64Audio = await generateSpeech(text);
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      setAudioContext(ctx);
      const buffer = await decodeAudioData(
        decode(base64Audio),
        ctx,
        24000,
        1,
      );
      setAudioBuffer(buffer);
    } catch (error) {
      console.error('Error generating speech:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fix: Function to play audio using Web Audio API.
  const playAudio = () => {
    if (!audioBuffer || !audioContext) return;
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  };


  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to speech..."
        className="w-full h-48 p-4 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text custom-scrollbar"
      />
      <div className="flex justify-center">
        <Button onClick={handleGenerate} isLoading={isLoading} disabled={!text.trim()} variant="glow">
          Generate Speech
        </Button>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <Card className="w-full h-full flex items-center justify-center bg-black/20">
          {isLoading && (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-brand-text">Synthesizing audio...</p>
            </div>
          )}
          {/* Fix: Replace <audio> tag with a button to play the decoded audio buffer. */}
          {!isLoading && audioBuffer && (
            <Button onClick={playAudio} variant="default">
              Play Generated Audio
            </Button>
          )}
          {!isLoading && !audioBuffer && (
             <div className="text-center text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-50"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M6.5 17.5 4 20"/><path d="m17.5 17.5 2.5 2.5"/></svg>
              <p>Your generated audio will appear here.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TextToSpeechTool;
