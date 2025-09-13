import React from 'react';

interface HoverCardProps {
  title: string;
  image: string;
  description: string;
  hoverContent?: string;
}

const HoverCard: React.FC<HoverCardProps> = ({ title, image, description, hoverContent }) => {
  return (
    <div className="group relative w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-white text-center p-4">
          <h4 className="text-lg font-semibold mb-2">More Info</h4>
          <p className="text-sm">{hoverContent || 'Hover content here'}</p>
        </div>
      </div>
    </div>
  );
};

export default HoverCard;