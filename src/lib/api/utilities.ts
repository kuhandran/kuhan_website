/**
 * API Utility Functions
 * Handles: bulk data loading, bulk cache clearing
 */

import { SupportedLanguage, DEFAULT_LANGUAGE } from '@/lib/config/domains';
import {
  fetchApiConfig,
  fetchPageLayout,
  fetchContentLabels,
  fetchProjects,
  fetchExperience,
  fetchSkills,
  fetchEducation,
} from './fetchers';
import { clearApiCache, clearLanguageCache } from './cache-legacy';

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Fetch all essential data for a language
 * Useful for preloading when language changes
 */
export async function fetchAllEssentialData(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  console.log(`[API] Fetching all essential data for: ${language}`);
  
  try {
    const [
      apiConfig,
      pageLayout,
      contentLabels,
      projects,
      experience,
      skills,
      education,
    ] = await Promise.all([
      fetchApiConfig(language),
      fetchPageLayout(language),
      fetchContentLabels(language),
      fetchProjects(language),
      fetchExperience(language),
      fetchSkills(language),
      fetchEducation(language),
    ]);

    console.log(`[API] Successfully loaded all data for: ${language}`);

    return {
      apiConfig,
      pageLayout,
      contentLabels,
      projects,
      experience,
      skills,
      education,
    };
  } catch (error) {
    console.error(`[API Error] Failed to fetch all essential data:`, error);
    return null;
  }
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

/**
 * Clear all API cache (supports both legacy cache and CacheManager)
 */
export function clearAllCaches(): void {
  clearApiCache();
  console.log('[API] Cleared all API caches');
}

/**
 * Clear cache for a specific language
 * Useful when language changes
 */
export function clearCacheForLanguage(language: SupportedLanguage): void {
  clearLanguageCache(language);
  console.log(`[API] Cleared cache for language: ${language}`);
}
