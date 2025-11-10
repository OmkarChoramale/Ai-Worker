import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AI_TOOLS } from '../../constants';
import Card from '../ui/Card';

const AiToolShell: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tool = AI_TOOLS.find(t => t.id === id);

  if (!tool) {
    return (
      <div className="flex items-center justify-center h-full">
        <h2 className="text-2xl text-red-500">Tool not found!</h2>
      </div>
    );
  }

  const ToolComponent = tool.component;

  return (
    <motion.div
      layoutId={`tool-card-${tool.id}`}
      className="relative m-4 md:m-8 bg-brand-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden h-[calc(100vh-6rem)] flex flex-col"
    >
      <header className="flex items-center p-4 border-b border-white/10">
        <Link
          to="/"
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div className="flex items-center gap-3 ml-4">
          <div className="text-brand-secondary">{tool.icon}</div>
          <div>
            <h2 className="text-xl font-bold font-poppins text-white">{tool.name}</h2>
            <p className="text-xs text-gray-400">{tool.description}</p>
          </div>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        <main className="flex-grow h-full overflow-y-auto">
          <ToolComponent />
        </main>
        
        <aside className="w-80 border-l border-white/10 p-4 h-full overflow-y-auto custom-scrollbar hidden lg:block">
          <h3 className="text-lg font-semibold text-brand-secondary font-poppins mb-4">Settings</h3>
          <Card className="mb-4">
              <label className="block text-sm font-medium text-gray-300">Model</label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm text-white">
                  <option>Gemini 2.5 Pro</option>
                  <option>Gemini 2.5 Flash</option>
              </select>
          </Card>
          <h3 className="text-lg font-semibold text-brand-secondary font-poppins mb-4 mt-6">History</h3>
          <div className="space-y-2 text-sm text-gray-400">
             <p className="p-2 bg-white/5 rounded-md">No history yet.</p>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default AiToolShell;
