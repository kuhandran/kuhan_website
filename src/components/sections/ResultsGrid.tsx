'use client';

import React from 'react';
import { Card } from '@/components/elements/Card';

interface ResultItem {
  metric: string;
  value: string | number;
  description?: string;
}

interface ResultsGridProps {
  title: string;
  items: ResultItem[];
  layout?: 'grid-2' | 'grid-3' | 'grid-4';
}

export function ResultsGrid({ title, items, layout = 'grid-4' }: ResultsGridProps) {
  const layoutClasses = {
    'grid-2': 'md:grid-cols-2',
    'grid-3': 'md:grid-cols-3',
    'grid-4': 'md:grid-cols-4',
  };

  return (
    <section id="results" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-slate-900">{title}</h2>
          <div className={`grid ${layoutClasses[layout]} gap-6`}>
            {items.map((result, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
              >
                <div className="p-6 text-center">
                  <p className="text-sm text-slate-600 uppercase tracking-wide font-semibold mb-2">
                    {result.metric}
                  </p>
                  <p className="text-4xl font-bold text-blue-600 mb-2">{result.value}</p>
                  {result.description && (
                    <p className="text-xs text-slate-600">{result.description}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
