/**
 * Static API Resource Utilities
 * Handles: images, resumes, config files, storage files, collections
 * Uses legacy cache for backwards compatibility
 */

import { getCdnImageUrl, SupportedLanguage, DEFAULT_LANGUAGE } from '@/lib/config/domains';
import { getFromCache, setInCache } from './cache-legacy';

// ============================================================================
// CONSTANTS
// ============================================================================

const STATIC_API_BASE = 'https://static-api-opal.vercel.app';
const BACKEND_API_BASE = 'https://api-gateway-9unh.onrender.com';
const STORAGE_FILES_URL = `${STATIC_API_BASE}/api/storage-files`;

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
  } catch (error) {
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
  // Remove 'image/' prefix if it already exists to avoid duplication
  const finalPath = cleanPath.startsWith('image/') ? cleanPath.substring(6) : cleanPath;
  const imageUrl = `${STATIC_API_BASE}/api/image/${finalPath}`;
  console.log(`[API] Image URL: ${imageUrl}`);
  return imageUrl;
}

/**
 * Preload images
 */
export async function preloadImages(imagePaths: string[]): Promise<void> {
  const promises = imagePaths.map(path => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        console.log('[Image] Preloaded:', path);
        resolve();
      };
      img.onerror = () => {
        console.warn('[Image] Failed to preload:', path);
        resolve();
      };
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
  const cleanPath = extractPath(path);
  const resumeUrl = `${STATIC_API_BASE}/api/resume/${cleanPath}`;
  console.log(`[API] Resume URL: ${resumeUrl}`);
  return resumeUrl;
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
  const cleanPath = extractPath(path);
  const configUrl = `${STATIC_API_BASE}/config/${cleanPath}`;
  console.log(`[API] Config URL: ${configUrl}`);
  return configUrl;
}

// ============================================================================
// STORAGE FILE ENDPOINTS
// ============================================================================

/**
 * Get storage file from static API
 * @param fileName - File name to fetch (e.g., 'logo-svg', 'manifest.json')
 * @returns File data
 */
export async function getStorageFile<T = any>(fileName: string): Promise<T | null> {
  const cacheKey = `storage:${fileName}`;
  
  // Check cache first
  const cached = getFromCache<T>(cacheKey);
  if (cached) return cached;

  try {
    const url = `${STORAGE_FILES_URL}/${fileName}`;
    console.log(`[API] Fetching storage file: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'default',
    });

    if (!response.ok) {
      console.warn(`[API] Failed to fetch storage file: ${response.status}`);
      return null;
    }

    const data = await response.json();
    setInCache(cacheKey, data);
    return data as T;
  } catch (error) {
    console.error(`[API Error] Failed to fetch storage file ${fileName}:`, error);
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
export async function getCollection<T = any>(
  url: string,
  type: 'config' | 'data',
  language: SupportedLanguage = DEFAULT_LANGUAGE
): Promise<T | null> {
  const cleanUrl = extractPath(url);
  const cacheKey = `collection:${language}:${type}:${cleanUrl}`;
  
  console.log(`[API] getCollection called - Language: ${language}, Type: ${type}, URL: ${cleanUrl}`);
  
  // Check cache first
  const cached = getFromCache<T>(cacheKey);
  if (cached) return cached;

  try {
    const fullUrl = `${STATIC_API_BASE}/${type}/${language}/${cleanUrl}`;
    console.log(`[API] Fetching collection: ${fullUrl}`);
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'default',
    });

    if (!response.ok) {
      console.warn(`[API] Failed to fetch collection: ${response.status}`);
      return null;
    }

    const data = await response.json();
    setInCache(cacheKey, data);
    return data as T;
  } catch (error) {
    console.error(`[API Error] Failed to fetch collection from ${url}:`, error);
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
export async function getInfoFromAPI<T = any>(
  type: 'GET' | 'POST',
  path: string,
  data?: Record<string, any>,
  useStatic: boolean = false
): Promise<T | null> {
  const cleanPath = extractPath(path);
  const baseUrl = useStatic ? STATIC_API_BASE : BACKEND_API_BASE;
  const fullUrl = `${baseUrl}/${cleanPath}`;
  
  const cacheKey = `api:${type}:${fullUrl}:${JSON.stringify(data || {})}`;
  
  // Check cache for GET requests only
  if (type === 'GET') {
    const cached = getFromCache<T>(cacheKey);
    if (cached) return cached;
  }

  try {
    console.log(`[API] ${type} request to: ${fullUrl}`);
    
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
      setInCache(cacheKey, responseData);
    }

    return responseData as T;
  } catch (error) {
    console.error(`[API Error] ${type} request failed to ${fullUrl}:`, error);
    return null;
  }
}
