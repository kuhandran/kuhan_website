/**
 * Education Data
 * Loaded from: https://static.kuhandranchatbot.info/data/education.json
 * Falls back to local data if CDN is unavailable
 */

import React from 'react';import { getErrorMessageSync } from '@/lib/config/appConfig';
const CDN_URL = 'https://static.kuhandranchatbot.info/data/education.json';

// Default/fallback data
const defaultEducationData = [
  {
    degree: 'Master of Business Administration (MBA)',
    institution: 'Cardiff Metropolitan University',
    duration: 'April 2022 - August 2024',
    location: 'United Kingdom (Remote)',
    focus: 'Business Analytics - Bridging technical expertise with strategic business insights'
  },
  {
    degree: 'Bachelor of Science (BSc)',
    institution: 'University of Wollongong',
    duration: '2014 - 2016',
    location: 'Malaysia',
    focus: 'Computer Software Engineering & Digital Systems Security'
  },
  {
    degree: 'Foundation in Information Technology',
    institution: 'INTI College Subang Jaya',
    duration: '2013 - 2014',
    location: 'Malaysia',
    focus: 'Core IT fundamentals and programming principles'
  },
  {
    degree: 'GCE Cambridge Advanced Level',
    institution: 'Wycherley International School',
    duration: '2009 - 2011',
    location: 'Sri Lanka',
    focus: 'A-Level education preparing for university studies'
  }
];

export let educationData: any[] = defaultEducationData;

const fetchEducation = async () => {
  try {
    const response = await fetch(CDN_URL);
    if (!response.ok) {
      console.warn(getErrorMessageSync('warnings.educationData'));
      return defaultEducationData;
    }
    return response.json();
  } catch (error) {
    console.error(getErrorMessageSync('data.education'), error);
    return defaultEducationData;
  }
};

export const useEducation = () => {
  const [education, setEducation] = React.useState(educationData);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchEducation()
      .then((data) => setEducation(data))
      .catch((err) => setError(err));
  }, []);

  return { education, error };
};