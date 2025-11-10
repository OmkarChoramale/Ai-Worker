import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { transcribeAudio, generateText } from '../../services/geminiService';
import { fileToBase64 } from '../../utils/fileUtils';
import { UploadCloud } from 'lucide-react';

type Step = 'idle' | 'transcribing' | 'summarizing' | 'done';

const PodcastSummarizerTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<Step>('idle');
  const [error, setError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setTranscription('');
      setSummary('');
      setStep('idle');
      setError('');
    }
  };

  const handleSummarize = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Step 1: Transcribe
      setStep('transcribing');
      const { mimeType, data } = await fileToBase64(file);
      const transcriptionResult = await transcribeAudio(data, mimeType);
      setTranscription(transcriptionResult);
      
      // Step 2: Summarize
      setStep('summarizing');
      const summaryResult = await generateText(transcriptionResult, "You are an expert podcast summarizer. Take the following transcript and provide a concise summary with key takeaways formatted in Markdown.");
      setSummary(summaryResult);

      setStep('done');
    } catch (err) {
      console.error('Error in podcast summarization:', err);
      setError('An error occurred during the process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
             <Card className="flex-grow flex flex-col items-center justify-center text-center">
                {!file ? (
                    <>
                        <label htmlFor="audio-upload" className="cursor-pointer">
                            <UploadCloud className="w-12 h-12 mx-auto text-brand-secondary/50 mb-2" />
                            <h3 className="text-lg font-poppins text-brand-text">Upload Podcast Audio</h3>
                        </label>
                        <input id="audio-upload" type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
                    </>
                ) : (
                    <div className="text-center">
                        <p className="font-semibold text-brand-text">{file.name}</p>
                        <Button onClick={() => setFile(null)} variant="default" className="mt-2 text-xs py-1 px-3">
                            Change file
                        </Button>
                    </div>
                )}
            </Card>
            <Button onClick={handleSummarize} isLoading={isLoading} disabled={!file} variant="glow" className="self-center">
                {isLoading ? `${step}...` : 'Summarize Podcast'}
            </Button>
        </div>
      
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="flex flex-col">
                <h4 className="text-lg font-poppins text-brand-secondary mb-2">Transcription</h4>
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{transcription || 'Transcription will appear here.'}</p>
                </div>
            </Card>
            <Card className="flex flex-col">
                <h4 className="text-lg font-poppins text-brand-secondary mb-2">Summary</h4>
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    <p className="text-brand-text whitespace-pre-wrap">{summary || 'Summary will appear here.'}</p>
                    {error && <p className="text-red-400">{error}</p>}
                </div>
            </Card>
        </div>
    </div>
  );
};

export default PodcastSummarizerTool;
