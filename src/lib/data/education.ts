/**
 * Education Data
 * Loaded from: /data/education.json (dev) or https://static.kuhandranchatbot.info/data/education.json (prod)
 */

import React from 'react';
import { fetchEducation as fetchEducationAPI } from '@/lib/api/apiClient';
import { SupportedLanguage, DEFAULT_LANGUAGE } from '@/lib/config/domains';
import { useLanguage } from '@/lib/hooks/useLanguageHook';

interface EducationItem {
  degree: string;
  institution: string;
  duration: string;
  location: string;
  focus: string;
}

const EMPTY_EDUCATION: EducationItem[] = [];

export let educationData: EducationItem[] = EMPTY_EDUCATION;

export const useEducation = () => {
  const { language } = useLanguage();
  const [education, setEducation] = React.useState<EducationItem[]>(educationData);
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadEducation = async () => {
      setLoading(true);
      try {
        console.log(`[Education] Loading education for language: ${language}`);
        const data = await fetchEducationAPI(language as SupportedLanguage);
        setEducation(data || EMPTY_EDUCATION);
        educationData = data || EMPTY_EDUCATION;
        setError(null);
      } catch (err) {
        console.error(`[Education] Failed to load education for language ${language}:`, err);
        setError(err instanceof Error ? err : new Error('Failed to load education'));
        setEducation(EMPTY_EDUCATION);
      } finally {
        setLoading(false);
      }
    };

    loadEducation();
  }, [language]);

  return { education, error, loading };
};