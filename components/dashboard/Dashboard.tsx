import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AITool, Category } from '../../types';
import { AI_TOOLS } from '../../constants';
import ToolCard from './ToolCard';
import Sidebar from '../layout/Sidebar';

const Dashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const filteredTools = useMemo(() => {
    if (selectedCategory === 'All') {
      return AI_TOOLS;
    }
    return AI_TOOLS.filter(tool => tool.category === selectedCategory);
  }, [selectedCategory]);
  
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <h2 className="text-3xl font-bold font-grotesk text-white mb-6">All Tools</h2>
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          <AnimatePresence>
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
