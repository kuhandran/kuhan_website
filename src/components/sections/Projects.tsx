import { useEffect, useState } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { ProjectCard } from '../elements/ProjectCard';
import { projectsData } from '../../lib/data/projects';
import { getStaticContentLabels } from '../../lib/data/contentLabels';

export const Projects = () => {
  const [contentLabels, setContentLabels] = useState(getStaticContentLabels());

  useEffect(() => {
    const labels = getStaticContentLabels();
    if (labels && Object.keys(labels).length > 0) {
      setContentLabels(labels);
    }
  }, []);

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subtitle={contentLabels.projects.subtitle}
          title={contentLabels.projects.title}
          description={contentLabels.projects.description}
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '48px' }}>
          {projectsData.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};