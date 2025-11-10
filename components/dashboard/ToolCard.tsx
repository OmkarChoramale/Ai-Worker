import React from 'react';
import { motion } from 'framer-motion';
import { AITool } from '../../types';
import { Link } from 'react-router-dom';

interface ToolCardProps {
  tool: AITool;
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05, y: -5 },
};

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <Link to={`/tool/${tool.id}`}>
      <motion.div
        layoutId={`tool-card-${tool.id}`}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.3 }}
        className="relative p-6 bg-white/5 border border-white/10 rounded-2xl h-full flex flex-col items-center text-center cursor-pointer overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-brand-secondary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-4 text-brand-secondary h-8 w-8 flex items-center justify-center mx-auto">
              {tool.icon}
          </div>
          <h3 className="text-lg font-bold font-poppins text-white">{tool.name}</h3>
          <p className="text-sm text-gray-400 mt-2 flex-grow">{tool.description}</p>
        </div>
      </motion.div>
    </Link>
  );
};

export default ToolCard;
