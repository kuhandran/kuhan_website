import { useState, useEffect } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { StatCard } from '../elements/StatCard';
import { Button } from '../elements/Button';
import { ResumePDFViewer } from '../elements/ResumePDFViewer';
import { HighlightItem } from '../elements/HighlightItem';
import { SectionCard } from '../elements/SectionCard';
import { Users, Briefcase, TrendingUp } from 'lucide-react';
import { useContentLabels } from '../../lib/data/contentLabels';
import { API_ENDPOINTS, IMAGE_ASSETS } from '@/lib/config/domains';
import { getImage, getResume } from '@/lib/api/apiClient';

// Default fallback for About section - matches CDN data exactly
const DEFAULT_ABOUT_LABELS = {
  about: {
    subtitle: 'Who I Am',
    title: 'Bridging Technology & Business Strategy',
    description: 'Technical leader with a passion for building scalable solutions',
    image: {
      src: '/image/profile.png',
      alt: 'Kuhandran SamudraPandiyan'
    },
    stats: [
      { icon: 'Users', value: '8+', label: 'Years Experience' },
      { icon: 'Briefcase', value: '2', label: 'Countries' },
      { icon: 'TrendingUp', value: '15%', label: 'Efficiency Gains' }
    ],
    paragraphs: {
      current_role: 'Currently serving as a Technical Project Manager at FWD Insurance, I lead cross-border delivery teams and drive continuous improvement initiatives that have reduced aging incident tickets by 15%. My role combines technical architecture, system analysis, and strategic project management.',
      previous_experience: 'With over 6 years at Maybank, I progressed from Junior Developer to Senior Software Engineer, building React.js applications, implementing RESTful APIs, and optimizing user experiences that improved load speeds by 15%.',
      education: 'I hold an MBA in Business Analytics from Cardiff Metropolitan University, which allows me to bridge technical expertise with strategic business insights—a unique combination that drives innovation in enterprise environments.'
    },
    highlights: {
      heading: 'Key Highlights',
      items: [
        'Cross-border team management & Agile methodologies',
        'Full-stack development: React, React Native, Spring Boot',
        'Data visualization & analytics with Power BI',
        'AWS certified developer with cloud expertise',
        'Domain experience: Banking & Insurance sectors',
        'Sri Lankan with EP in Malaysia - Open to relocation'
      ]
    },
    cta: {
      resume: 'Download Resume',
      linkedin: 'View LinkedIn'
    }
  }
};

export const About = () => {
  const { contentLabels } = useContentLabels();
  const [isResumePDFOpen, setIsResumePDFOpen] = useState(false);
  const labels = contentLabels || DEFAULT_ABOUT_LABELS;
  
  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle={labels?.about?.subtitle || 'Learn More'}
          title={labels?.about?.title || 'About Me'}
          description={labels?.about?.description || ''}
        />
        
        <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column - Image & Stats */}
          <div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl transform rotate-3"></div>
              
              {(() => {
                // Images are loaded from external static web service using utility function
                const imageSrc = getImage(IMAGE_ASSETS.profile.webp);
                const webpSrc = getImage(IMAGE_ASSETS.profile.webp);

                return (
                  <picture>
                    <source srcSet={webpSrc} type="image/webp" />
                    <img
                      src={imageSrc}
                      alt={labels?.about?.image?.alt || 'About'}
                      className="relative rounded-2xl shadow-xl w-full"
                    />
                  </picture>
                );
              })()}
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {(labels?.about?.stats || [])?.map((stat: { icon?: string; value?: string; label?: string }, index: number) => {
                const IconComponent = { Users, Briefcase, TrendingUp }[stat?.icon as string] || Users;
                return (
                  <StatCard
                    key={index}
                    icon={<IconComponent />}
                    value={stat?.value || ''}
                    label={stat?.label || ''}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Right Column - Content */}
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
            
            {/* Key Highlights */}
            <SectionCard title={labels?.about?.highlights?.heading || 'Key Highlights'}>
              <ul className="space-y-3">
                {(labels?.about?.highlights?.items || [])?.map((highlight: string, index: number) => (
                  <HighlightItem key={index} variant="emerald">
                    {highlight}
                  </HighlightItem>
                ))}
              </ul>
            </SectionCard>
            
            {/* CTA */}
            <div className="flex gap-4">
              <Button variant="primary" onClick={() => setIsResumePDFOpen(true)}>
                {labels?.about?.cta?.resume || 'Download Resume'}
              </Button>
              <a href="https://www.linkedin.com/in/kuhandran-samudrapandiyan/" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary">{labels?.about?.cta?.linkedin || 'Connect on LinkedIn'}</Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      <ResumePDFViewer
        isOpen={isResumePDFOpen}
        onClose={() => setIsResumePDFOpen(false)}
        resumeUrl={getResume('resume.pdf')}
      />
    </section>
  );
};