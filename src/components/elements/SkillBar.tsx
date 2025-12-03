'use client';
import { useEffect, useState } from 'react';

interface SkillBarProps {
  skillName: string;
  level: number;
  color?: string;
}

export const SkillBar = ({ skillName, level, color = 'blue' }: SkillBarProps) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setWidth(level), 100);
    return () => clearTimeout(timer);
  }, [level]);
  
  const colorClass = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500'
  }[color] || 'bg-blue-500';
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-700">{skillName}</span>
        <span className="text-sm font-semibold text-slate-900">{level}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${colorClass}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};
