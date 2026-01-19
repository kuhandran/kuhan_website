/**
 * Achievements Data
 * Loaded from: /data/achievements.json (dev) or https://static.kuhandranchatbot.info/api/collections/{language}/data/achievements (prod)
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
    const DATA_URL = getDataSourceUrl('achievements', language);
    const response = await fetch(DATA_URL);
    if (!response.ok) return EMPTY_ACHIEVEMENTS;
    const responseData = await response.json();
    
    // Extract data from various response formats:
    // - { content: { awards: [], certifications: [] } } (API wrapper)
    // - { data: { awards: [], certifications: [] } } (alternative wrapper)
    // - { awards: [], certifications: [] } (direct data)
    let result = responseData.content || responseData.data || responseData;
    
    // Ensure we have the right structure
    if (result && typeof result === 'object' && !Array.isArray(result)) {
      // If result is wrapped with metadata, try to extract the actual data
      if ('awards' in result || 'certifications' in result) {
        // Already has the right structure
      } else if ('data' in result) {
        result = result.data;
      } else if ('content' in result) {
        result = result.content;
      }
    }
    
    // Validate structure
    if (!result || typeof result !== 'object' || Array.isArray(result)) {
      console.warn('[Achievements] Invalid response structure:', result);
      return EMPTY_ACHIEVEMENTS;
    }
    
    const resultObj = result as Record<string, unknown>;
    const validatedResult: AchievementsData = {
      awards: Array.isArray(resultObj.awards) ? (resultObj.awards as Award[]) : [],
      certifications: Array.isArray(resultObj.certifications) ? (resultObj.certifications as Certification[]) : []
    };
    
    cachedData.set(language, validatedResult);
    return validatedResult;
  } catch (error) {
    console.error('[Achievements] Failed to fetch:', error);
    return EMPTY_ACHIEVEMENTS;
  }
}