'use client';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

interface SkillBarProps {
  skillName: string;
  level: number;
  color?: string;
}

const getLevelLabel = (level: number) => {
  if (level >= 90) return 'Expert';
  if (level >= 75) return 'Advanced';
  if (level >= 50) return 'Intermediate';
  if (level >= 25) return 'Beginner';
  return 'Learning';
};

const colorClass: Record<string, string> = {
  blue:   'bg-linear-to-r from-blue-500 to-blue-600',
  green:  'bg-linear-to-r from-emerald-500 to-emerald-600',
  amber:  'bg-linear-to-r from-amber-500 to-amber-600',
  purple: 'bg-linear-to-r from-purple-500 to-purple-600',
};

export const SkillBar = ({ skillName, level, color = 'blue' }: SkillBarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  // Animate only once when bar enters viewport — avoids animating off-screen
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: '0px 0px -40px 0px' });

  const barColor = colorClass[color] ?? colorClass.blue;

  return (
    <div ref={ref} className="mb-6 group">
      <div className="flex justify-between items-center mb-3">
        <div className="flex-1">
          <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
            {skillName}
          </span>
          <span className="ml-2 text-xs font-medium text-slate-500 group-hover:text-slate-600 transition-colors">
            {getLevelLabel(level)}
          </span>
        </div>
        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full group-hover:bg-blue-100 transition-colors">
          {level}%
        </span>
      </div>

      <div className="w-full bg-linear-to-r from-slate-100 to-slate-50 rounded-full h-3 overflow-hidden shadow-sm group-hover:shadow-md transition-all">
        <div
          className={`h-3 rounded-full shadow-md group-hover:shadow-lg transition-[width] duration-1000 ease-out ${barColor}`}
          style={{ width: isInView ? `${level}%` : '0%' }}
        />
      </div>
    </div>
  );
};
