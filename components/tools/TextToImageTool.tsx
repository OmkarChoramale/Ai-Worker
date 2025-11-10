import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { generateImage } from '../../services/geminiService';

const TextToImageTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setImageUrl('');
    try {
      const url = await generateImage(prompt);
      setImageUrl(url);
    } catch (error) {
      console.error('Error generating image:', error);
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
          placeholder="e.g., A robot holding a red skateboard"
          className="flex-grow p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text"
        />
        <Button onClick={handleGenerate} isLoading={isLoading} disabled={!prompt.trim()} variant="glow">
          Generate
        </Button>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <Card className="w-full h-full flex items-center justify-center bg-black/20">
          {isLoading && (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-brand-text">Generating your masterpiece...</p>
            </div>
          )}
          {!isLoading && imageUrl && (
            <img src={imageUrl} alt={prompt} className="max-w-full max-h-full object-contain rounded-lg" />
          )}
          {!isLoading && !imageUrl && (
            <div className="text-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-50"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m20.4 14.5-3.4-3.4a2 2 0 0 0-2.8 0L7 18"/></svg>
              <p>Your generated image will appear here.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TextToImageTool;
