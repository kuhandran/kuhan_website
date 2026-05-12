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

// Default/fallback achievements data
const DEFAULT_ACHIEVEMENTS: AchievementsData = {
  awards: [
    {
      name: 'Developer of the Year',
      organization: 'Tech Innovation Awards 2023',
      year: '2023',
      icon: '🏆',
      description: 'Recognized for outstanding contributions to full-stack development and innovative solutions'
    },
    {
      name: 'Best Technical Implementation',
      organization: 'Architecture Excellence Program',
      year: '2024',
      icon: '🎯',
      description: 'Award for best system design and technical implementation in enterprise solutions'
    },
    {
      name: 'Community Leadership Award',
      organization: 'Open Source Community',
      year: '2024',
      icon: '⭐',
      description: 'Recognition for leading and mentoring developers in the open source community'
    }
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect',
      provider: 'Amazon Web Services',
      year: '2024',
      icon: '☁️',
      credentialUrl: 'https://aws.amazon.com/certification/'
    },
    {
      name: 'Google Cloud Professional Data Engineer',
      provider: 'Google Cloud',
      year: '2023',
      icon: '📊',
      credentialUrl: 'https://cloud.google.com/certification'
    },
    {
      name: 'Oracle Certified Associate Java Programmer',
      provider: 'Oracle University',
      year: '2023',
      icon: '☕',
      credentialUrl: 'https://www.oracle.com/certification/'
    }
  ]
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
    if (!response.ok) return DEFAULT_ACHIEVEMENTS;
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
      return DEFAULT_ACHIEVEMENTS;
    }
    
    const resultObj = result as Record<string, unknown>;
    const awards = Array.isArray(resultObj.awards) ? (resultObj.awards as Award[]) : [];
    const certifications = Array.isArray(resultObj.certifications) ? (resultObj.certifications as Certification[]) : [];
    
    // Use default data if API returns empty
    const validatedResult: AchievementsData = {
      awards: awards.length > 0 ? awards : DEFAULT_ACHIEVEMENTS.awards,
      certifications: certifications.length > 0 ? certifications : DEFAULT_ACHIEVEMENTS.certifications
    };
    
    cachedData.set(language, validatedResult);
    return validatedResult;
  } catch (error) {
    console.error('[Achievements] Failed to fetch:', error);
    return DEFAULT_ACHIEVEMENTS;
  }
}