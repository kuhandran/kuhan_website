import React from 'react';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  variant?: 'white' | 'gradient';
}

export const SectionCard = ({ 
  title, 
  children,
  variant = 'white'
}: SectionCardProps) => {
  const variants = {
    white: 'bg-white border border-slate-200',
    gradient: 'bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200'
  };

  return (
    <div className={`rounded-xl p-6 shadow-md ${variants[variant]}`}>
      <h3 className="text-lg font-bold text-slate-900 mb-4">{title}</h3>
      {children}
    </div>
  );
};
