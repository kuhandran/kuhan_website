'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ItemsHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
}

export function ItemsHero({ title, subtitle, description }: ItemsHeroProps) {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {subtitle && (
            <p className="text-blue-100 uppercase tracking-wider text-sm font-semibold mb-4">
              {subtitle}
            </p>
          )}
          <h1 className="text-5xl font-bold mb-6 text-white">{title}</h1>
          {description && (
            <p className="text-xl text-blue-100 leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </section>
  );
}

// Alias for case studies
export const CaseStudiesHero = ItemsHero;
