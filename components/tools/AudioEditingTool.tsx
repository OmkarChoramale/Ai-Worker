import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { editAudio } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/fileUtils';
import { UploadCloud, Play } from 'lucide-react';

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / 1;
  const buffer = ctx.createBuffer(1, frameCount, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

const AudioEditingTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('Remove background noise and enhance speech clarity.');
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string | null>(null);
  const [editedAudioBuffer, setEditedAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setOriginalAudioUrl(URL.createObjectURL(selectedFile));
      setEditedAudioBuffer(null);
      setError('');
    }
  };

  const handleGenerate = async () => {
    if (!file || !prompt) {
        setError('Please select an audio file and enter a prompt.');
        return;
    }
    setIsLoading(true);
    setEditedAudioBuffer(null);
    setError('');
    try {
      const { mimeType, data } = await fileToBase64(file);
      const responseBase64 = await editAudio(data, mimeType, prompt);

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      setAudioContext(ctx);
      const buffer = await decodeAudioData(decode(responseBase64), ctx);
      setEditedAudioBuffer(buffer);

    } catch (err) {
      console.error('Error editing audio:', err);
      setError('Sorry, there was an error cleaning the audio. This feature is experimental.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const playEditedAudio = () => {
    if (!editedAudioBuffer || !audioContext) return;
    const source = audioContext.createBufferSource();
    source.buffer = editedAudioBuffer;
    source.connect(audioContext.destination);
    source.start();
  };

  return (
    <div className="p-4 h-full flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
            <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Remove background noise..."
            className="flex-grow p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text"
            />
            <Button onClick={handleGenerate} isLoading={isLoading} disabled={!file || !prompt.trim()} variant="glow">
                Clean Audio
            </Button>
        </div>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="flex flex-col items-center justify-center p-4">
                <h4 className="text-lg font-poppins text-brand-secondary mb-2 self-start">Original</h4>
                <div className="flex-grow w-full flex items-center justify-center">
                    {!originalAudioUrl ? (
                        <label htmlFor="audio-upload" className="cursor-pointer text-center p-4 border-2 border-dashed border-white/20 rounded-lg">
                            <UploadCloud className="w-12 h-12 mx-auto text-brand-secondary/50 mb-2" />
                            <h3 className="text-lg font-poppins text-brand-text">Upload Audio</h3>
                        </label>
                    ) : (
                        <audio controls src={originalAudioUrl} className="w-full" />
                    )}
                    <input id="audio-upload" type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
                </div>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4">
                 <h4 className="text-lg font-poppins text-brand-secondary mb-2 self-start">Result</h4>
                <div className="flex-grow w-full flex items-center justify-center">
                    {isLoading && <div className="w-12 h-12 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin"></div>}
                    {!isLoading && editedAudioBuffer && (
                        <Button onClick={playEditedAudio}>
                            <Play className="mr-2" /> Play Cleaned Audio
                        </Button>
                    )}
                    {!isLoading && !editedAudioBuffer && (
                      error ? <p className="text-red-400 text-center">{error}</p> : <p className="text-gray-400">The result will appear here.</p>
                    )}
                </div>
            </Card>
        </div>
    </div>
  );
};

export default AudioEditingTool;