import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { generateVideo } from '../../services/geminiService';

const VideoGeneratorTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setVideoUrl('');
    try {
      const url = await generateVideo(prompt);
      setVideoUrl(url);
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A neon hologram of a cat driving at top speed"
          className="flex-grow p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text"
        />
        <Button onClick={handleGenerate} isLoading={isLoading} disabled={!prompt.trim()} variant="glow">
          Generate Video
        </Button>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <Card className="w-full h-full flex items-center justify-center bg-black/20">
          {isLoading && (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-brand-text">Generating video... This may take a moment.</p>
            </div>
          )}
          {!isLoading && videoUrl && (
            <video controls src={videoUrl} className="max-w-full max-h-full object-contain rounded-lg">
              Your browser does not support the video tag.
            </video>
          )}
          {!isLoading && !videoUrl && (
            <div className="text-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-50"><path d="M16 13h4"/><path d="M12 13h4"/><path d="M8 13h4"/><path d="M6 13H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2"/><path d="M4 13V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6"/></svg>
              <p>Your generated video will appear here.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VideoGeneratorTool;
