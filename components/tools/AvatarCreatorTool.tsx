import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { generateVideo } from '../../services/geminiService';

const avatarStyles = ['Photorealistic woman', 'Animated robot', 'News anchor', 'Cartoon character', 'Pixel art person'];

const AvatarCreatorTool: React.FC = () => {
  const [script, setScript] = useState('');
  const [avatarStyle, setAvatarStyle] = useState(avatarStyles[0]);
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!script.trim()) return;
    setIsLoading(true);
    setVideoUrl('');
    try {
      const prompt = `Create a close-up video of a ${avatarStyle} talking, saying the following script: "${script}". The avatar should have realistic lip movements synchronized with the audio. The background should be neutral.`;
      const url = await generateVideo(prompt);
      setVideoUrl(url);
    } catch (error) {
      console.error('Error generating avatar video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex flex-col">
            <label className="text-lg font-poppins text-brand-text mb-2">Avatar Script</label>
            <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Enter the text for the avatar to speak..."
                className="w-full flex-grow p-4 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text custom-scrollbar"
                rows={6}
            />
        </div>
        <div className="lg:w-1/3 flex flex-col">
             <label className="text-lg font-poppins text-brand-text mb-2">Avatar Style</label>
             <select 
                value={avatarStyle}
                onChange={(e) => setAvatarStyle(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-white"
             >
                {avatarStyles.map(style => <option key={style}>{style}</option>)}
             </select>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <Button onClick={handleGenerate} isLoading={isLoading} disabled={!script.trim()} variant="glow">
          Generate Avatar Video
        </Button>
      </div>

      <div className="flex-grow flex items-center justify-center mt-4">
        <Card className="w-full h-full flex items-center justify-center bg-black/20">
          {isLoading && (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-brand-text">Generating avatar... This can take a few minutes.</p>
            </div>
          )}
          {!isLoading && videoUrl && (
            <video controls src={videoUrl} className="max-w-full max-h-full object-contain rounded-lg" />
          )}
          {!isLoading && !videoUrl && (
            <div className="text-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-50"><circle cx="12" cy="8" r="3"/><path d="M12 13.5a5 5 0 0 0-5 5V22h10v-3.5a5 5 0 0 0-5-5z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                <p>Your generated avatar video will appear here.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AvatarCreatorTool;