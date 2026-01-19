/**
 * Content Loading Utilities
 * Helper functions to fetch and cache multilingual content via Next.js API proxy
 * Automatically uses language code from context or defaults to 'en'
 * 
 * Flow: Component → /api/content/[type] → External API or Local Fallback
 */

import { getDataSourceUrl } from '@/lib/config/loaders';
import { cacheManager } from '@/lib/api/cache';

/**
 * Fetch multilingual content through Next.js API proxy
 * Falls back to local data if external API is unavailable
 * @param languageCode - Language code (e.g., 'en', 'ta', 'ar-AE')
 * @param fileType - File type (e.g., 'contentLabels', 'projects', 'experience')
 * @param preferCache - Whether to use cache if available (default: true)
 * @returns Content data or null if failed
 * 
 * Examples:
 * - getMultilingualContent('en', 'contentLabels')
 *   → GET /api/content/data?language=en&file=contentLabels
 * - getMultilingualContent('ta', 'projects')
 *   → GET /api/content/data?language=ta&file=projects
 */
export async function getMultilingualContent(
  languageCode: string,
  fileType: string,
  preferCache: boolean = true
): Promise<unknown> {
  const cacheKey = `content-${languageCode}-${fileType}`;

  // Check cache first if preferred
  if (preferCache) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  let content = null;

  try {
    // Use Next.js API proxy instead of direct external API call
    // This avoids CORS issues and provides automatic fallback to local data
    const proxyUrl = `/api/content/data?language=${languageCode}&file=${fileType}`;
    console.log('[ContentLoader] Fetching via proxy', { language: languageCode, file: fileType });
    
    const response = await fetch(proxyUrl, {
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      const responseData = await response.json();
      // Extract 'data' field if present (API response wrapper from static.kuhandranchatbot.info)
      content = responseData.data || responseData;
      const dataSource = response.headers.get('X-Data-Source') || 'api';
      console.log('[ContentLoader] Loaded successfully', { fileType, languageCode, dataSource });
    } else {
      console.warn('[ContentLoader] HTTP error', {
        fileType,
        languageCode,
        status: response.status
      });
    }
  } catch (error) {
    console.error('[ContentLoader] Fetch error', {
      fileType,
      languageCode,
      error: error instanceof Error ? error.message : String(error)
    });
  }

  // Cache the result (5 minute TTL)
  if (content) {
    cacheManager.set(cacheKey, content, 5 * 60 * 1000);
  }

  return content;
}

/**
 * Get content labels for a specific language
 * @param languageCode - Language code (e.g., 'en', 'ta', 'ar-AE')
 * @returns Content labels object
 * 
 * Example:
 * const labels = await getContentLabels('en');
 * // Access: labels.navigation.about, labels.hero.greeting
 */
export async function getContentLabels(languageCode: string): Promise<unknown> {
  return getMultilingualContent(languageCode, 'contentLabels');
}

/**
 * Get projects for a specific language
 * @param languageCode - Language code
 * @returns Projects array
 */
export async function getProjects(languageCode: string): Promise<unknown> {
  return getMultilingualContent(languageCode, 'projects');
}

/**
 * Get experience for a specific language
 * @param languageCode - Language code
 * @returns Experience array
 */
export async function getExperience(languageCode: string): Promise<unknown> {
  return getMultilingualContent(languageCode, 'experience');
}

/**
 * Get skills for a specific language
 * @param languageCode - Language code
 * @returns Skills array/object
 */
export async function getSkills(languageCode: string): Promise<unknown> {
  return getMultilingualContent(languageCode, 'skills');
}

/**
 * Get education for a specific language
 * @param languageCode - Language code
 * @returns Education array
 */
export async function getEducation(languageCode: string): Promise<unknown> {
  return getMultilingualContent(languageCode, 'education');
}

/**
 * Get achievements for a specific language
 * @param languageCode - Language code
 * @returns Achievements array
 */
export async function getAchievements(languageCode: string): Promise<unknown> {
  return getMultilingualContent(languageCode, 'achievements');
}

/**
 * Get API config for a specific language
 * @param languageCode - Language code
 * @returns API config object
 * 
 * Example:
 * const config = await getApiConfig('en');
 * // Access from: https://static-api-opal.vercel.app/collections/en/config/apiConfig.json
 */
export async function getApiConfig(languageCode: string): Promise<unknown> {
  const cacheKey = `content-${languageCode}-apiConfig`;

  // Check cache first
  const cached = cacheManager.get(cacheKey);
  if (cached) {
    return cached;
  }

  let content = null;

  try {
    // Fetch from external API (no local file fallback)
    const url = getDataSourceUrl('apiConfig.json', languageCode, 'config');
    console.log('[ContentLoader] Fetching apiConfig from API', { language: languageCode });
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      const data = await response.json();
      // Extract 'data' field if present (API response wrapper)
      content = data.data || data;
      console.log('[ContentLoader] apiConfig loaded from API', { languageCode });
    } else {
      console.warn('[ContentLoader] apiConfig fetch failed', {
        languageCode,
        status: response.status
      });
    }
  } catch (error) {
    console.error('[ContentLoader] apiConfig error', {
      languageCode,
      error: error instanceof Error ? error.message : String(error)
    });
  }

  // Cache the result (5 minute TTL)
  if (content) {
    cacheManager.set(cacheKey, content, 5 * 60 * 1000);
  }

  return content;
}

