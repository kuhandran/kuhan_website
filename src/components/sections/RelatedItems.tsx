'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/elements/Card';
import { TechTag } from '@/components/elements/TechTag';

interface RelatedItem {
  slug: string;
  title: string;
  description: string;
  image: string;
  techStack?: string[];
  results?: { metric: string; value: string | number }[];
}

interface RelatedItemsProps {
  title: string;
  items: RelatedItem[];
  itemType?: 'caseStudy' | 'project' | 'portfolio';
}

export function RelatedItems({ title, items, itemType = 'caseStudy' }: RelatedItemsProps) {
  const router = useRouter();

  if (!items || items.length === 0) {
    return null;
  }

  const getItemUrl = (slug: string) => {
    switch (itemType) {
      case 'project':
        return `/projects/${slug}`;
      case 'portfolio':
        return `/portfolio/${slug}`;
      case 'caseStudy':
      default:
        return `/case-studies/${slug}`;
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-slate-900">{title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => router.push(getItemUrl(item.slug))}
                className="text-left cursor-pointer"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow group h-full">
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
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.description}</p>

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
                      <div className="flex justify-between text-sm">
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
      </div>
    </section>
  );
}
