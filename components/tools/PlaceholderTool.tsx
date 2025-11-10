import React from 'react';
import Card from '../ui/Card';

interface PlaceholderToolProps {
  name: string;
}

const PlaceholderTool: React.FC<PlaceholderToolProps> = ({ name }) => {
  return (
    <div className="p-4 h-full flex items-center justify-center">
      <Card className="text-center">
        <h2 className="text-2xl font-bold font-grotesk text-brand-secondary">{name}</h2>
        <p className="mt-4 text-brand-text">This tool is coming soon!</p>
        <div className="mt-6 w-16 h-16 mx-auto border-4 border-brand-primary border-dashed rounded-full animate-spin-slow"></div>
      </Card>
    </div>
  );
};

export default PlaceholderTool;
