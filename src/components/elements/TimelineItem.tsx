// ============================================
// FILE: src/components/ui/TimelineItem.tsx
// ============================================

import { Badge } from './Badge';
import { Card } from './Card';

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
    <div className={`flex gap-8 mb-12 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      {/* Timeline dot - Hidden on mobile */}
      <div className="hidden md:flex flex-col items-center">
        <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-md" />
        <div className="w-0.5 h-full bg-slate-200 -mt-2" />
      </div>
      
      {/* Content Card */}
      <div className={`flex-1 ${isLeft ? 'md:text-left' : 'md:text-right'}`}>
        <Card>
          <div className="flex items-start gap-4 mb-4">
            {logo && (
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <img src={logo} alt={company} className="w-8 h-8 object-contain" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <p className="text-blue-600 font-semibold">{company}</p>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <span>{duration}</span>
                <span>•</span>
                <span>{location}</span>
              </div>
            </div>
          </div>
          
          <ul className="space-y-2 mb-4">
            {description.map((item, index) => (
              <li key={index} className="text-slate-600 flex items-start gap-2">
                <span className="text-blue-500 mt-1.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, index) => (
              <Badge key={index} variant="blue" size="sm">{tech}</Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};