import { useEffect, useState } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { Card } from '../elements/Card';
import { Badge } from '../elements/Badge';
import { Trophy, Award, Sparkles, Zap } from 'lucide-react';
import { getStaticContentLabels } from '../../lib/data/contentLabels';
import { getErrorMessageSync } from '@/lib/config/loaders';
import { fetchAchievementsData } from '@/lib/data/achievements';

interface AchievementsData {
  awards: Array<{
    name: string;
    organization: string;
    year: string;
    icon: string;
    description: string;
  }>;
  certifications: Array<{
    name: string;
    provider: string;
    year: string;
    icon: string;
    credentialUrl: string;
  }>;
}

export const Achievements = () => {
  const [contentLabels, setContentLabels] = useState(getStaticContentLabels());
  const [achievementsData, setAchievementsData] = useState<AchievementsData>({ awards: [], certifications: [] });

  useEffect(() => {
    // Load content labels
    const labels = getStaticContentLabels();
    if (labels && Object.keys(labels).length > 0) {
      setContentLabels(labels);
    }

    // Fetch achievements data from data loader (local first, then CDN)
    fetchAchievementsData().then(setAchievementsData);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle={contentLabels?.achievements?.subtitle || ''}
          title={contentLabels?.achievements?.title || 'Achievements'}
          description={contentLabels?.achievements?.description || ''}
        />
        
        <div className="max-w-6xl mx-auto mt-12">
          {/* Awards Section - Enhanced */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
                <Trophy className="text-amber-600" size={28} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">
                {contentLabels?.achievements?.sections?.awards}
              </h3>
              <Sparkles className="text-amber-500 animate-pulse" size={24} />
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {(achievementsData as any)?.awards && Array.isArray((achievementsData as any)?.awards) ? (achievementsData as any)?.awards?.map((award: any, index: number) => (
                <Card 
                  key={index}
                  className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-t-4 border-t-amber-500 hover:shadow-xl transition-all duration-300 group cursor-default"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{award?.icon || contentLabels?.achievements?.fallbacks?.awardIcon}</div>
                  <h4 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {award?.name || contentLabels?.achievements?.fallbacks?.awardName}
                  </h4>
                  <p className="text-sm text-slate-600 mb-3">{award?.organization || ''}</p>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">{award?.description || ''}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="amber" size="sm">{award?.year || ''}</Badge>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                      <Sparkles size={12} />
                      {contentLabels?.achievements?.badges?.award}
                    </span>
                  </div>
                </Card>
              )) : null}
            </div>
          </div>
          
          {/* Certifications Section - Enhanced */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                <Award className="text-blue-600" size={28} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">
                {contentLabels?.achievements?.sections?.certifications}
              </h3>
              <Zap className="text-blue-500 animate-pulse" size={24} />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {(achievementsData as any)?.certifications?.map((cert: any, index: number) => (
                <Card 
                  key={index}
                  className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 group cursor-default"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-3xl">{cert.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {cert.name}
                      </h4>
                      <p className="text-sm text-slate-600 mb-3">{cert.provider}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="blue" size="sm">{cert.year}</Badge>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          <Zap size={12} />
                          {contentLabels?.achievements?.badges?.certified}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};