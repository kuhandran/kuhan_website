'use client';

import { Card } from './Card';

interface EducationCardProps {
  education: {
    school: string;
    degree: string;
    field: string;
    graduationDate: string;
    cgpa?: string;
    activities?: string[];
  };
}

export const EducationCard = ({ education }: EducationCardProps) => {
  return (
    <Card>
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-slate-900">{education.school}</h3>
        <p className="text-sm text-blue-600 font-semibold">
          {education.degree} in {education.field}
        </p>
        <p className="text-sm text-slate-600">Graduated: {education.graduationDate}</p>
        {education.cgpa && (
          <p className="text-sm text-slate-600">CGPA: {education.cgpa}</p>
        )}
        {education.activities && education.activities.length > 0 && (
          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-2">Activities:</p>
            <div className="flex flex-wrap gap-2">
              {education.activities.map((activity, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                >
                  {activity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
