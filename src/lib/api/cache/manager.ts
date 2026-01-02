/**
 * Unified Cache Manager
 * Centralized caching system for all API responses and data
 * 
 * Features:
 * - TTL (Time-To-Live) support with automatic expiration
 * - Pattern-based cache clearing
 * - Cache statistics and monitoring
 * - Type-safe generic caching
 * 
 * Usage:
 * ```typescript
 * import { cacheManager } from '@/lib/api/cache/manager';
 * 
 * // Set cache
 * cacheManager.set('projects-en', projects, 5 * 60 * 1000); // 5 minutes
 * 
 * // Get cache
 * const projects = cacheManager.get<Project[]>('projects-en');
 * 
 * // Clear cache
 * cacheManager.clear(/^projects/); // Clear all 'projects-*' keys
 * ```
 */

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  expiresAt: number;
  hits: number;
}

export class CacheManager {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private stats = { gets: 0, sets: 0, hits: 0, misses: 0, clears: 0 };

  /**
   * Get a value from cache
   * @param key - Cache key
   * @returns Cached value or null if expired/not found
   */
  get<T>(key: string): T | null {
    this.stats.gets++;

    const entry = this.cache.get(key);

    // Return null if entry doesn't exist
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update hit counter and return
    entry.hits++;
    this.stats.hits++;
    return entry.data as T;
  }

  /**
   * Set a value in cache
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttlMs - Time-to-live in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, data: T, ttlMs = this.DEFAULT_TTL): void {
    this.stats.sets++;

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttlMs,
      hits: 0,
    });
  }

  /**
   * Check if key exists and is not expired
   * @param key - Cache key
   * @returns true if key exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Delete if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Clear cache entries
   * @param pattern - Optional regex pattern to match keys to delete
   */
  clear(pattern?: RegExp): void {
    this.stats.clears++;

    if (!pattern) {
      // Clear all
      this.cache.clear();
      return;
    }

    // Clear matching keys
    const keysToDelete: string[] = [];
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Get cache size
   * @returns Number of entries in cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get all cache keys
   * @returns Array of cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache statistics
   * @returns Object with cache hit rate and other metrics
   */
  getStats() {
    const total = this.stats.gets;
    const hitRate = total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) : '0.00';

    return {
      size: this.cache.size,
      totalGets: this.stats.gets,
      totalSets: this.stats.sets,
      totalClears: this.stats.clears,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: `${hitRate}%`,
      keys: this.keys(),
    };
  }

  /**
   * Get details about a specific cache entry
   * @param key - Cache key
   * @returns Entry details or null if not found
   */
  getEntryInfo(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    return {
      key,
      timestamp: new Date(entry.timestamp).toISOString(),
      expiresAt: new Date(entry.expiresAt).toISOString(),
      isExpired: Date.now() > entry.expiresAt,
      hits: entry.hits,
      ttl: entry.expiresAt - entry.timestamp,
    };
  }

  /**
   * Debug: Log all cache entries with their TTL
   */
  debug(): void {
    console.log('[CacheManager] Current Cache State:');
    console.table(
      this.keys().map(key => {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const ttlRemaining = Math.max(0, entry.expiresAt - Date.now());
        return {
          key,
          hits: entry.hits,
          ttlRemaining: `${Math.round(ttlRemaining / 1000)}s`,
          expired: Date.now() > entry.expiresAt ? 'YES' : 'NO',
        };
      })
    );

    console.log('[CacheManager] Statistics:', this.getStats());
  }
}

/**
 * Global cache manager instance
 * Use this singleton throughout the app
 */
export const cacheManager = new CacheManager();

export default cacheManager;
