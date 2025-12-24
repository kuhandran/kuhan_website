import { useEffect, useState } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { StatCard } from '../elements/StatCard';
import { Button } from '../elements/Button';
import { Users, Briefcase, TrendingUp } from 'lucide-react';
import { getStaticContentLabels } from '../../lib/data/contentLabels';

export const About = () => {
  const [contentLabels, setContentLabels] = useState(getStaticContentLabels());

  useEffect(() => {
    const labels = getStaticContentLabels();
    if (labels && Object.keys(labels).length > 0) {
      setContentLabels(labels);
    }
  }, []);
  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle={contentLabels.about.subtitle}
          title={contentLabels.about.title}
          description={contentLabels.about.description}
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
              {(contentLabels as any)?.about?.stats?.map((stat: any, index: number) => {
                const IconComponent = { Users, Briefcase, TrendingUp }[stat.icon as string] || Users;
                return (
                  <StatCard
                    key={index}
                    icon={<IconComponent />}
                    value={stat.value}
                    label={stat.label}
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
              <h3 className="text-lg font-bold text-slate-900 mb-4">{(contentLabels as any)?.about?.highlights?.heading}</h3>
              <ul className="space-y-3">
                {(contentLabels as any)?.about?.highlights?.items?.map((highlight: any, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-slate-600">
                    <span className="text-emerald-500 mt-1">✓</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* CTA */}
            <div className="flex gap-4">
              <Button variant="primary">{contentLabels.about.cta.resume}</Button>
              <Button variant="secondary">{contentLabels.about.cta.linkedin}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};