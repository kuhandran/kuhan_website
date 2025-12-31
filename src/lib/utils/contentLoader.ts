/**
 * Content Loading Utilities
 * Helper functions to fetch and cache multilingual content via Next.js API proxy
 * Automatically uses language code from context or defaults to 'en'
 * 
 * Flow: Component → /api/content/[type] → External API or Local Fallback
 */

import { getConfigUrl } from '@/lib/config/dataConfig';

interface ContentCache {
  [languageCode: string]: {
    [fileType: string]: any;
  };
}

let contentCache: ContentCache = {};

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
): Promise<any> {
  // Check cache first if preferred
  if (preferCache && contentCache[languageCode]?.[fileType]) {
    return contentCache[languageCode][fileType];
  }

  let content = null;

  try {
    // Use Next.js API proxy instead of direct external API call
    // This avoids CORS issues and provides automatic fallback to local data
    const proxyUrl = `/api/content/data?language=${languageCode}&file=${fileType}`;
    console.log(`📡 Fetching via proxy: ${proxyUrl}`);
    
    const response = await fetch(proxyUrl, {
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      content = await response.json();
      const dataSource = response.headers.get('X-Data-Source') || 'api';
      console.log(`✅ Loaded ${fileType} for ${languageCode} (${dataSource})`);
    } else {
      console.warn(
        `⚠️ Failed to fetch ${fileType} for ${languageCode} (HTTP ${response.status})`
      );
    }
  } catch (error) {
    console.error(
      `❌ Error fetching ${fileType} for ${languageCode}:`,
      error instanceof Error ? error.message : error
    );
  }

  // Cache the result (even if null)
  if (!contentCache[languageCode]) {
    contentCache[languageCode] = {};
  }
  contentCache[languageCode][fileType] = content;

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
export async function getContentLabels(languageCode: string): Promise<any> {
  return getMultilingualContent(languageCode, 'contentLabels');
}

/**
 * Get projects for a specific language
 * @param languageCode - Language code
 * @returns Projects array
 */
export async function getProjects(languageCode: string): Promise<any> {
  return getMultilingualContent(languageCode, 'projects');
}

/**
 * Get experience for a specific language
 * @param languageCode - Language code
 * @returns Experience array
 */
export async function getExperience(languageCode: string): Promise<any> {
  return getMultilingualContent(languageCode, 'experience');
}

/**
 * Get skills for a specific language
 * @param languageCode - Language code
 * @returns Skills array/object
 */
export async function getSkills(languageCode: string): Promise<any> {
  return getMultilingualContent(languageCode, 'skills');
}

/**
 * Get education for a specific language
 * @param languageCode - Language code
 * @returns Education array
 */
export async function getEducation(languageCode: string): Promise<any> {
  return getMultilingualContent(languageCode, 'education');
}

/**
 * Get achievements for a specific language
 * @param languageCode - Language code
 * @returns Achievements array
 */
export async function getAchievements(languageCode: string): Promise<any> {
  return getMultilingualContent(languageCode, 'achievements');
}

/**
 * Get API config for a specific language
 * @param languageCode - Language code
 * @returns API config object
 * 
 * Example:
 * const config = await getApiConfig('en');
 * // Access from: https://static-api-opal.vercel.app/api/collections/en/config/apiConfig.json
 */
export async function getApiConfig(languageCode: string): Promise<any> {
  // Check cache first
  if (contentCache[languageCode]?.['apiConfig']) {
    return contentCache[languageCode]['apiConfig'];
  }

  let content = null;

  try {
    const url = getConfigUrl('apiConfig', languageCode);
    console.log(`📡 Fetching config: ${url}`);
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      content = await response.json();
      console.log(`✅ Loaded apiConfig for ${languageCode}`);
    } else {
      console.warn(
        `⚠️ Failed to fetch apiConfig for ${languageCode} (HTTP ${response.status})`
      );
    }
  } catch (error) {
    console.error(
      `❌ Error fetching apiConfig for ${languageCode}:`,
      error instanceof Error ? error.message : error
    );
  }

  // Cache the result
  if (!contentCache[languageCode]) {
    contentCache[languageCode] = {};
  }
  contentCache[languageCode]['apiConfig'] = content;

  return content;
}

/**
 * Get page layout config for a specific language
 * @param languageCode - Language code
 * @returns Page layout configuration
 */
export async function getPageLayout(languageCode: string): Promise<any> {
  let content = null;

  try {
    const url = getConfigUrl('pageLayout', languageCode);
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      content = await response.json();
    }
  } catch (error) {
    console.error(`Error fetching pageLayout for ${languageCode}:`, error);
  }

  return content;
}

/**
 * Clear the content cache (useful for forcing refresh)
 */
export function clearContentCache(): void {
  contentCache = {};
  console.log('✨ Content cache cleared');
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
  const promises: Promise<any>[] = [];

  for (const langCode of languageCodes) {
    for (const fileType of fileTypes) {
      promises.push(getMultilingualContent(langCode, fileType));
    }
  }

  await Promise.all(promises);
  console.log(`✅ Prefetch complete`);
}
