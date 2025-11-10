import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import { generateText } from '../../services/geminiService';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const ChatAssistantTool: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponseText = await generateText(input);
      const aiMessage: Message = { sender: 'ai', text: aiResponseText };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4 custom-scrollbar pr-6">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg px-4 py-2 rounded-xl ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-white/10 text-brand-text'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="max-w-lg px-4 py-2 rounded-xl bg-white/10 text-brand-text">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse [animation-delay:0.4s]"></div>
                  </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-grow bg-transparent focus:outline-none text-brand-text placeholder-gray-400 px-2"
            disabled={isLoading}
          />
          <Button onClick={handleSend} isLoading={isLoading} disabled={!input.trim()} variant="glow">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistantTool;
