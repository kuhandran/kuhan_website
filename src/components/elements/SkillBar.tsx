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
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    green: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    amber: 'bg-gradient-to-r from-amber-500 to-amber-600',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600'
  }[color] || 'bg-gradient-to-r from-blue-500 to-blue-600';
  
  const getLevelLabel = (level: number) => {
    if (level >= 90) return 'Expert';
    if (level >= 75) return 'Advanced';
    if (level >= 50) return 'Intermediate';
    if (level >= 25) return 'Beginner';
    return 'Learning';
  };
  
  return (
    <div className="mb-6 group">
      <div className="flex justify-between items-center mb-3">
        <div className="flex-1">
          <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">{skillName}</span>
          <span className="ml-2 text-xs font-medium text-slate-500 group-hover:text-slate-600 transition-colors">
            {getLevelLabel(level)}
          </span>
        </div>
        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full group-hover:bg-blue-100 transition-colors">
          {level}%
        </span>
      </div>
      <div className="w-full bg-gradient-to-r from-slate-100 to-slate-50 rounded-full h-3 overflow-hidden shadow-sm group-hover:shadow-md transition-all">
        <div 
          className={`h-3 rounded-full transition-all duration-1000 ease-out shadow-md group-hover:shadow-lg ${colorClass}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};
