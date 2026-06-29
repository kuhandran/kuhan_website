'use client';
import { useEffect, useRef, useState } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { Card } from '../elements/Card';
import { Badge } from '../elements/Badge';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../elements/ScrollReveal';
import { Trophy, Award, Sparkles, Zap } from 'lucide-react';
import { getStaticContentLabels } from '../../lib/data/contentLabels';
import { fetchAchievementsData, FALLBACK_ACHIEVEMENTS } from '@/lib/data/achievements';

export const Achievements = () => {
  const [contentLabels] = useState(getStaticContentLabels());
  // Seed with FALLBACK_ACHIEVEMENTS so server HTML and initial client render both have content
  const [achievementsData, setAchievementsData] = useState(FALLBACK_ACHIEVEMENTS);
  const sectionRef = useRef<HTMLElement>(null);
  const fetched = useRef(false);

  // Lazy-fetch fresh CDN data only when the section scrolls into view
  useEffect(() => {
    if (fetched.current) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fetched.current) {
          fetched.current = true;
          fetchAchievementsData().then(setAchievementsData);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-linear-to-b from-white to-slate-50">
      {/* Hidden structured text for crawlers — full content always in HTML */}
      <div className="sr-only" aria-hidden="false">
        <h2>Awards, Honours &amp; Professional Certifications — Kuhandran SamudraPandiyan</h2>
        {FALLBACK_ACHIEVEMENTS.awards.map(a => (
          <div key={a.name}>
            <h3>{a.name}</h3>
            <p>{a.organization} · {a.year}</p>
            <p>{a.description}</p>
          </div>
        ))}
        {FALLBACK_ACHIEVEMENTS.certifications.map(c => (
          <div key={c.name}>
            <h3>{c.name}</h3>
            <p>{c.provider} · {c.year}</p>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4">
        <ScrollReveal>
          <SectionHeader
            subtitle={contentLabels?.achievements?.subtitle || 'Recognition & Credentials'}
            title={contentLabels?.achievements?.title || 'Awards & Achievements'}
            description={contentLabels?.achievements?.description || 'Industry recognition, academic qualifications, and professional certifications that validate expertise and commitment to continuous learning.'}
          />
        </ScrollReveal>

        <div className="max-w-6xl mx-auto mt-12">
          {/* Awards */}
          <div className="mb-16">
            <ScrollReveal delay={0.05}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-linear-to-br from-amber-100 to-orange-100 rounded-lg">
                  <Trophy className="text-amber-600" size={28} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900">
                  {contentLabels?.achievements?.sections?.awards || 'Awards & Honours'}
                </h3>
                <Sparkles className="text-amber-500 animate-pulse" size={24} />
              </div>
            </ScrollReveal>

            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievementsData.awards.map((award, index) => (
                <StaggerItem key={index}>
                  <Card className="p-6 bg-linear-to-br from-amber-50 to-orange-50 border-t-4 border-t-amber-500 hover:shadow-xl transition-all duration-300 group cursor-default h-full">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                      {award.icon}
                    </div>
                    <h4 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                      {award.name}
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">{award.organization}</p>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">{award.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="amber" size="sm">{award.year}</Badge>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                        <Sparkles size={12} />
                        {contentLabels?.achievements?.badges?.award || 'Achievement'}
                      </span>
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Certifications */}
          <div>
            <ScrollReveal delay={0.05}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-linear-to-br from-blue-100 to-cyan-100 rounded-lg">
                  <Award className="text-blue-600" size={28} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900">
                  {contentLabels?.achievements?.sections?.certifications || 'Professional Certifications'}
                </h3>
                <Zap className="text-blue-500 animate-pulse" size={24} />
              </div>
            </ScrollReveal>

            <StaggerContainer className="grid md:grid-cols-2 gap-6">
              {achievementsData.certifications.map((cert, index) => (
                <StaggerItem key={index}>
                  <Card className="p-6 bg-linear-to-br from-blue-50 to-cyan-50 border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 group cursor-default">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-linear-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-3xl">{cert.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {cert.name}
                        </h4>
                        <p className="text-sm text-slate-600 mb-3">{cert.provider}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="blue" size="sm">{cert.year}</Badge>
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                          >
                            <Zap size={12} />
                            {contentLabels?.achievements?.badges?.certified || 'Verified'}
                          </a>
                        </div>
                      </div>
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
