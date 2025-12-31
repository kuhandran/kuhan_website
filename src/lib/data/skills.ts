/**
 * Skills Data
 * Loaded from: /data/skills.json (dev) or https://static.kuhandranchatbot.info/data/skills.json (prod)
 */

import React from 'react';
import { getDataSourceUrl } from '@/lib/config/dataConfig';

const DATA_URL = getDataSourceUrl('skills.json');

interface SkillCategory {
  name: string;
  icon: string;
  skills: Array<{
    name: string;
    level: number;
    color: string;
  }>;
}

type SkillsData = Record<string, SkillCategory>;

const EMPTY_SKILLS: SkillsData = {
  frontend: { name: '', icon: '', skills: [] },
  backend: { name: '', icon: '', skills: [] },
  data: { name: '', icon: '', skills: [] },
  cloud: { name: '', icon: '', skills: [] }
};

const fetchSkills = async () => {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) return EMPTY_SKILLS;
    return await response.json();
  } catch (error) {
    return EMPTY_SKILLS;
  }
};

export let skillsData: SkillsData = EMPTY_SKILLS;

export const useSkills = () => {
  const [skills, setSkills] = React.useState(skillsData);
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetchSkills()
      .then((data) => {
        setSkills(data);
        skillsData = data;
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { skills, error, loading };
};