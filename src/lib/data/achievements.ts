/**
 * Achievements Data
 * Loaded from: /data/achievements.json (dev) or https://static.kuhandranchatbot.info/data/achievements.json (prod)
 */

import { getDataSourceUrl } from '@/lib/config/loaders';

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

const DATA_URL = getDataSourceUrl('achievements.json');

const EMPTY_ACHIEVEMENTS: AchievementsData = {
  awards: [],
  certifications: []
};

let cachedData: AchievementsData | null = null;

export async function fetchAchievementsData(): Promise<AchievementsData> {
  if (cachedData) return cachedData;
  
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) return EMPTY_ACHIEVEMENTS;
    const result = await response.json();
    cachedData = result;
    return result;
  } catch (error) {
    return EMPTY_ACHIEVEMENTS;
  }
}

export const achievementsData: AchievementsData = EMPTY_ACHIEVEMENTS;