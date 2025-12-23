import { SectionHeader } from '../elements/SectionHeader';
import { ProjectCard } from '../elements/ProjectCard';
import { projectsData } from '../../lib/data/projects';
import contentLabels from '../../../public/data/contentLabels.json';

export const Projects = () => {
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