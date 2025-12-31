'use client';

import React from 'react';

interface ItemsLoadingProps {
  count?: number;
}

export function ItemsLoading({ count = 6 }: ItemsLoadingProps) {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="animate-pulse">
              {/* Image skeleton */}
              <div className="h-48 bg-slate-300 rounded-lg mb-4" />

              {/* Content skeleton */}
              <div className="space-y-3">
                <div className="h-6 bg-slate-300 rounded w-3/4" />
                <div className="h-4 bg-slate-300 rounded w-full" />
                <div className="h-4 bg-slate-300 rounded w-5/6" />

                {/* Tech tags skeleton */}
                <div className="flex gap-2 pt-2">
                  <div className="h-6 bg-slate-300 rounded-full w-16" />
                  <div className="h-6 bg-slate-300 rounded-full w-20" />
                  <div className="h-6 bg-slate-300 rounded-full w-14" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Alias for case studies
export const CaseStudiesLoading = ItemsLoading;
