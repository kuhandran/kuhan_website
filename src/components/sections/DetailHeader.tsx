'use client';

import React from 'react';
import { ImageCarousel } from '@/components/elements/ImageCarousel';
import { Button } from '@/components/elements/Button';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

interface DetailInfo {
  label: string;
  value: string;
}

interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  images: string[];
  details?: DetailInfo[];
  links?: {
    live?: string;
    github?: string;
  };
  actionLabel?: string;
  onAction?: () => void;
}

export function DetailHeader({
  title,
  subtitle,
  description,
  images,
  details = [],
  links,
  actionLabel,
  onAction,
}: DetailHeaderProps) {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Image Carousel */}
          <ImageCarousel images={images} title={title} />

          {/* Content */}
          <div>
            {subtitle && (
              <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm mb-2">
                {subtitle}
              </p>
            )}
            <h1 className="text-5xl font-bold mb-6 text-slate-900">{title}</h1>

            {/* Meta Info Grid */}
            {details.length > 0 && (
              <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-200">
                {details.map((detail, index) => (
                  <div key={index}>
                    <p className="text-sm text-slate-600 uppercase tracking-wide font-semibold">
                      {detail.label}
                    </p>
                    <p className="text-lg font-bold text-slate-900 mt-2">{detail.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="text-lg text-slate-700 leading-relaxed mb-8">{description}</p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {links?.live && (
                <a
                  href={links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink size={18} />
                  View Live
                </a>
              )}
              {links?.github && (
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg hover:border-slate-400 transition-colors"
                >
                  <Github size={18} />
                  Source Code
                </a>
              )}
              {actionLabel && onAction && (
                <Button onClick={onAction} className="inline-flex items-center gap-2">
                  {actionLabel}
                  <ArrowRight size={18} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
