'use client';

import React from 'react';
import { Card } from '@/components/elements/Card';
import { TechTag } from '@/components/elements/TechTag';

interface Item {
  slug: string;
  title: string;
  description: string;
  image: string;
  techStack?: string[];
  results?: { metric: string; value: string | number }[];
}

interface ItemsGridProps {
  items: Item[];
  onItemClick?: (slug: string) => void;
}

export function ItemsGrid({ items, onItemClick }: ItemsGridProps) {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {items.map((item) => (
            <button
              key={item.slug}
              onClick={() => onItemClick?.(item.slug)}
              className="text-left cursor-pointer group"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">{item.description}</p>

                  {/* Tech Stack */}
                  {item.techStack && item.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.techStack.slice(0, 3).map((tech, idx) => (
                        <TechTag key={idx} name={tech} />
                      ))}
                      {item.techStack.length > 3 && (
                        <span className="text-xs text-slate-500">
                          +{item.techStack.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Results Preview */}
                  {item.results && item.results.length > 0 && (
                    <div className="flex justify-between text-sm pt-4 border-t border-slate-200">
                      {item.results.slice(0, 2).map((result, idx) => (
                        <div key={idx}>
                          <p className="text-blue-600 font-bold">{result.value}</p>
                          <p className="text-xs text-slate-500">{result.metric}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// Alias for case studies
export const CaseStudiesGrid = ItemsGrid;
