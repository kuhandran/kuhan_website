import { SectionHeader } from '../elements/SectionHeader';
import { StatCard } from '../elements/StatCard';
import { Button } from '../elements/Button';
import { Users, Briefcase, TrendingUp } from 'lucide-react';

export const About = () => {
  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle="About Me"
          title="Bridging Technology & Business Strategy"
          description="Technical leader with a passion for building scalable solutions"
        />
        
        <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column - Image & Stats */}
          <div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl transform rotate-3"></div>
              <img
                src="/api/placeholder/500/600"
                alt="Kuhandran SamudraPandiyan"
                className="relative rounded-2xl shadow-xl w-full"
              />
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <StatCard
                icon={<Users />}
                value="8+"
                label="Years Experience"
              />
              <StatCard
                icon={<Briefcase />}
                value="2"
                label="Countries"
              />
              <StatCard
                icon={<TrendingUp />}
                value="15%"
                label="Efficiency Gains"
              />
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed">
                Currently serving as a <strong className="text-slate-900">Technical Project Manager at FWD Insurance</strong>, 
                I lead cross-border delivery teams and drive continuous improvement initiatives that have reduced 
                aging incident tickets by 15%. My role combines technical architecture, system analysis, and 
                strategic project management.
              </p>
              
              <p className="text-slate-600 leading-relaxed">
                With over <strong className="text-slate-900">6 years at Maybank</strong>, I progressed from Junior Developer 
                to Senior Software Engineer, building React.js applications, implementing RESTful APIs, and 
                optimizing user experiences that improved load speeds by 15%.
              </p>
              
              <p className="text-slate-600 leading-relaxed">
                I hold an <strong className="text-slate-900">MBA in Business Analytics from Cardiff Metropolitan University</strong>, 
                which allows me to bridge technical expertise with strategic business insights—a unique combination 
                that drives innovation in enterprise environments.
              </p>
            </div>
            
            {/* Key Highlights */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Key Highlights</h3>
              <ul className="space-y-3">
                {[
                  'Cross-border team management & Agile methodologies',
                  'Full-stack development: React, React Native, Spring Boot',
                  'Data visualization & analytics with Power BI',
                  'AWS certified developer with cloud expertise',
                  'Domain experience: Banking & Insurance sectors',
                  'Sri Lankan with EP in Malaysia - Open to relocation'
                ].map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-600">
                    <span className="text-emerald-500 mt-1">✓</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* CTA */}
            <div className="flex gap-4">
              <Button variant="primary">Download Resume</Button>
              <Button variant="secondary">View LinkedIn</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};