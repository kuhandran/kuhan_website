'use client';

import React from 'react';
import { Card } from '@/components/elements/Card';

interface AchievementsListProps {
  title: string;
  items: string[];
}

export function AchievementsList({ title, items }: AchievementsListProps) {
  return (
    <section id="achievements" className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-slate-900">{title}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {items.map((achievement, index) => (
              <Card key={index} className="bg-white border border-slate-200 p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <span className="text-blue-600 font-bold text-lg">✓</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{achievement}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
