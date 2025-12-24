/**
 * Achievements Data
 * Loaded from: https://static.kuhandranchatbot.info/data/achievements.json
 * Falls back to local data if CDN is unavailable
 */

import { getErrorMessageSync } from '@/lib/config/appConfig';

const defaultAchievementsData = {
  awards: [
    {
      name: 'Award Winner',
      organization: 'Professional Organization',
      year: '2023',
      icon: '🏆',
      description: 'Recognized for outstanding contributions'
    }
  ],
  certifications: [
    {
      name: 'Certified Developer',
      issuer: 'Tech Institute',
      year: '2023',
      icon: '📜',
      description: 'Professional certification in modern technologies'
    }
  ]
};

let cachedData: any = null;

export async function fetchAchievementsData() {
  if (cachedData) return cachedData;
  
  try {
    const response = await fetch('https://static.kuhandranchatbot.info/data/achievements.json');
    if (!response.ok) throw new Error(getErrorMessageSync('data.httpError', `HTTP error! status: ${response.status}`));
    cachedData = await response.json();
    return cachedData;
  } catch (error) {
    console.error(getErrorMessageSync('data.achievements'), error);
    return defaultAchievementsData;
  }
}

export const achievementsData: any = defaultAchievementsData;