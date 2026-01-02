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

export let skillsData: SkillsData = EMPTY_SKILLS;

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
        setSkills(data || EMPTY_SKILLS);
        skillsData = data || EMPTY_SKILLS;
        setError(null);
      } catch (err) {
        console.error(`[Skills] Failed to load skills for language ${language}:`, err);
        setError(err instanceof Error ? err : new Error('Failed to load skills'));
        setSkills(EMPTY_SKILLS);
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, [language]); // Re-fetch when language changes

  return { skills, error, loading };
};