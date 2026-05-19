/**
 * Static API Resource Utilities
 * Handles: images, resumes, config files, storage files, collections
 * Uses legacy cache for backwards compatibility
 */

import { getCdnImageUrl, SupportedLanguage, DEFAULT_LANGUAGE } from '@/lib/config/domains';
import { cacheManager } from './cache';

const TTL = 5 * 60 * 1000;

// ============================================================================
// CONSTANTS
// ============================================================================

const STATIC_API_BASE  = process.env.NEXT_PUBLIC_STATIC_API_URL  ?? 'https://static.kuhandranchatbot.info';
const BACKEND_API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? '';
const STORAGE_FILES_URL = `${STATIC_API_BASE}/public`;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extract path from URL, removing domain
 * @param urlOrPath - Full URL or path
 * @returns Just the path portion
 */
function extractPath(urlOrPath: string): string {
  try {
    // If it's a valid URL, extract the pathname
    if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
      const url = new URL(urlOrPath);
      return url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
    }
    // If it's already a path, remove leading slash if present
    return urlOrPath.startsWith('/') ? urlOrPath.slice(1) : urlOrPath;
  } catch {
    console.warn(`[API] Could not parse URL: ${urlOrPath}, using as-is`);
    return urlOrPath.startsWith('/') ? urlOrPath.slice(1) : urlOrPath;
  }
}

// ============================================================================
// IMAGE ENDPOINTS
// ============================================================================

/**
 * Get image URL from CDN
 */
export function getImageUrl(imagePath: string): string {
  return getCdnImageUrl(imagePath);
}

/**
 * Get image URL from static API
 * @param path - Path to image file or full image URL
 * @returns Full image URL
 */
export function getImage(path: string): string {
  const cleanPath = extractPath(path);
  let finalPath = cleanPath.replace(/^\/+/, '');

  // Normalize duplicate path prefixes so we don't end up with
  // /public/image/api/image/ProjectX.webp or /api/image/image/ProjectX.webp.
  const prefixes = ['public/api/image/', 'api/image/', 'public/image/', 'image/'];
  let matched = true;

  while (matched) {
    matched = false;
    for (const prefix of prefixes) {
      if (finalPath.startsWith(prefix)) {
        finalPath = finalPath.substring(prefix.length);
        matched = true;
      }
    }
  }

  return `${STATIC_API_BASE}/public/image/${finalPath}`;
}

/**
 * Preload images
 */
export async function preloadImages(imagePaths: string[]): Promise<void> {
  const promises = imagePaths.map(path => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = getImageUrl(path);
    });
  });

  await Promise.all(promises);
}

// ============================================================================
// RESUME ENDPOINTS
// ============================================================================

/**
 * Get resume file URL
 * @param path - Path to resume file (e.g., 'resume.pdf', 'en/resume.pdf') or full URL
 * @returns Full resume URL
 */
export function getResume(path: string): string {
  return `${STATIC_API_BASE}/public/resume/${extractPath(path)}`;
}

// ============================================================================
// CONFIG ENDPOINTS
// ============================================================================

/**
 * Get config file URL
 * @param path - Path to config file or full URL
 * @returns Full config URL
 */
export function getConfig(path: string): string {
  return `${STATIC_API_BASE}/public/config/${extractPath(path)}.json`;
}

// ============================================================================
// STORAGE FILE ENDPOINTS
// ============================================================================

/**
 * Get storage file from static API
 * @param fileName - File name to fetch (e.g., 'logo-svg', 'manifest.json')
 * @returns File data
 */
