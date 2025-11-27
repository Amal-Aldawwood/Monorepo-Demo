import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = ({ 
  label, 
  error, 
  fullWidth = false,
  className,
  id,
  ...props 
}: InputProps) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  const inputClasses = `
    px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600
    bg-white dark:bg-zinc-800 text-black dark:text-white
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className || ''}
  `.trim();
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label htmlFor={inputId} className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input id={inputId} className={inputClasses} {...props} />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
