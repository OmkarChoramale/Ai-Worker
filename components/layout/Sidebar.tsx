import React from 'react';
import { Category } from '../../types';
import {
  Sparkles, Bot, Mic, Image as ImageIcon, Video, Wrench
} from 'lucide-react';

interface SidebarProps {
  selectedCategory: Category | 'All';
  setSelectedCategory: (category: Category | 'All') => void;
}

// Fix: Use React.ReactElement instead of JSX.Element to avoid namespace errors.
const categoryIcons: Record<Category | 'All', React.ReactElement> = {
  'All': <Sparkles size={20} />,
  [Category.SPEECH_AUDIO]: <Mic size={20} />,
  [Category.TEXT_WRITING]: <Bot size={20} />,
  [Category.IMAGE_DESIGN]: <ImageIcon size={20} />,
  [Category.VIDEO_MEDIA]: <Video size={20} />,
  [Category.UTILITY]: <Wrench size={20} />,
};

const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, setSelectedCategory }) => {
  const categories: (Category | 'All')[] = ['All', ...Object.values(Category)];

  return (
    <aside className="w-64 p-4 border-r border-white/10 h-full overflow-y-auto custom-scrollbar">
      <h2 className="text-lg font-semibold font-poppins text-white mb-6">Categories</h2>
      <nav className="space-y-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-brand-primary/20 text-brand-secondary'
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {categoryIcons[category]}
            <span className="font-medium">{category}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
