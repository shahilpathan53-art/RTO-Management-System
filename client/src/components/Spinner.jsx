import React from 'react';

const Spinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizes[size]} border-4 border-gray-100 border-t-primary rounded-full animate-spin`} />
      {text && <p className="text-sm font-bold text-gray-500 animate-pulse">{text}</p>}
    </div>
  );
};

export default Spinner;
