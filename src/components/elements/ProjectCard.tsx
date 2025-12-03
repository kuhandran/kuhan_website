
import { Badge } from './Badge';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  metrics?: string;
}

export const ProjectCard = ({ 
  title, 
  description, 
  image, 
  techStack, 
  liveUrl, 
  githubUrl,
  metrics 
}: ProjectCardProps) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 mb-4 line-clamp-2">{description}</p>
        
        {metrics && (
          <div className="mb-4">
            <Badge variant="green" size="sm">{metrics}</Badge>
          </div>
        )}
        
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
              {tech}
            </span>
          ))}
        </div>
        
        {/* Links */}
        <div className="flex gap-3">
          {liveUrl && (
            <a 
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              <ExternalLink size={16} />
              View Live
            </a>
          )}
          {githubUrl && (
            <a 
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium text-sm"
            >
              <Github size={16} />
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};