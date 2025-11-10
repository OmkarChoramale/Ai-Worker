import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { editImage } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/fileUtils';
import { UploadCloud } from 'lucide-react';

interface ImageEditingToolProps {
  promptPlaceholder: string;
  actionText: string;
  initialPrompt: string;
}

const ImageEditingTool: React.FC<ImageEditingToolProps> = ({
    promptPlaceholder,
    actionText,
    initialPrompt
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setOriginalImageUrl(URL.createObjectURL(selectedFile));
      setEditedImageUrl(null);
      setError('');
    }
  };

  const handleGenerate = async () => {
    if (!file || !prompt) {
        setError('Please select an image and enter a prompt.');
        return;
    }
    setIsLoading(true);
    setEditedImageUrl(null);
    setError('');
    try {
      const { mimeType, data } = await fileToBase64(file);
      const responseUrl = await editImage(data, mimeType, prompt);
      setEditedImageUrl(responseUrl);
    } catch (err) {
      console.error('Error editing image:', err);
      setError('Sorry, there was an error editing the image.');
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
            placeholder={promptPlaceholder}
            className="flex-grow p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text"
            />
            <Button onClick={handleGenerate} isLoading={isLoading} disabled={!file || !prompt.trim()} variant="glow">
            {actionText}
            </Button>
        </div>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="flex flex-col items-center justify-center">
                <h4 className="text-lg font-poppins text-brand-secondary mb-2 self-start">Original</h4>
                <div className="flex-grow w-full flex items-center justify-center">
                    {!originalImageUrl ? (
                        <label htmlFor="image-upload" className="cursor-pointer text-center">
                            <UploadCloud className="w-12 h-12 mx-auto text-brand-secondary/50 mb-4" />
                            <h3 className="text-lg font-poppins text-brand-text">Upload Image</h3>
                        </label>
                    ) : (
                        <img src={originalImageUrl} alt="Original" className="max-w-full max-h-full object-contain rounded-lg" />
                    )}
                    <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
            </Card>
            <Card className="flex flex-col items-center justify-center">
                 <h4 className="text-lg font-poppins text-brand-secondary mb-2 self-start">Result</h4>
                <div className="flex-grow w-full flex items-center justify-center">
                    {isLoading && (
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-brand-text">Editing your image...</p>
                        </div>
                    )}
                    {!isLoading && editedImageUrl && (
                        <img src={editedImageUrl} alt="Edited" className="max-w-full max-h-full object-contain rounded-lg" />
                    )}
                    {!isLoading && !editedImageUrl && (
                      error ? <p className="text-red-400">{error}</p> : <p className="text-gray-400">The result will appear here.</p>
                    )}
                </div>
            </Card>
        </div>
    </div>
  );
};

export default ImageEditingTool;
