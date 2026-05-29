'use client';
import { useState } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { StatCard } from '../elements/StatCard';
import { Button } from '../elements/Button';
import { ResumePDFViewer } from '../elements/ResumePDFViewer';
import { HighlightItem } from '../elements/HighlightItem';
import { SectionCard } from '../elements/SectionCard';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../elements/ScrollReveal';
import { Users, Briefcase, TrendingUp, GitBranch } from 'lucide-react';
import { useContentLabels } from '../../lib/data/contentLabels';
import { IMAGE_ASSETS, GITHUB_USERNAME } from '@/lib/config/domains';
import { getImage, getResume } from '@/lib/api/apiClient';
import { useGitHubActivity } from '@/lib/hooks/useGitHubActivity';
import { useSectionDwell } from '@/lib/hooks/useSectionDwell';

const DEFAULT_ABOUT_LABELS = {
  about: {
    subtitle: 'Who I Am',
    title: 'Bridging Technology & Business Strategy',
    description: 'Technical leader with a passion for building scalable solutions',
    image: { src: '/image/profile.png', alt: 'Kuhandran SamudraPandiyan' },
    stats: [
      { icon: 'Users', value: '8+', label: 'Years Experience' },
      { icon: 'Briefcase', value: '2', label: 'Countries' },
      { icon: 'TrendingUp', value: '15%', label: 'Efficiency Gains' },
    ],
    paragraphs: {
      current_role:
        'Currently serving as a Technical Project Manager at FWD Insurance, I lead cross-border delivery teams and drive continuous improvement initiatives that have reduced aging incident tickets by 15%. My role combines technical architecture, system analysis, and strategic project management.',
      previous_experience:
        'With over 6 years at Maybank, I progressed from Junior Developer to Senior Software Engineer, building React.js applications, implementing RESTful APIs, and optimizing user experiences that improved load speeds by 15%.',
      education:
        'I hold an MBA in Business Analytics from Cardiff Metropolitan University, which allows me to bridge technical expertise with strategic business insights—a unique combination that drives innovation in enterprise environments.',
    },
    highlights: {
      heading: 'Key Highlights',
      items: [
        'Cross-border team management & Agile methodologies',
        'Full-stack development: React, React Native, Spring Boot',
        'Data visualization & analytics with Power BI',
        'AWS certified developer with cloud expertise',
        'Domain experience: Banking & Insurance sectors',
        'Sri Lankan with EP in Malaysia - Open to relocation',
      ],
    },
    cta: { resume: 'Download Resume', linkedin: 'View LinkedIn' },
  },
};

export const About = () => {
  const { contentLabels } = useContentLabels();
  const [isResumePDFOpen, setIsResumePDFOpen] = useState(false);
  const labels = contentLabels || DEFAULT_ABOUT_LABELS;
  const { stats: gh } = useGitHubActivity(GITHUB_USERNAME);
  useSectionDwell('about');

  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <SectionHeader
            subtitle={labels?.about?.subtitle || 'Learn More'}
            title={labels?.about?.title || 'About Me'}
            description={labels?.about?.description || ''}
          />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Left — image + stats */}
          <ScrollReveal direction="left" delay={0.1}>
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl transform rotate-3" />
              <picture>
                <source srcSet={getImage(IMAGE_ASSETS.profile.webp)} type="image/webp" />
                <img
                  src={getImage(IMAGE_ASSETS.profile.webp)}
                  alt={labels?.about?.image?.alt || 'About'}
                  className="relative rounded-2xl shadow-xl w-full"
                />
              </picture>
            </div>

            <StaggerContainer className="grid grid-cols-3 gap-4 mt-8">
              {(labels?.about?.stats || [])?.map(
                (stat: { icon?: string; value?: string; label?: string }, index: number) => {
                  const IconComponent =
                    { Users, Briefcase, TrendingUp }[stat?.icon as string] || Users;
                  return (
                    <StaggerItem key={index}>
                      <StatCard
                        icon={<IconComponent />}
                        value={stat?.value || ''}
                        label={stat?.label || ''}
                      />
                    </StaggerItem>
                  );
                }
              )}
            </StaggerContainer>
          </ScrollReveal>

          {/* Right — content */}
          <ScrollReveal direction="right" delay={0.2}>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  {labels?.about?.paragraphs?.current_role || ''}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {labels?.about?.paragraphs?.previous_experience || ''}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {labels?.about?.paragraphs?.education || ''}
                </p>
              </div>

              <SectionCard title={labels?.about?.highlights?.heading || 'Key Highlights'}>
                <StaggerContainer>
                  <ul className="space-y-3">
                    {(labels?.about?.highlights?.items || [])?.map(
                      (highlight: string, index: number) => (
                        <StaggerItem key={index}>
                          <HighlightItem variant="emerald">{highlight}</HighlightItem>
                        </StaggerItem>
                      )
                    )}
                  </ul>
                </StaggerContainer>
              </SectionCard>

              {/* GitHub activity badge — only renders when API returns data */}
              {gh && gh.commits > 0 && (
                <a
                  href={`https://github.com/${GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 transition-colors w-fit"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <GitBranch size={13} className="text-slate-400" />
                  <span className="text-xs font-medium text-slate-300">
                    {gh.commits} commit{gh.commits !== 1 ? 's' : ''} in the last 30 days
                  </span>
                  {gh.daysAgo !== null && gh.daysAgo <= 7 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                      Active
                    </span>
                  )}
                </a>
              )}

              <div className="flex gap-4">
                <Button variant="primary" onClick={() => setIsResumePDFOpen(true)}>
                  {labels?.about?.cta?.resume || 'Download Resume'}
                </Button>
                <a
                  href="https://www.linkedin.com/in/kuhandran-samudrapandiyan/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary">
                    {labels?.about?.cta?.linkedin || 'Connect on LinkedIn'}
                  </Button>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <ResumePDFViewer
        isOpen={isResumePDFOpen}
        onClose={() => setIsResumePDFOpen(false)}
        resumeUrl={getResume('resume.pdf')}
      />
    </section>
  );
};
