'use client';

import React from 'react';
import Link from 'next/link';
import { caseStudies } from '@/lib/data/caseStudies';
import { Card } from '@/components/elements/Card';
import { TechTag } from '@/components/elements/TechTag';
import { ChevronRight } from 'lucide-react';

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Case Studies
          </h1>
          <p className="text-xl text-slate-300">
            Explore in-depth insights into my most significant projects, detailing the challenges overcome, solutions implemented, and measurable results delivered.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {caseStudies.map((study) => (
            <Link key={study.slug} href={`/case-studies/${study.slug}`}>
              <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-400 transition-all duration-300 cursor-pointer h-full hover:shadow-xl hover:-translate-y-1">
                <div className="p-8">
                  {/* Image */}
                  <div className="mb-6 rounded-lg overflow-hidden h-48 bg-gradient-to-br from-slate-700 to-slate-900">
                    <img 
                      src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Client & Duration */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-slate-400">Client</p>
                      <p className="text-lg font-semibold">{study.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Duration</p>
                      <p className="text-lg font-semibold">{study.duration}</p>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h2 className="text-2xl font-bold mb-2 hover:text-blue-400 transition-colors">{study.title}</h2>
                  <p className="text-sm text-slate-400 mb-4">{study.subtitle}</p>

                  {/* Description */}
                  <p className="text-slate-300 mb-6 line-clamp-2">{study.description}</p>

                  {/* Key Results Highlight */}
                  <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400 mb-3">Key Results</p>
                    <div className="grid grid-cols-2 gap-3">
                      {study.results.slice(0, 2).map((result, index) => (
                        <div key={index}>
                          <p className="text-blue-400 font-bold text-lg">{result.value}</p>
                          <p className="text-xs text-slate-400">{result.metric}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-6">
                    <p className="text-sm text-slate-400 mb-2">Technologies</p>
                    <div className="flex flex-wrap gap-2">
                      {study.techStack.slice(0, 4).map((tech, index) => (
                        <TechTag key={index} name={tech} />
                      ))}
                      {study.techStack.length > 4 && (
                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                          +{study.techStack.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-blue-400 font-semibold group">
                    Read Full Case Study
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to discuss your project?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Let's explore how similar strategies and expertise can transform your business goals into measurable success.
          </p>
          <Link href="#contact">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
              Start a Conversation
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
