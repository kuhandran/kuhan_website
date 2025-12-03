'use client';
import { useState } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { Card } from '../elements/Card';
import { SkillBar } from '../elements/SkillBar';
import { skillsData } from '../../lib/data/skills';

export const Skills = () => {
  const [activeTab, setActiveTab] = useState('frontend');
  
  const tabs = Object.entries(skillsData);
  
  return (
    <section id="skills" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle="Skills & Expertise"
          title="Technical Proficiency"
          description="Full-stack capabilities with expertise across modern technologies"
        />
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === key
                  ? 'bg-blue-500 text-white shadow-lg scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Skills Grid */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">{skillsData[activeTab].icon}</span>
              {skillsData[activeTab].name}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {skillsData[activeTab].skills.map((skill, index) => (
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