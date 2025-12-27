import { useState, useEffect } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { StatCard } from '../elements/StatCard';
import { Button } from '../elements/Button';
import { ResumePDFViewer } from '../elements/ResumePDFViewer';
import { Users, Briefcase, TrendingUp } from 'lucide-react';
import { getStaticContentLabels, initializeContentLabels } from '../../lib/data/contentLabels';

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
  const [contentLabels, setContentLabels] = useState(() => {
    const labels = getStaticContentLabels();
    return labels && Object.keys(labels).length > 0 ? labels : DEFAULT_ABOUT_LABELS;
  });
  const [isResumePDFOpen, setIsResumePDFOpen] = useState(false);

  useEffect(() => {
    const loadContentLabels = async () => {
      await initializeContentLabels();
      const updatedLabels = getStaticContentLabels();
      if (updatedLabels && Object.keys(updatedLabels).length > 0) {
        setContentLabels(updatedLabels);
      }
    };
    loadContentLabels();
  }, []);
  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle={contentLabels?.about?.subtitle || 'Learn More'}
          title={contentLabels?.about?.title || 'About Me'}
          description={contentLabels?.about?.description || ''}
        />
        
        <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column - Image & Stats */}
          <div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl transform rotate-3"></div>
              
              {(() => {
                // Images are loaded from external static web service
                const imageSrc = 'https://static.kuhandranchatbot.info/image/profile.webp';
                const webpSrc = 'https://static.kuhandranchatbot.info/image/profile.webp';

                return (
                  <picture>
                    <source srcSet={webpSrc} type="image/webp" />
                    <img
                      src={imageSrc}
                      alt={contentLabels?.about?.image?.alt || 'About'}
                      className="relative rounded-2xl shadow-xl w-full"
                    />
                  </picture>
                );
              })()}
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {(contentLabels?.about?.stats || [])?.map((stat: { icon?: string; value?: string; label?: string }, index: number) => {
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
                {contentLabels?.about?.paragraphs?.current_role || ''}
              </p>
              
              <p className="text-slate-600 leading-relaxed">
                {contentLabels?.about?.paragraphs?.previous_experience || ''}
              </p>
              
              <p className="text-slate-600 leading-relaxed">
                {contentLabels?.about?.paragraphs?.education || ''}
              </p>
            </div>
            
            {/* Key Highlights */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-slate-900 mb-4">{contentLabels?.about?.highlights?.heading || 'Key Highlights'}</h3>
              <ul className="space-y-3">
                {(contentLabels?.about?.highlights?.items || [])?.map((highlight: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-slate-600">
                    <span className="text-emerald-500 mt-1">✓</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* CTA */}
            <div className="flex gap-4">
              <Button variant="primary" onClick={() => setIsResumePDFOpen(true)}>
                {contentLabels?.about?.cta?.resume || 'Download Resume'}
              </Button>
              <Button variant="secondary">{contentLabels?.about?.cta?.linkedin || 'Connect on LinkedIn'}</Button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      <ResumePDFViewer
        isOpen={isResumePDFOpen}
        onClose={() => setIsResumePDFOpen(false)}
        resumeUrl="https://static.kuhandranchatbot.info/resume/resume.pdf"
      />
    </section>
  );
};