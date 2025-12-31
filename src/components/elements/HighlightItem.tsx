import React from 'react';

interface HighlightItemProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'emerald';
  icon?: React.ReactNode;
}

export const HighlightItem = ({ 
  children, 
  variant = 'emerald',
  icon
}: HighlightItemProps) => {
  const variants = {
    blue: 'text-blue-500 bg-blue-50',
    green: 'text-green-500 bg-green-50',
    emerald: 'text-emerald-500 bg-emerald-50',
  };

  return (
    <li className="flex items-start gap-3 text-slate-600">
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${variants[variant]}`}>
        {icon || <span className="font-bold text-sm">✓</span>}
      </div>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
};
