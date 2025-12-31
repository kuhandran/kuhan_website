'use client';

import React from 'react';

interface Section {
  id: string;
  title: string;
  content: string;
}

interface ChallengeSolutionProps {
  challenge: Section;
  solution: Section;
}

export function ChallengeSolution({ challenge, solution }: ChallengeSolutionProps) {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Challenge */}
          <div id={challenge.id}>
            <h2 className="text-3xl font-bold mb-6 text-slate-900">{challenge.title}</h2>
            <p className="text-lg text-slate-700 leading-relaxed">{challenge.content}</p>
          </div>

          {/* Solution */}
          <div id={solution.id}>
            <h2 className="text-3xl font-bold mb-6 text-slate-900">{solution.title}</h2>
            <p className="text-lg text-slate-700 leading-relaxed">{solution.content}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
