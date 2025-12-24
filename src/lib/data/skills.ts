/**
 * Skills Data
 * Loaded from: https://static.kuhandranchatbot.info/data/skills.json
 * Falls back to local data if CDN is unavailable
 */

import React from 'react';import { getErrorMessageSync } from '@/lib/config/appConfig';
const CDN_URL = 'https://static.kuhandranchatbot.info/data/skills.json';

// Default/fallback data
const defaultSkillsData = {
  frontend: {
    name: 'Frontend Development',
    icon: '💻',
    skills: [
      { name: 'React.js', level: 95, color: 'blue' },
      { name: 'React Native', level: 90, color: 'blue' },
      { name: 'Next.js', level: 85, color: 'blue' },
      { name: 'Redux', level: 90, color: 'blue' },
      { name: 'Tailwind CSS', level: 90, color: 'blue' },
      { name: 'JavaScript/ES6+', level: 95, color: 'blue' },
      { name: 'TypeScript', level: 85, color: 'blue' },
      { name: 'HTML5/CSS3', level: 95, color: 'blue' }
    ]
  },
  backend: {
    name: 'Backend & APIs',
    icon: '⚙️',
    skills: [
      { name: 'RESTful API Design', level: 90, color: 'green' },
      { name: 'Spring Boot', level: 85, color: 'green' },
      { name: 'Spring Cloud', level: 80, color: 'green' },
      { name: 'Java Microservices', level: 85, color: 'green' },
      { name: 'API Integration', level: 90, color: 'green' },
      { name: 'Node.js', level: 75, color: 'green' }
    ]
  },
  data: {
    name: 'Data & Analytics',
    icon: '📊',
    skills: [
      { name: 'Microsoft Power BI', level: 90, color: 'amber' },
      { name: 'Data Visualization', level: 90, color: 'amber' },
      { name: 'Google Analytics', level: 85, color: 'amber' },
      { name: 'Business Analytics', level: 85, color: 'amber' },
      { name: 'SQL', level: 80, color: 'amber' }
    ]
  },
  cloud: {
    name: 'Cloud & DevOps',
    icon: '☁️',
    skills: [
      { name: 'AWS', level: 85, color: 'blue' },
      { name: 'Git/GitHub', level: 95, color: 'blue' },
      { name: 'Agile/Scrum', level: 90, color: 'blue' },
      { name: 'CI/CD', level: 80, color: 'blue' },
      { name: 'Docker', level: 75, color: 'blue' }
    ]
  }
};

export let skillsData = defaultSkillsData;

const fetchSkills = async () => {
  try {
    const response = await fetch(CDN_URL);
    if (!response.ok) {
      console.warn(getErrorMessageSync('warnings.skillsData'));
      return defaultSkillsData;
    }
    return response.json();
  } catch (error) {
    console.error(getErrorMessageSync('data.skills'), error);
    return defaultSkillsData;
  }
};

export const useSkills = () => {
  const [skills, setSkills] = React.useState(skillsData);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchSkills()
      .then((data) => setSkills(data))
      .catch((err) => setError(err));
  }, []);

  return { skills, error };
};