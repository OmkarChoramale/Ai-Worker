import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { transcribeAudio } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/fileUtils';
import { UploadCloud } from 'lucide-react';

const SpeechToTextTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setTranscription('');
      setError('');
    }
  };

  const handleTranscribe = async () => {
    if (!file) {
        setError('Please select a file first.');
        return;
    }
    setIsLoading(true);
    setTranscription('');
    setError('');
    try {
      const { mimeType, data } = await fileToBase64(file);
      const response = await transcribeAudio(data, mimeType);
      setTranscription(response);
    } catch (err) {
      console.error('Error transcribing audio:', err);
      setError('Sorry, there was an error transcribing the audio.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col gap-4">
        <Card className="flex-grow flex flex-col items-center justify-center text-center">
            {!file ? (
                <>
                    <label htmlFor="audio-upload" className="cursor-pointer">
                        <UploadCloud className="w-16 h-16 mx-auto text-brand-secondary/50 mb-4" />
                        <h3 className="text-xl font-poppins text-brand-text">Upload Audio/Video File</h3>
                        <p className="text-gray-400 mt-2">Click to browse or drag and drop</p>
                    </label>
                    <input id="audio-upload" type="file" accept="audio/*,video/*" className="hidden" onChange={handleFileChange} />
                </>
            ) : (
                <div className="text-center">
                    <p className="font-semibold text-brand-text">{file.name}</p>
                    <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <Button onClick={() => setFile(null)} variant="default" className="mt-4 text-xs py-1 px-3">
                        Choose another file
                    </Button>
                </div>
            )}
        </Card>
      
        <div className="flex justify-center">
            <Button onClick={handleTranscribe} isLoading={isLoading} disabled={!file} variant="glow">
            Transcribe
            </Button>
        </div>
      
        {(transcription || error) && (
            <Card className="flex-grow-[2] overflow-y-auto custom-scrollbar">
                <h4 className="text-lg font-poppins text-brand-secondary mb-2">Transcription Result</h4>
                {error ? (
                    <p className="text-red-400">{error}</p>
                ) : (
                    <p className="text-brand-text whitespace-pre-wrap">{transcription}</p>
                )}
            </Card>
        )}
    </div>
  );
};

export default SpeechToTextTool;
