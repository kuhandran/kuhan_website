import { useEffect, useState } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { TimelineItem } from '../elements/TimelineItem';
import { experienceData } from '../../lib/data/experience';
import { getStaticContentLabels } from '../../lib/data/contentLabels';

export const Experience = () => {
  const [contentLabels, setContentLabels] = useState(getStaticContentLabels());

  useEffect(() => {
    const labels = getStaticContentLabels();
    if (labels && Object.keys(labels).length > 0) {
      setContentLabels(labels);
    }
  }, []);

  return (
    <section id="experience" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle={contentLabels.experience.subtitle}
          title={contentLabels.experience.title}
          description={contentLabels.experience.description}
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