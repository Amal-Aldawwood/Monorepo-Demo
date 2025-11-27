import React from 'react';

interface CardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
  color?: string;
}

export const Card = ({ title, className, children, color }: CardProps) => {
  const borderStyle = color ? { borderColor: color, borderTopWidth: '4px' } : {};
  
  return (
    <div 
      className={`bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className || ''}`}
      style={borderStyle}
    >
      {title && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};
