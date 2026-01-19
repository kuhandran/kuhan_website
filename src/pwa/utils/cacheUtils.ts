/**
 * Cache Utilities
 * Helper functions for managing service worker cache and offline support
 */

export interface CacheConfig {
  apiUrls?: string[];
  imageUrls?: string[];
  ttl?: number; // Time to live in milliseconds
}

/**
 * Pre-cache API endpoints
 */
export async function precacheApis(urls: string[]): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[CacheUtils] Service Worker not supported');
    return;
  }

  const controller = navigator.serviceWorker.controller;
  if (!controller) {
    console.warn('[CacheUtils] No active service worker controller');
    return;
  }

  urls.forEach((url) => {
    controller.postMessage({
      type: 'CACHE_API',
      data: { url },
    });
  });

  console.log('[CacheUtils] Pre-cache request sent for:', urls);
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<void> {
  if (!('caches' in window)) {
    console.warn('[CacheUtils] Cache API not supported');
    return;
  }

  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map((cacheName) => caches.delete(cacheName))
  );

  console.log('[CacheUtils] All caches cleared');
}

/**
 * Clear all caches via service worker message
 * Preferred method as it ensures service worker is aware of cache clearing
 */
export async function clearAllCachesViaServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[CacheUtils] Service Worker not supported, falling back to direct cache clear');
    await clearAllCaches();
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    if (!registration.active) {
      console.warn('[CacheUtils] No active service worker, falling back to direct cache clear');
      await clearAllCaches();
      return;
    }

    registration.active.postMessage({ type: 'CLEAR_CACHE' });
    
    // Also clear browser caches directly to ensure complete clearing
    await clearAllCaches();
    
    console.log('[CacheUtils] All caches cleared via service worker');
  } catch (error) {
    console.warn('[CacheUtils] Service worker cache clear failed, falling back:', error);
    await clearAllCaches();
  }
}

/**
 * Clear specific cache
 */
export async function clearCache(cacheName: string): Promise<void> {
  if (!('caches' in window)) {
    console.warn('[CacheUtils] Cache API not supported');
    return;
  }

  await caches.delete(cacheName);
  console.log('[CacheUtils] Cache cleared:', cacheName);
}

/**
 * Get cached response
 */
export async function getCachedResponse(url: string): Promise<Response | undefined> {
  if (!('caches' in window)) {
    console.warn('[CacheUtils] Cache API not supported');
    return undefined;
  }

  const response = await caches.match(url);
  return response;
}

/**
 * Cache response manually
 */
export async function cacheResponse(
  url: string,
  response: Response,
  cacheName: string = 'api-cache'
): Promise<void> {
  if (!('caches' in window)) {
    console.warn('[CacheUtils] Cache API not supported');
    return;
  }

  const cache = await caches.open(cacheName);
  cache.put(url, response.clone());
  console.log('[CacheUtils] Cached response:', url);
}

/**
 * Get cache size
 */
export async function getCacheSize(): Promise<{ [key: string]: string }> {
  if (!('caches' in window) || !('estimate' in navigator.storage)) {
    console.warn('[CacheUtils] Storage estimation not supported');
    return {};
  }

  const cacheNames = await caches.keys();
  const sizes: { [key: string]: string } = {};

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    const bytes = requests.length * 1024; // Rough estimate
    sizes[cacheName] = formatBytes(bytes);
  }

  return sizes;
}

/**
 * Format bytes to human readable size
 */
function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Check if offline
 */
export function isOffline(): boolean {
  return !navigator.onLine;
}

/**
 * Get offline status observable
 */
export function onOfflineStatusChange(callback: (isOffline: boolean) => void): () => void {
  const handleOnline = () => callback(false);
  const handleOffline = () => callback(true);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Update service worker if available
 */
export async function updateServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[CacheUtils] Service Worker not supported');
    return false;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    return false;
  }

  await registration.update();

  if (registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    return true;
  }

  return false;
}

/**
 * Pre-cache default API files on first load
 */
export async function initializeDefaultCache(): Promise<void> {
  const defaultApis = [
    'https://static.kuhandranchatbot.info/api/collections/en/data/projects',
    'https://static.kuhandranchatbot.info/api/collections/en/data/experience',
    'https://static.kuhandranchatbot.info/api/collections/en/data/education',
    'https://static.kuhandranchatbot.info/api/collections/en/data/skills',
    'https://static.kuhandranchatbot.info/api/collections/en/data/achievements',
    'https://static.kuhandranchatbot.info/api/collections/en/data/caseStudies',
    'https://static.kuhandranchatbot.info/api/collections/en/data/contentLabels',
  ];

  await precacheApis(defaultApis);
  console.log('[CacheUtils] Default cache initialized');
}

/**
 * Pre-cache images from a list
 */
export async function precacheImages(imageUrls: string[]): Promise<void> {
  if (!('caches' in window)) {
    console.warn('[CacheUtils] Cache API not supported');
    return;
  }

  const cache = await caches.open('v1.0.0-images');
  const promises = imageUrls.map(async (url) => {
    try {
      const response = await fetch(url);
      if (response && response.status === 200) {
        await cache.put(url, response);
        console.log('[CacheUtils] Cached image:', url);
      }
    } catch (error) {
      console.warn('[CacheUtils] Failed to cache image:', url, error);
    }
  });

  await Promise.all(promises);
}

/**
 * Pre-cache CDN content
 */
export async function precacheCdnContent(cdnUrls: string[]): Promise<void> {
  if (!('caches' in window)) {
    console.warn('[CacheUtils] Cache API not supported');
    return;
  }

  const cache = await caches.open('v1.0.0-cdn');
  const promises = cdnUrls.map(async (url) => {
    try {
      const response = await fetch(url);
      if (response && response.status === 200) {
        await cache.put(url, response);
        console.log('[CacheUtils] Cached CDN content:', url);
      }
    } catch (error) {
      console.warn('[CacheUtils] Failed to cache CDN content:', url, error);
    }
  });

  await Promise.all(promises);
}
