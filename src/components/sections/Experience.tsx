import { SectionHeader } from '../elements/SectionHeader';
import { TimelineItem } from '../elements/TimelineItem';
import { experienceData } from '../../lib/data/experience';

export const Experience = () => {
  return (
    <section id="experience" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle="Career Journey"
          title="Professional Experience"
          description="8+ years of progressive growth in technical leadership"
        />
        
        <div className="max-w-5xl mx-auto">
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