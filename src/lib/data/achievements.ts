/**
 * Achievements Data
 * Loaded from: /data/achievements.json (dev) or https://static-api-opal.vercel.app/collections/{language}/data/achievements.json (prod)
 */

import { getDataSourceUrl } from '@/lib/config/loaders';
import { DEFAULT_LANGUAGE } from '@/lib/config/domains';

interface Award {
  name: string;
  organization: string;
  year: string;
  icon: string;
  description: string;
}

interface Certification {
  name: string;
  provider: string;
  year: string;
  icon: string;
  credentialUrl: string;
}

interface AchievementsData {
  awards: Award[];
  certifications: Certification[];
}

const EMPTY_ACHIEVEMENTS: AchievementsData = {
  awards: [],
  certifications: []
};

const cachedData: Map<string, AchievementsData> = new Map();

export async function fetchAchievementsData(language: string = DEFAULT_LANGUAGE): Promise<AchievementsData> {
  // Check cache for this language
  if (cachedData.has(language)) {
    return cachedData.get(language)!;
  }
  
  try {
    const DATA_URL = getDataSourceUrl('achievements.json', language);
    const response = await fetch(DATA_URL);
    if (!response.ok) return EMPTY_ACHIEVEMENTS;
    const result = await response.json();
    cachedData.set(language, result);
    return result;
  } catch (error) {
    return EMPTY_ACHIEVEMENTS;
  }
}