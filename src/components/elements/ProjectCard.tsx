'use client';
import { memo } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Badge } from './Badge';
import { getImage } from '@/lib/api/apiClient';
import { ExternalLink, GitBranch, ArrowRight } from 'lucide-react';

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
  caseStudySlug?: string;
}

const ProjectCardInner = ({
  title,
  description,
  image,
  techStack,
  liveUrl,
  githubUrl,
  metrics,
  highlights,
  caseStudySlug,
}: ProjectCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rawRotateX = useTransform(y, [-0.5, 0.5], [6, -6]);
  const rawRotateY = useTransform(x, [-0.5, 0.5], [-6, 6]);
  const rotateX = useSpring(rawRotateX, { stiffness: 200, damping: 25 });
  const rotateY = useSpring(rawRotateY, { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="w-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300 group flex flex-col cursor-default"
    >
      {/* Image */}
      <div className="relative w-full h-56 overflow-hidden bg-linear-to-br from-slate-50 to-slate-100 shrink-0">
        <picture>
          <source srcSet={getImage(image).replace(/\.(png|jpg|jpeg)$/i, '.webp')} type="image/webp" />
          <img
            src={getImage(image)}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </picture>
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {metrics && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="green" size="sm">{metrics}</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col grow">
        <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-4 line-clamp-3">{description}</p>

        {highlights && highlights.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {highlights.slice(0, 3).map((highlight, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap"
              >
                <ArrowRight size={12} className="shrink-0" />
                <span className="line-clamp-1">{highlight}</span>
              </span>
            ))}
            {highlights.length > 3 && (
              <span className="inline-flex items-center text-xs font-medium text-slate-500 px-2.5 py-1 bg-slate-50 rounded-full">
                +{highlights.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-500 mb-2.5 uppercase tracking-wide">Technologies</p>
          <div className="flex flex-wrap gap-2">
            {(techStack || []).map((tech, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-linear-to-r from-slate-100 to-slate-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 hover:border-blue-300 hover:text-blue-700 transition-all hover:shadow-sm whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 my-4 mt-auto" />

        <div className="flex gap-3 pt-2 flex-wrap">
          {caseStudySlug && (
            <Link
              href={`/case-studies/${caseStudySlug}`}
              className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors group/link"
            >
              <ArrowRight size={16} className="group-hover/link:translate-x-0.5 transition-transform shrink-0" />
              View Case Study
            </Link>
          )}
          {liveUrl && liveUrl !== '#' && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors group/link"
            >
              <ExternalLink size={16} className="group-hover/link:translate-x-0.5 transition-transform shrink-0" />
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
              <GitBranch size={16} className="group-hover/link:translate-x-0.5 transition-transform shrink-0" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ProjectCard = memo(ProjectCardInner);
