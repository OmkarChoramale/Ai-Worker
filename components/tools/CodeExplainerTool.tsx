import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { generateText } from '../../services/geminiService';
import ReactMarkdown from 'react-markdown';

const CodeExplainerTool: React.FC = () => {
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleExplain = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    setExplanation('');
    try {
      const response = await generateText(`Explain this code: \n\n${code}`);
      setExplanation(response);
    } catch (error) {
      console.error('Error generating explanation:', error);
      setExplanation('Sorry, there was an error explaining the code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <h3 className="text-xl font-poppins text-brand-text">Enter Code Snippet</h3>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
        className="w-full h-48 p-4 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text font-mono text-sm custom-scrollbar"
      />
      <div className="flex justify-center">
        <Button onClick={handleExplain} isLoading={isLoading} disabled={!code.trim()} variant="glow">
          Explain Code
        </Button>
      </div>
      {explanation && (
        <Card className="flex-grow overflow-y-auto custom-scrollbar">
          <h4 className="text-lg font-poppins text-brand-secondary mb-2">Explanation</h4>
          <div className="prose prose-invert text-brand-text prose-pre:bg-black/20 prose-pre:p-4 prose-pre:rounded-md">
            <ReactMarkdown>{explanation}</ReactMarkdown>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CodeExplainerTool;
