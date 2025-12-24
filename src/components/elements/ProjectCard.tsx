
import { Badge } from './Badge';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  fullDescription?: string;
  image: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  metrics?: string;
  highlights?: string[];
}

export const ProjectCard = ({ 
  title, 
  description, 
  fullDescription,
  image, 
  techStack, 
  liveUrl, 
  githubUrl,
  metrics,
  highlights
}: ProjectCardProps) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group flex flex-col">
      {/* Image Container */}
      <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 flex-shrink-0">
        <picture>
          {/* WebP fallback */}
          <source srcSet={image.replace(/\.(png|jpg|jpeg)$/i, '.webp')} type="image/webp" />
          {/* Original format fallback */}
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Metrics Badge - Overlay */}
        {metrics && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="green" size="sm">{metrics}</Badge>
          </div>
        )}
      </div>
      
      {/* Content - Flex grow to push footer down */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-4 line-clamp-3">{description}</p>
        
        {/* Highlights Section */}
        {highlights && highlights.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {highlights.slice(0, 3).map((highlight, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap"
                >
                  <ArrowRight size={12} className="flex-shrink-0" />
                  <span className="line-clamp-1">{highlight}</span>
                </span>
              ))}
              {highlights.length > 3 && (
                <span className="inline-flex items-center text-xs font-medium text-slate-500 px-2.5 py-1 bg-slate-50 rounded-full">
                  +{highlights.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Tech Stack */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-500 mb-2.5 uppercase tracking-wide">Technologies</p>
          <div className="flex flex-wrap gap-2">
            {(techStack || []).map((tech, index) => (
              <span 
                key={index} 
                className="px-2.5 py-1 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 hover:border-slate-300 transition-all hover:shadow-sm whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-slate-200 my-4 mt-auto" />
        
        {/* Links */}
        <div className="flex gap-3 pt-2">
          {liveUrl && liveUrl !== '#' && (
            <a 
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors group/link"
            >
              <ExternalLink size={16} className="group-hover/link:translate-x-0.5 transition-transform flex-shrink-0" />
              View Live
            </a>
          )}
          {githubUrl && githubUrl !== '#' && (
            <a 
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors group/link"
            >
              <Github size={16} className="group-hover/link:translate-x-0.5 transition-transform flex-shrink-0" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};