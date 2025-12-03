import { SectionHeader } from '../elements/SectionHeader';
import { ProjectCard } from '../elements/ProjectCard';
import { projectsData } from '../../lib/data/projects';

export const Projects = () => {
  return (
    <section id="projects" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle="Portfolio"
          title="Featured Projects"
          description="Showcasing impactful solutions across enterprise applications"
        />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projectsData.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};