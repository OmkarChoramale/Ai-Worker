import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { generateSpeech } from '../../services/geminiService';

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

const languages = ['English', 'Hindi'];
const styles = ['Default', 'Storyteller', 'Scary', 'Old Person', 'Angry'];

const TextToSpeechTool: React.FC = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState(languages[0]);
  const [style, setStyle] = useState(styles[0]);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setAudioBuffer(null);
    try {
      let instruction = "Say the following ";
      if (language === 'Hindi') {
        instruction = "Translate the following to Hindi and say it ";
      }

      switch (style) {
        case 'Storyteller':
          instruction += "in a warm, engaging storyteller voice: ";
          break;
        case 'Scary':
          instruction += "in a scary, suspenseful voice: ";
          break;
        case 'Old Person':
          instruction += "in the voice of an old, wise person: ";
          break;
        case 'Angry':
          instruction += "in an angry, frustrated voice: ";
          break;
        default:
          instruction += "in a clear, neutral voice: ";
      }

      const fullPrompt = `${instruction} "${text}"`;
      
      const base64Audio = await generateSpeech(fullPrompt);
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      setAudioContext(ctx);
      const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-lg font-poppins text-brand-text mb-2 block">Language</label>
          <div className="flex gap-2">
            {languages.map(lang => (
              <button key={lang} onClick={() => setLanguage(lang)} className={`flex-1 p-2 rounded-lg text-sm transition-all ${language === lang ? 'bg-brand-primary text-white' : 'bg-white/10 hover:bg-white/20'}`}>
                {lang}
              </button>
            ))}
          </div>
        </div>
        <div>
           <label className="text-lg font-poppins text-brand-text mb-2 block">Voice Style</label>
           <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-white">
             {styles.map(s => <option key={s} value={s}>{s}</option>)}
           </select>
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to speech..."
        className="w-full h-36 p-4 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text custom-scrollbar"
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