/**
 * Get page layout config for a specific language
 * @param languageCode - Language code
 * @returns Page layout configuration
 */
export async function getPageLayout(languageCode: string): Promise<unknown> {
  const cacheKey = `content-${languageCode}-pageLayout`;

  // Check cache first
  const cached = cacheManager.get(cacheKey);
  if (cached) {
    return cached;
  }

  let content = null;

  try {
    // Fetch from external API (no local file fallback)
    const url = getDataSourceUrl('pageLayout.json', languageCode, 'config');
    console.log('[ContentLoader] Fetching pageLayout from API', { language: languageCode });
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      const data = await response.json();
      // Extract 'data' field if present (API response wrapper)
      content = data.data || data;
      console.log('[ContentLoader] pageLayout loaded from API', { languageCode });
    } else {
      console.warn('[ContentLoader] pageLayout fetch failed', {
        languageCode,
        status: response.status
      });
    }
  } catch (error) {
    console.error('[ContentLoader] pageLayout error', {
      languageCode,
      error: error instanceof Error ? error.message : String(error)
    });
  }

  // Cache the result (5 minute TTL)
  if (content) {
    cacheManager.set(cacheKey, content, 5 * 60 * 1000);
  }

  return content;
}

/**
 * Clear the content cache (useful for forcing refresh)
 */
export function clearContentCache(): void {
  cacheManager.clear(/^content-/);
  console.log('[ContentLoader] Cache cleared');
}

/**
 * Prefetch content for multiple languages
 * Useful for improving performance when languages are known in advance
 * @param languageCodes - Array of language codes to prefetch
 * @param fileTypes - Array of file types to prefetch
 * 
 * Example:
 * prefetchLanguageContent(['en', 'ta', 'ar-AE'], ['contentLabels', 'projects']);
 */
export async function prefetchLanguageContent(
  languageCodes: string[],
  fileTypes: string[] = [
    'contentLabels',
    'projects',
    'experience',
    'skills',
    'education',
    'achievements',
  ]
): Promise<void> {
  console.log(`⚙️ Prefetching ${languageCodes.length} languages × ${fileTypes.length} types...`);
  const promises: Promise<unknown>[] = [];

  for (const langCode of languageCodes) {
    for (const fileType of fileTypes) {
      promises.push(getMultilingualContent(langCode, fileType));
    }
  }

  await Promise.all(promises);
  console.log(`✅ Prefetch complete`);
}
