// ============================================
// FILE: src/components/ui/TimelineItem.tsx
// ============================================

import { Badge } from './Badge';
import { Card } from './Card';
import { CheckCircle2, Briefcase, MapPin, Calendar } from 'lucide-react';

interface TimelineItemProps {
  title: string;
  company: string;
  duration: string;
  location: string;
  description: string[];
  techStack: string[];
  isLeft?: boolean;
  logo?: string;
}

export const TimelineItem = ({ 
  title, 
  company, 
  duration, 
  location, 
  description, 
  techStack, 
  isLeft = true,
  logo 
}: TimelineItemProps) => {
  return (
    <div className={`flex gap-6 md:gap-8 mb-12 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      {/* Timeline dot - Hidden on mobile */}
      <div className="hidden md:flex flex-col items-center">
        <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full border-4 border-white shadow-md hover:scale-110 transition-transform" />
        <div className="w-1 h-full bg-gradient-to-b from-blue-200 to-transparent -mt-2" />
      </div>
      
      {/* Content Card - Enhanced */}
      <div className={`flex-1 ${isLeft ? 'md:text-left' : 'md:text-right'}`}>
        <Card className="p-6 md:p-8 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50 border-l-4 border-l-blue-500">
          {/* Header Section */}
          <div className="flex items-start gap-4 mb-6">
            {logo && (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                <picture>
                  <source srcSet={logo.replace(/\.(png|jpg|jpeg)$/i, '.webp')} type="image/webp" />
                  <img src={logo} alt={company} className="w-9 h-9 object-contain" />
                </picture>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-1">{title}</h3>
              <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{company}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Calendar size={14} className="text-blue-500" />
                  {duration}
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} className="text-blue-500" />
                  {location}
                </span>
              </div>
            </div>
          </div>
          
          {/* Achievements Section */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Briefcase size={14} className="text-blue-500" />
              Key Achievements
            </h4>
            <ul className="space-y-3">
              {description.map((item, index) => (
                <li key={index} className="text-slate-600 flex items-start gap-3 group hover:bg-blue-50/50 p-2 rounded-lg transition-colors">
                  <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Tech Stack */}
          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Technologies</p>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <div key={index} className="group">
                  <Badge 
                    variant="blue" 
                    size="sm"
                  >
                    {tech}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};