/**
 * API Data Fetchers
 * Handles fetching: configuration, collection data, and manifest
 * Uses legacy cache for backwards compatibility
 */

import { 
  getConfigRouteUrl, 
  getManifestUrl, 
  getCollectionUrl,
  SupportedLanguage, 
  DEFAULT_LANGUAGE 
} from '@/lib/config/domains';
import {
  getFromCache,
  setInCache,
} from './cache-legacy';

// ============================================================================
// CONFIGURATION ENDPOINTS
// ============================================================================

/**
 * Fetch configuration file (apiConfig, pageLayout, urlConfig)
 * @param configType - Type of config (apiConfig, pageLayout, urlConfig)
 * @param language - Language code (defaults to DEFAULT_LANGUAGE)
 * @returns Configuration object
 */
export async function fetchConfig<T = any>(
  configType: 'apiConfig' | 'pageLayout' | 'urlConfig',
  language: SupportedLanguage = DEFAULT_LANGUAGE
): Promise<T> {
  const cacheKey = `config:${language}:${configType}`;
  
  // Check cache first
  const cached = getFromCache<T>(cacheKey);
  if (cached) return cached;

  try {
    const url = getConfigRouteUrl(language, configType);
    console.log(`[API] Fetching config: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'default',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();
    // Extract 'data' field if present (API response wrapper from static.kuhandranchatbot.info)
    const data = responseData.data || responseData;
    setInCache(cacheKey, data);
    return data as T;
  } catch (error) {
    console.error(`[API Error] Failed to fetch config (${language}/${configType}):`, error);
    return {} as T;
  }
}

/**
 * Fetch API configuration (contains API endpoints)
 */
export async function fetchApiConfig(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  return fetchConfig('apiConfig', language);
}

/**
 * Fetch page layout configuration
 */
export async function fetchPageLayout(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  return fetchConfig('pageLayout', language);
}

/**
 * Fetch URL configuration
 */
export async function fetchUrlConfig(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  return fetchConfig('urlConfig', language);
}

// ============================================================================
// COLLECTION DATA ENDPOINTS
// ============================================================================

/**
 * Fetch collection data (projects, experience, skills, etc.)
 * @param dataType - Type of data (projects, experience, skills, education, achievements, caseStudies, contentLabels)
 * @param language - Language code (defaults to DEFAULT_LANGUAGE)
 * @returns Collection data
 */
export async function fetchCollectionData<T = any>(
  dataType: string,
  language: SupportedLanguage = DEFAULT_LANGUAGE
): Promise<T> {
  const cacheKey = `collection:${language}:${dataType}`;
  
  // Check cache first
  const cached = getFromCache<T>(cacheKey);
  if (cached) return cached;

  try {
    // Try local file first (server-side)
    if (typeof window === 'undefined') {
      try {
        const fs = await import('fs/promises');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'public', 'collections', language, 'data', `${dataType}.json`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent) as T;
        setInCache(cacheKey, data);
        console.log(`[API] Loaded ${dataType} from local file for ${language}`);
        return data;
      } catch (fileError) {
        console.warn(`[API] Local file not found for ${language}/${dataType}, trying API`);
      }
    }

    // Fallback to API
    const url = getCollectionUrl(language, 'data', dataType);
    console.log(`[API] Fetching collection: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'default',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();
    // Extract 'data' field if present (API response wrapper from static.kuhandranchatbot.info)
    const data = responseData.data || responseData;
    setInCache(cacheKey, data);
    return data as T;
  } catch (error) {
    console.error(`[API Error] Failed to fetch collection (${language}/${dataType}):`, error);
    // Return empty array for data collections that expect array responses
    return [] as T;
  }
}

/**
 * Fetch projects data
 */
export async function fetchProjects(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  return fetchCollectionData('projects', language);
}

/**
 * Fetch experience data
 */
export async function fetchExperience(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  return fetchCollectionData('experience', language);
}

/**
 * Fetch skills data
 */
export async function fetchSkills(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  return fetchCollectionData('skills', language);
}

/**
 * Fetch education data
 */
export async function fetchEducation(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  return fetchCollectionData('education', language);
}

/**
 * Fetch achievements data
 */
export async function fetchAchievements(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  return fetchCollectionData('achievements', language);
}

/**
 * Fetch case studies data
 */
export async function fetchCaseStudies(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  return fetchCollectionData('caseStudies', language);
}

/**
 * Fetch content labels (UI text)
 */
export async function fetchContentLabels(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  return fetchCollectionData('contentLabels', language);
}

// ============================================================================
// MANIFEST ENDPOINT
// ============================================================================

/**
 * Fetch PWA manifest
 */
export async function fetchManifest(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  const cacheKey = `manifest:${language}`;
  
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const url = getManifestUrl(language);
    console.log(`[API] Fetching manifest: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'default',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();
    // Extract 'data' field if present (API response wrapper from static.kuhandranchatbot.info)
    const data = responseData.data || responseData;
    setInCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`[API Error] Failed to fetch manifest (${language}):`, error);
    return null;
  }
}
