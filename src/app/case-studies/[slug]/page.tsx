'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { getCaseStudyBySlug, getRelatedCaseStudies } from '@/lib/data/caseStudies';
import { Card } from '@/components/elements/Card';
import { Button } from '@/components/elements/Button';
import { TechTag } from '@/components/elements/TechTag';
import { ChevronLeft, ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const caseStudy = getCaseStudyBySlug(params.slug);
  const relatedStudies = getRelatedCaseStudies(params.slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <Link href="#projects" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
            <ChevronLeft size={16} />
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="flex items-center justify-center">
            <img 
              src={caseStudy.image} 
              alt={caseStudy.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{caseStudy.title}</h1>
            <p className="text-xl text-slate-300 mb-6">{caseStudy.subtitle}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-800/50 p-6 rounded-lg">
              <div>
                <p className="text-sm text-slate-400">Client</p>
                <p className="text-lg font-semibold">{caseStudy.client}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Duration</p>
                <p className="text-lg font-semibold">{caseStudy.duration}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Role</p>
                <p className="text-lg font-semibold">{caseStudy.role}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Team Size</p>
                <p className="text-lg font-semibold">5-8 members</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              {caseStudy.liveUrl && caseStudy.liveUrl !== '#' && (
                <a href={caseStudy.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" className="flex items-center gap-2">
                    View Live <ExternalLink size={16} />
                  </Button>
                </a>
              )}
              {caseStudy.githubUrl && caseStudy.githubUrl !== '#' && (
                <a href={caseStudy.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" className="flex items-center gap-2">
                    GitHub <Github size={16} />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Challenge & Solution */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">Challenge</h2>
              <p className="text-slate-300 leading-relaxed">{caseStudy.challenge}</p>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Solution</h2>
              <p className="text-slate-300 leading-relaxed">{caseStudy.solution}</p>
            </div>
          </Card>
        </div>

        {/* Results Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Key Results</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {caseStudy.results.map((result, index) => (
              <Card key={index} className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30">
                <div className="p-6 text-center">
                  <p className="text-sm text-slate-400 mb-2">{result.metric}</p>
                  <p className="text-3xl font-bold text-blue-400">{result.value}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Achievements */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Key Achievements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {caseStudy.keyAchievements.map((achievement, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 p-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 font-semibold">✓</span>
                  </div>
                  <p className="text-slate-300">{achievement}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {caseStudy.techStack.map((tech, index) => (
              <TechTag key={index} name={tech} />
            ))}
          </div>
        </div>

        {/* Related Case Studies */}
        {relatedStudies.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Related Case Studies</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedStudies.map((study) => (
                <Link key={study.slug} href={`/case-studies/${study.slug}`}>
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-400 transition-colors cursor-pointer h-full">
                    <div className="p-6">
                      <img 
                        src={study.image} 
                        alt={study.title}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-xl font-bold mb-2 hover:text-blue-400 transition-colors">{study.title}</h3>
                      <p className="text-slate-400 text-sm mb-4">{study.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {study.techStack.slice(0, 3).map((tech, index) => (
                          <span key={index} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Interested in similar work?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">Let's discuss how I can help transform your business with similar innovative solutions.</p>
          <Link href="#contact">
            <Button variant="primary" size="lg">
              Get In Touch
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
