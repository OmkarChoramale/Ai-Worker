import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { generateText } from '../../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface GenericTextToolProps {
  inputLabel: string;
  outputLabel: string;
  placeholder: string;
  systemInstruction: string;
}

const GenericTextTool: React.FC<GenericTextToolProps> = ({
  inputLabel,
  outputLabel,
  placeholder,
  systemInstruction
}) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setOutputText('');
    try {
      const response = await generateText(inputText, systemInstruction);
      setOutputText(response);
    } catch (error) {
      console.error('Error generating text:', error);
      setOutputText('Sorry, there was an error processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <div className="flex-grow flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex flex-col">
          <label className="text-lg font-poppins text-brand-text mb-2">{inputLabel}</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={placeholder}
            className="w-full flex-grow p-4 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text font-mono text-sm custom-scrollbar"
          />
        </div>
        <div className="flex-1 flex flex-col">
            <label className="text-lg font-poppins text-brand-text mb-2">{outputLabel}</label>
            <Card className="flex-grow overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-8 h-8 border-2 border-brand-secondary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="prose prose-invert text-brand-text prose-pre:bg-black/20 prose-pre:p-4 prose-pre:rounded-md">
                        <ReactMarkdown>{outputText || 'Your result will appear here.'}</ReactMarkdown>
                    </div>
                )}
            </Card>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <Button onClick={handleGenerate} isLoading={isLoading} disabled={!inputText.trim()} variant="glow">
          Generate
        </Button>
      </div>
    </div>
  );
};

export default GenericTextTool;
