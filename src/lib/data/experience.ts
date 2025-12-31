/**
 * Experience Data
 * Loaded from: /data/experience.json (dev) or https://static.kuhandranchatbot.info/data/experience.json (prod)
 */

import React from 'react';
import { TimelineItemProps } from '@/lib/config/types';
import { getDataSourceUrl } from '@/lib/config/dataConfig';

const DATA_URL = getDataSourceUrl('experience.json');

const EMPTY_EXPERIENCE: TimelineItemProps[] = [];

const fetchExperience = async () => {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) return EMPTY_EXPERIENCE;
    return await response.json();
  } catch (error) {
    return EMPTY_EXPERIENCE;
  }
};

export let experienceData: TimelineItemProps[] = EMPTY_EXPERIENCE;

export const useExperience = () => {
  const [experience, setExperience] = React.useState(experienceData);
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetchExperience()
      .then((data) => {
        setExperience(data);
        experienceData = data;
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { experience, error, loading };
};