export async function getStorageFile<T = unknown>(fileName: string): Promise<T | null> {
  const cacheKey = `storage:${fileName}`;
  
  // Check cache first
  const cached = cacheManager.get<T>(cacheKey);
  if (cached) return cached;

  try {
    const url = `${STORAGE_FILES_URL}/${fileName}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'default',
    });

    if (!response.ok) {
      console.warn(`[API] Failed to fetch storage file: ${response.status}`);
      return null;
    }

    const responseData = await response.json();
    // Extract 'data' field if present (API response wrapper from static.kuhandranchatbot.info)
    const data = responseData.data || responseData;
    cacheManager.set(cacheKey, data);
    return data as T;
  } catch (error) {
    console.error(`[API Error] Failed to fetch storage file ${fileName}:`, { error });
    return null;
  }
}

/**
 * Get logo SVG path from public folder
 * @returns Logo SVG path
 */
export async function getLogoSvg() {
  // Logo is served from public folder directly
  return '/logo.svg';
}

/**
 * Get manifest.json from storage
 * @returns Manifest data
 */
export async function getManifestFromStorage() {
  return getStorageFile('manifest.json');
}

// ============================================================================
// COLLECTION DATA FROM STATIC API
// ============================================================================

/**
 * Get collection data from static API
 * @param url - The collection endpoint path or full URL
 * @param type - Type of collection ('config' or 'data')
 * @param language - Language code (from Redux state)
 * @returns Collection data
 */
export async function getCollection<T = unknown>(
  url: string,
  type: 'config' | 'data',
  language: SupportedLanguage = DEFAULT_LANGUAGE
): Promise<T | null> {
  const cleanUrl = extractPath(url);
  const cacheKey = `collection:${language}:${type}:${cleanUrl}`;
  
  // Check cache first
  const cached = cacheManager.get<T>(cacheKey);
  if (cached) return cached;

  try {
    const fullUrl = `${STATIC_API_BASE}/public/collections/${language}/${type}/${cleanUrl}.json`;
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'default',
    });

    if (!response.ok) {
      console.warn(`[API] Failed to fetch collection: ${response.status}`);
      return null;
    }

    const responseData = await response.json();
    // Extract 'data' field if present (API response wrapper from static.kuhandranchatbot.info)
    const data = responseData.data || responseData;
    cacheManager.set(cacheKey, data);
    return data as T;
  } catch (error) {
    console.error(`[API Error] Failed to fetch collection from ${url}:`, { error });
    return null;
  }
}

// ============================================================================
// GENERIC API REQUEST
// ============================================================================

/**
 * Make API request to backend or static API
 * @param type - HTTP method ('GET' or 'POST')
 * @param path - API endpoint path or full URL
 * @param data - Request body (for POST requests)
 * @param useStatic - Whether to use static API (default: false, uses backend API)
 * @returns Response data
 */
export async function getInfoFromAPI<T = unknown>(
  type: 'GET' | 'POST',
  path: string,
  data?: Record<string, unknown>,
  useStatic: boolean = false
): Promise<T | null> {
  const cleanPath = extractPath(path);
  const baseUrl = useStatic ? STATIC_API_BASE : BACKEND_API_BASE;
  const fullUrl = `${baseUrl}/${cleanPath}.json`;
  
  const cacheKey = `api:${type}:${fullUrl}:${JSON.stringify(data || {})}`;
  
  // Check cache for GET requests only
  if (type === 'GET') {
    const cached = cacheManager.get<T>(cacheKey);
    if (cached) return cached;
  }

  try {
    const requestOptions: RequestInit = {
      method: type,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: type === 'GET' ? 'default' : 'no-store',
    };

    if (type === 'POST' && data) {
      requestOptions.body = JSON.stringify(data);
    }

    const response = await fetch(fullUrl, requestOptions);

    if (!response.ok) {
      console.warn(`[API] Request failed: ${response.status}`);
      return null;
    }

    const responseData = await response.json();
    
    // Cache GET requests only
    if (type === 'GET') {
      cacheManager.set(cacheKey, responseData);
    }

    return responseData as T;
  } catch (error) {
    console.error(`[API Error] ${type} request failed to ${fullUrl}:`, { error });
    return null;
  }
}
