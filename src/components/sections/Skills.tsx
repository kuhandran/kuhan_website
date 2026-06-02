'use client';
import { useState } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { Card } from '../elements/Card';
import { SkillBar } from '../elements/SkillBar';
import { SkillTagCloud } from '../elements/SkillTagCloud';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../elements/ScrollReveal';
import { useSkills } from '../../lib/data/skills';
import { useContentLabels } from '../../lib/data/contentLabels';
import { useSectionDwell } from '@/lib/hooks/useSectionDwell';
import { trackSkillView } from '@/lib/analytics/ga4';
import { useJDMatch } from '@/lib/context/JDMatchContext';

type SkillEntry = { name: string; level: number; color: string };
type SkillsData = Record<string, { name: string; icon: string; skills: SkillEntry[] }>;

export const Skills = () => {
  const { skills: skillsData, loading } = useSkills();
  const { contentLabels } = useContentLabels();
  const [activeTab, setActiveTab] = useState('frontend');
  const [view, setView] = useState<'list' | '3d'>('list');
  const { result: jdMatch } = useJDMatch();
  useSectionDwell('skills');

  const typedSkillsData = skillsData as SkillsData;
  const tabs = Object.entries(typedSkillsData);

  // Flatten all skills across all categories for the sphere
  const allSkills: SkillEntry[] = Object.values(typedSkillsData).flatMap(
    (cat) => (Array.isArray(cat.skills) ? cat.skills : [])
  );

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            subtitle={contentLabels?.skills?.subtitle || ''}
            title={contentLabels?.skills?.title || 'Skills'}
            description={contentLabels?.skills?.description || ''}
          />
          <div className="text-center text-gray-500">Loading skills...</div>
        </div>
      </section>
    );
  }

  const activeSkills = typedSkillsData[activeTab]?.skills ?? [];
  const avgProficiency =
    activeSkills.length > 0
      ? Math.round(activeSkills.reduce((s, sk) => s + sk.level, 0) / activeSkills.length)
      : 0;

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <SectionHeader
            subtitle={contentLabels?.skills?.subtitle || ''}
            title={contentLabels?.skills?.title || 'Skills'}
            description={contentLabels?.skills?.description || ''}
          />
        </ScrollReveal>

        {/* View toggle */}
        <ScrollReveal delay={0.1}>
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => { setView('list'); trackSkillView(activeTab, 'list'); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                view === 'list'
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ☰ List View
            </button>
            <button
              onClick={() => { setView('3d'); trackSkillView(activeTab, '3d'); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                view === '3d'
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ◉ 3D Sphere
            </button>
          </div>
        </ScrollReveal>

        {view === '3d' ? (
          /* ── 3D sphere view ── */
          <ScrollReveal delay={0.15}>
            <div className="max-w-4xl mx-auto">
              <SkillTagCloud skills={allSkills} />
              <p className="text-center text-xs text-slate-400 mt-3">
                {allSkills.length} skills · rotate to explore · size = proficiency
              </p>
            </div>
          </ScrollReveal>
        ) : (
          /* ── List view ── */
          <>
            {/* Tab navigation */}
            <ScrollReveal delay={0.15}>
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {tabs.map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
                      activeTab === key
                        ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-xl scale-105 hover:shadow-2xl'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md'
                    }`}
                  >
                    <span className="mr-2 text-lg">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Skills grid */}
            <div className="max-w-4xl mx-auto">
              <ScrollReveal key={activeTab}>
                <Card className="p-8 md:p-12 bg-linear-to-br from-slate-50 to-white">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-5xl">{typedSkillsData[activeTab]?.icon || ''}</span>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
                      {typedSkillsData[activeTab]?.name || ''}
                    </h3>
                    <div className="ml-auto text-right">
                      <div className="text-2xl font-bold text-blue-600">{avgProficiency}%</div>
                      <div className="text-xs text-slate-500 font-medium">Avg. Proficiency</div>
                    </div>
                  </div>

                  <StaggerContainer className="grid md:grid-cols-2 gap-x-8 gap-y-1 mt-8">
                    {activeSkills.map((skill, index) => {
                      const isRequired = jdMatch?.matchedSkills.some(
                        m => m.toLowerCase() === skill.name.toLowerCase()
                      );
                      return (
                        <StaggerItem key={index}>
                          <div className="relative">
                            {isRequired && (
                              <span className="absolute -top-1 right-0 text-[9px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded-full z-10">
                                Required
                              </span>
                            )}
                            <SkillBar
                              skillName={skill.name}
                              level={skill.level}
                              color={skill.color}
                            />
                          </div>
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                </Card>
              </ScrollReveal>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
