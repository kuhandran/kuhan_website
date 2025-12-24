/**
 * Experience Data
 * Loaded from: https://static.kuhandranchatbot.info/data/experience.json
 * Falls back to local data if CDN is unavailable
 */

import React from 'react';import { getErrorMessageSync } from '@/lib/config/appConfig';
const CDN_URL = 'https://static.kuhandranchatbot.info/data/experience.json';

// Default/fallback data
const defaultExperienceData = [
  {
    title: 'Technical Project Manager',
    company: 'FWD Insurance',
    duration: 'August 2023 - Present',
    location: 'Kuala Lumpur, Malaysia',
    description: [
      'Leading cross-border delivery teams, ensuring alignment across regional operations',
      'Drove continuous improvement initiatives, reducing aging incident tickets by 15%',
      'Managing React Native application development for DMS, OWB, and UnderWrite Me modules',
      'Applied agile methodologies to optimize workflows and adapt to project demands'
    ],
    techStack: ['React Native', 'Agile', 'Project Management', 'Cross-functional Teams'],
    logo: 'https://static.kuhandranchatbot.info/image/fwd-logo.png'
  },
  {
    title: 'Senior Software Engineer',
    company: 'Maybank',
    duration: 'August 2021 - August 2023',
    location: 'Kuala Lumpur, Malaysia',
    description: [
      'Developed and maintained React.js applications, ensuring alignment with business requirements',
      'Utilized React Hooks to create dynamic forms, achieving cost reduction in development',
      'Managed codebase, approved merges, and allocated tasks to enhance team efficiency',
      'Designed and implemented RESTful APIs, improving application functionalities'
    ],
    techStack: ['React.js', 'Redux', 'RESTful APIs', 'React Hooks', 'Git'],
    logo: 'https://static.kuhandranchatbot.info/image/maybank-logo.webp'
  },
  {
    title: 'Software Engineer',
    company: 'Maybank',
    duration: 'November 2020 - August 2021',
    location: 'Kuala Lumpur, Malaysia',
    description: [
      'Developed React, Redux, Router, and Axios components to enhance UI/UX',
      'Improved user experience and load speed by 15%',
      'Implemented single-page application architectures for scalability',
      'Collaborated remotely using Agile methodologies with global teams'
    ],
    techStack: ['React', 'Redux', 'Axios', 'SPA Architecture', 'Agile'],
    logo: 'https://static.kuhandranchatbot.info/image/maybank-logo.webp'
  },
  {
    title: 'UI/UX Developer',
    company: 'Maybank',
    duration: 'January 2019 - November 2020',
    location: 'Kuala Lumpur, Malaysia',
    description: [
      'Developed and upgraded UI/UX using React, Redux, and router libraries',
      'Created reusable components and data schemas to streamline development',
      'Improved application performance by designing common interface solutions',
      'Enhanced project modularity through component-based architecture'
    ],
    techStack: ['React', 'Redux', 'UI/UX Design', 'Component Architecture'],
    logo: 'https://static.kuhandranchatbot.info/image/maybank-logo.webp'
  },
  {
    title: 'Junior Developer',
    company: 'Maybank',
    duration: 'January 2018 - January 2019',
    location: 'Kuala Lumpur, Malaysia',
    description: [
      'Collaborated within SDLC to enhance product quality',
      'Participated in code reviews, improving programming techniques',
      'Addressed cybersecurity vulnerabilities ensuring Bank Negara compliance',
      'Supported API integration for insurance renewal and purchases'
    ],
    techStack: ['Java', 'API Integration', 'Security', 'SDLC'],
    logo: 'https://static.kuhandranchatbot.info/image/maybank-logo.webp'
  }
];

export let experienceData: any[] = defaultExperienceData;

const fetchExperience = async () => {
  try {
    const response = await fetch(CDN_URL);
    if (!response.ok) {
      console.warn(getErrorMessageSync('warnings.experienceData'));
      return defaultExperienceData;
    }
    return response.json();
  } catch (error) {
    console.error(getErrorMessageSync('data.experience'), error);
    return defaultExperienceData;
  }
};

export const useExperience = () => {
  const [experience, setExperience] = React.useState(experienceData);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchExperience()
      .then((data) => setExperience(data))
      .catch((err) => setError(err));
  }, []);

  return { experience, error };
};