'use client';
import { useEffect, useState } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { TimelineItem } from '../elements/TimelineItem';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../elements/ScrollReveal';
import { useExperience } from '../../lib/data/experience';
import { getStaticContentLabels } from '../../lib/data/contentLabels';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { useSectionDwell } from '@/lib/hooks/useSectionDwell';

export const Experience = () => {
  const { experience: experienceData, loading } = useExperience();
  const { geo } = useGeolocation();
  useSectionDwell('experience', geo?.country);
  const [contentLabels, setContentLabels] = useState(getStaticContentLabels());

  useEffect(() => {
    const labels = getStaticContentLabels();
    if (labels && Object.keys(labels).length > 0) setContentLabels(labels);
  }, []);

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-linear-to-b from-slate-50 to-white">
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
    <section id="experience" className="py-20 bg-linear-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <SectionHeader
            subtitle={contentLabels?.experience?.subtitle || ''}
            title={contentLabels?.experience?.title || 'Experience'}
            description={contentLabels?.experience?.description || ''}
          />
        </ScrollReveal>

        <StaggerContainer className="max-w-3xl mx-auto mt-12 flex flex-col gap-6">
          {experienceData.map((exp, index) => (
            <StaggerItem key={index}>
              <TimelineItem {...exp} isLeft={index % 2 === 0} visitorCountry={geo?.country} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
