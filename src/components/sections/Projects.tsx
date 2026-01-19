import { useState } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { ProjectCard } from '../elements/ProjectCard';
import { useProjects } from '../../lib/data/projects';
import { getStaticContentLabels } from '../../lib/data/contentLabels';

export const Projects = () => {
  const { projects: projectsData, loading } = useProjects();
  const [contentLabels] = useState(getStaticContentLabels());

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle={contentLabels?.projects?.subtitle || ''}
            title={contentLabels?.projects?.title || 'Projects'}
            description={contentLabels?.projects?.description || ''}
          />
          <div className="text-center text-gray-500 mt-8">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subtitle={contentLabels?.projects?.subtitle || ''}
          title={contentLabels?.projects?.title || 'Projects'}
          description={contentLabels?.projects?.description || ''}
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '48px' }}>
          {Array.isArray(projectsData) && projectsData.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};