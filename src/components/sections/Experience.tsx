import { useEffect, useState } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { TimelineItem } from '../elements/TimelineItem';
import { useExperience } from '../../lib/data/experience';
import { getStaticContentLabels } from '../../lib/data/contentLabels';

export const Experience = () => {
  const { experience: experienceData, loading } = useExperience();
  const [contentLabels, setContentLabels] = useState(getStaticContentLabels());

  useEffect(() => {
    const labels = getStaticContentLabels();
    if (labels && Object.keys(labels).length > 0) {
      setContentLabels(labels);
    }
  }, []);

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            subtitle={contentLabels?.experience?.subtitle || ''}
            title={contentLabels?.experience?.title || 'Experience'}
            description={contentLabels?.experience?.description || ''}
          />
          <div className="text-center text-gray-500 mt-8">Loading experience...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle={contentLabels?.experience?.subtitle || ''}
          title={contentLabels?.experience?.title || 'Experience'}
          description={contentLabels?.experience?.description || ''}
        />
        
        
        <div className="max-w-5xl mx-auto mt-12">
          {experienceData.map((exp, index) => (
            <TimelineItem
              key={index}
              {...exp}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};