'use client';

import React from 'react';
import { TechTag } from '@/components/elements/TechTag';

interface TechStackDisplayProps {
  title: string;
  technologies: string[];
}

export function TechStackDisplay({ title, technologies }: TechStackDisplayProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-slate-900">{title}</h2>
          <div className="flex flex-wrap gap-3">
            {technologies.map((tech, index) => (
              <TechTag key={index} name={tech} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
