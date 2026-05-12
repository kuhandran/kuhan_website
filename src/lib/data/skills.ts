/**
 * Skills Data
 * Loaded from: /data/skills.json (dev) or https://static.kuhandranchatbot.info/data/skills.json (prod)
 */

import React from 'react';
import { fetchSkills as fetchSkillsAPI } from '@/lib/api/apiClient';
import { SupportedLanguage, DEFAULT_LANGUAGE } from '@/lib/config/domains';
import { useLanguage } from '@/lib/hooks/useLanguageHook';

interface SkillItem {
  name: string;
  level: number;
  color: string;
}

interface SkillCategory {
  name: string;
  icon: string;
  skills: SkillItem[];
}

type SkillsData = Record<string, SkillCategory>;

const EMPTY_SKILLS: SkillsData = {
  frontend: { name: '', icon: '', skills: [] },
  backend: { name: '', icon: '', skills: [] },
  data: { name: '', icon: '', skills: [] },
  cloud: { name: '', icon: '', skills: [] }
};

const DEFAULT_SKILLS: SkillsData = {
  frontend: {
    name: 'Frontend Development',
    icon: '🎨',
    skills: [
      { name: 'React / Next.js', level: 95, color: '#61DAFB' },
      { name: 'TypeScript', level: 90, color: '#3178C6' },
      { name: 'Tailwind CSS', level: 88, color: '#06B6D4' },
      { name: 'HTML / CSS', level: 92, color: '#E34C26' },
      { name: 'JavaScript', level: 93, color: '#F7DF1E' }
    ]
  },
  backend: {
    name: 'Backend Development',
    icon: '⚙️',
    skills: [
      { name: 'Node.js / Express', level: 87, color: '#339933' },
      { name: 'Python', level: 85, color: '#3776AB' },
      { name: 'Java', level: 80, color: '#007396' },
      { name: 'SQL / Databases', level: 88, color: '#336791' },
      { name: 'REST APIs', level: 92, color: '#009688' }
    ]
  },
  data: {
    name: 'Data & Analytics',
    icon: '📊',
    skills: [
      { name: 'Data Analysis', level: 85, color: '#FF6B6B' },
      { name: 'Visualization', level: 82, color: '#4ECDC4' },
      { name: 'SQL', level: 88, color: '#336791' },
      { name: 'Python (Data)', level: 85, color: '#3776AB' },
      { name: 'Power BI', level: 80, color: '#F2CC8F' }
    ]
  },
  cloud: {
    name: 'Cloud & DevOps',
    icon: '☁️',
    skills: [
      { name: 'AWS', level: 88, color: '#FF9900' },
      { name: 'Docker', level: 85, color: '#2496ED' },
      { name: 'Kubernetes', level: 80, color: '#326CE5' },
      { name: 'CI/CD Pipelines', level: 87, color: '#0052CC' },
      { name: 'Google Cloud', level: 82, color: '#4285F4' }
    ]
  }
};

export let skillsData: SkillsData = DEFAULT_SKILLS;

export const useSkills = () => {
  const { language } = useLanguage();
  const [skills, setSkills] = React.useState<SkillsData>(skillsData);
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadSkills = async () => {
      setLoading(true);
      try {
        console.log(`[Skills] Loading skills for language: ${language}`);
        const data = await fetchSkillsAPI(language as SupportedLanguage);
        setSkills((data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0) ? data : DEFAULT_SKILLS);
        skillsData = (data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0) ? data : DEFAULT_SKILLS;
        setError(null);
      } catch (err) {
        console.error(`[Skills] Failed to load skills for language ${language}:`, err);
        setError(err instanceof Error ? err : new Error('Failed to load skills'));
        setSkills(DEFAULT_SKILLS);
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, [language]); // Re-fetch when language changes

  return { skills, error, loading };
};