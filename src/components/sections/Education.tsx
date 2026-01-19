import { useState } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { Card } from '../elements/Card';
import { Badge } from '../elements/Badge';
import { useEducation } from '../../lib/data/education';
import { GraduationCap } from 'lucide-react';
import { getStaticContentLabels } from '../../lib/data/contentLabels';

export const Education = () => {
  const { education: educationData, loading } = useEducation();
  const [contentLabels] = useState(getStaticContentLabels());

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            subtitle={contentLabels?.education?.subtitle || ''}
            title={contentLabels?.education?.title || 'Education'}
            description={contentLabels?.education?.description || ''}
          />
          <div className="text-center text-gray-500 mt-8">Loading education...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle={contentLabels?.education?.subtitle || ''}
          title={contentLabels?.education?.title || 'Education'}
          description={contentLabels?.education?.description || ''}
        />
        
        <div className="max-w-4xl mx-auto space-y-6">
          {Array.isArray(educationData) && educationData.map((edu, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="text-blue-600" size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{edu.degree}</h3>
                      <p className="text-blue-600 font-semibold">{edu.institution}</p>
                    </div>
                    <Badge variant="blue">{edu.duration}</Badge>
                  </div>
                  <p className="text-slate-600 mb-3">{edu.location}</p>
                  {edu.focus && (
                    <p className="text-sm text-slate-500">
                      <strong>Focus:</strong> {edu.focus}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};