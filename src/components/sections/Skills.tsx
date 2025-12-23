'use client';
import { useState } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { Card } from '../elements/Card';
import { SkillBar } from '../elements/SkillBar';
import { skillsData } from '../../lib/data/skills';
import contentLabels from '../../../public/data/contentLabels.json';

type SkillsData = Record<string, { name: string; icon: string; skills: Array<{ name: string; level: number; color: string }> }>;

export const Skills = () => {
  const [activeTab, setActiveTab] = useState('frontend');
  const typedSkillsData = skillsData as SkillsData;
  
  const tabs = Object.entries(typedSkillsData);
  
  return (
    <section id="skills" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle={contentLabels.skills.subtitle}
          title={contentLabels.skills.title}
          description={contentLabels.skills.description}
        />
        
        {/* Tab Navigation - Enhanced */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
                activeTab === key
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl scale-105 hover:shadow-2xl'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md'
              }`}
            >
              <span className="mr-2 text-lg">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Skills Grid - Enhanced */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-slate-50 to-white">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-5xl">{typedSkillsData[activeTab].icon}</span>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
                {typedSkillsData[activeTab].name}
              </h3>
              <div className="ml-auto">
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(
                      typedSkillsData[activeTab].skills.reduce((sum, skill) => sum + skill.level, 0) / 
                      typedSkillsData[activeTab].skills.length
                    )}%
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Avg. Proficiency</div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-1 mt-8">
              {typedSkillsData[activeTab].skills.map((skill, index) => (
                <SkillBar
                  key={index}
                  skillName={skill.name}
                  level={skill.level}
                  color={skill.color}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};