/**
 * Experience Data
 * Loaded from: /data/experience.json (dev) or https://static.kuhandranchatbot.info/data/experience.json (prod)
 */

import React from 'react';
import { TimelineItemProps } from '@/lib/config/types';
import { fetchExperience as fetchExperienceAPI } from '@/lib/api/apiClient';
import { SupportedLanguage, DEFAULT_LANGUAGE } from '@/lib/config/domains';
import { useLanguage } from '@/lib/hooks/useLanguageHook';

const EMPTY_EXPERIENCE: TimelineItemProps[] = [];

export let experienceData: TimelineItemProps[] = EMPTY_EXPERIENCE;

export const useExperience = () => {
  const { language } = useLanguage();
  const [experience, setExperience] = React.useState<TimelineItemProps[]>(experienceData);
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadExperience = async () => {
      setLoading(true);
      try {
        console.log(`[Experience] Loading experience for language: ${language}`);
        const data = await fetchExperienceAPI(language as SupportedLanguage);
        const experienceItems = Array.isArray(data) ? (data as TimelineItemProps[]) : EMPTY_EXPERIENCE;
        setExperience(experienceItems);
        experienceData = experienceItems;
        setError(null);
      } catch (err) {
        console.error(`[Experience] Failed to load experience for language ${language}:`, err);
        setError(err instanceof Error ? err : new Error('Failed to load experience'));
        setExperience(EMPTY_EXPERIENCE);
      } finally {
        setLoading(false);
      }
    };

    loadExperience();
  }, [language]); // Re-fetch when language changes

  return { experience, error, loading };
};