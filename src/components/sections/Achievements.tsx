import { SectionHeader } from '../elements/SectionHeader';
import { Card } from '../elements/Card';
import { Badge } from '../elements/Badge';
import { achievementsData } from '../../lib/data/achievements';
import { Trophy, Award } from 'lucide-react';

export const Achievements = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle="Recognition"
          title="Achievements & Certifications"
          description="Awards and professional certifications"
        />
        
        <div className="max-w-6xl mx-auto">
          {/* Awards */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Trophy className="text-amber-500" />
              Awards & Honors
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {achievementsData.awards.map((award, index) => (
                <Card key={index}>
                  <div className="text-4xl mb-4">{award.icon}</div>
                  <h4 className="font-bold text-slate-900 mb-2">{award.name}</h4>
                  <p className="text-sm text-slate-600 mb-2">{award.organization}</p>
                  <Badge variant="amber" size="sm">{award.year}</Badge>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Certifications */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Award className="text-blue-500" />
              Professional Certifications
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {achievementsData.certifications.map((cert, index) => (
                <Card key={index} className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{cert.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 mb-1">{cert.name}</h4>
                    <p className="text-sm text-slate-600 mb-2">{cert.provider}</p>
                    <Badge variant="blue" size="sm">{cert.year}</Badge>
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