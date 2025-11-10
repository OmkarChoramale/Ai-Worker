import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { generateSpeechWithVoice } from '../../services/geminiService';

// Helper functions for audio decoding
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
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / 1; // Assuming mono
  const buffer = ctx.createBuffer(1, frameCount, 24000); // 24000 sample rate
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

const voices = ['Kore', 'Puck', 'Charon', 'Zephyr', 'Fenrir'];

const VoiceCloningTool: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(voices[0]);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setAudioBuffer(null);
    try {
      const base64Audio = await generateSpeechWithVoice(text, selectedVoice);
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      setAudioContext(ctx);
      const buffer = await decodeAudioData(decode(base64Audio), ctx);
      setAudioBuffer(buffer);
    } catch (error) {
      console.error('Error generating speech:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const playAudio = () => {
    if (!audioBuffer || !audioContext) return;
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  };

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex flex-col">
            <label className="text-lg font-poppins text-brand-text mb-2">Text to Generate</label>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the text for the voice to say..."
                className="w-full flex-grow p-4 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text custom-scrollbar"
            />
        </div>
        <div className="flex-1 flex flex-col">
             <label className="text-lg font-poppins text-brand-text mb-2">Select a Voice</label>
              <div className="grid grid-cols-2 gap-2">
                  {voices.map(voice => (
                      <button 
                        key={voice} 
                        onClick={() => setSelectedVoice(voice)}
                        className={`p-3 rounded-lg text-center transition-all ${selectedVoice === voice ? 'bg-brand-primary text-white ring-2 ring-brand-secondary' : 'bg-white/10 hover:bg-white/20'}`}
                      >
                          {voice}
                      </button>
                  ))}
              </div>
        </div>
      </div>
       <div className="flex justify-center mt-4">
            <Button onClick={handleGenerate} isLoading={isLoading} disabled={!text.trim()} variant="glow">
            Generate with {selectedVoice}'s Voice
            </Button>
      </div>

       <div className="flex-grow flex items-center justify-center mt-4">
        <Card className="w-full h-full flex items-center justify-center bg-black/20">
          {isLoading && <div className="w-12 h-12 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin"></div>}
          {!isLoading && audioBuffer && (
            <Button onClick={playAudio} variant="default">
              Play Generated Audio
            </Button>
          )}
          {!isLoading && !audioBuffer && <p className="text-gray-400">Your custom voice audio will appear here.</p>}
        </Card>
      </div>
    </div>
  );
};

export default VoiceCloningTool;