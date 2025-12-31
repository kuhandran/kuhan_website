/**
 * Education Data
 * Loaded from: /data/education.json (dev) or https://static.kuhandranchatbot.info/data/education.json (prod)
 */

import React from 'react';
import { getDataSourceUrl } from '@/lib/config/dataConfig';

interface EducationItem {
  degree: string;
  institution: string;
  duration: string;
  location: string;
  focus: string;
}

const DATA_URL = getDataSourceUrl('education.json');

const EMPTY_EDUCATION: EducationItem[] = [];

const fetchEducation = async () => {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) return EMPTY_EDUCATION;
    return await response.json();
  } catch (error) {
    return EMPTY_EDUCATION;
  }
};

export let educationData: EducationItem[] = EMPTY_EDUCATION;

export const useEducation = () => {
  const [education, setEducation] = React.useState(educationData);
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetchEducation()
      .then((data) => {
        setEducation(data);
        educationData = data;
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { education, error, loading };
};