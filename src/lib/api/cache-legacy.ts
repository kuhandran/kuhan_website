/**
 * Legacy API Cache Utilities
 * Used by fetchers.ts and resources.ts
 * NOTE: In future, migrate to CacheManager from '@/lib/api/cache'
 */

// Map-based cache for API responses (for backwards compatibility)
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

/**
 * Check if cached data is still valid
 */
export function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION;
}

/**
 * Get cached data if available and valid
 */
export function getFromCache<T>(key: string): T | null {
  const cached = apiCache.get(key);
  if (cached && isCacheValid(cached.timestamp)) {
    console.log('[API Cache] Hit:', key);
    return cached.data as T;
  }
  if (cached) {
    apiCache.delete(key);
  }
  return null;
}

/**
 * Store data in cache
 */
export function setInCache(key: string, data: any): void {
  apiCache.set(key, { data, timestamp: Date.now() });
  console.log('[API Cache] Set:', key);
}

/**
 * Clear all API cache
 */
export function clearApiCache(): void {
  apiCache.clear();
  console.log('[API Cache] Cleared all');
}

/**
 * Clear language-specific cache
 * Useful when language changes
 */
export function clearLanguageCache(language: string): void {
  const keysToDelete: string[] = [];
  
  apiCache.forEach((_, key) => {
    if (key.includes(`:${language}:`)) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach(key => apiCache.delete(key));
  console.log(`[API Cache] Cleared ${keysToDelete.length} entries for language: ${language}`);
}
