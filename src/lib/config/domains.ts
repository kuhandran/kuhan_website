/**
 * Centralized Domain & Base URL Configuration
 * All external URLs and API domains defined in one place
 * Rest of the application should only use these constants with path parameters
 */

// ============================================================================
// PRODUCTION & CDN DOMAINS
// ============================================================================

/** Production API - Main data source for all multilingual content */
export const DOMAINS = {
  PRODUCTION_API: process.env.NEXT_PUBLIC_STATIC_API_URL ?? 'https://static.kuhandranchatbot.info',
  CDN:            process.env.NEXT_PUBLIC_STATIC_API_URL ?? 'https://static.kuhandranchatbot.info',
  IP_API:         process.env.NEXT_PUBLIC_IP_API_URL     ?? 'https://ipapi.co',

  getAppUrl: (): string => {
    if (typeof window !== 'undefined') return window.location.origin;
    return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  },
} as const;

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  // Production API paths
  collections: (language: string, type: 'data' | 'config', file: string) => {
    const normalizedFile = file.replace(/\.json$/i, '');
    return `${DOMAINS.PRODUCTION_API}/public/collections/${language}/${type}/${normalizedFile}.json`;
  },

  // Internal API routes
  contentProxy: (type: string) => `/api/content/${type}`,
  // Language-specific config routes
  configRoute: (language: string, configType: string) =>
    `${DOMAINS.PRODUCTION_API}/public/config/${language}/${configType}`,
  manifestRoute: (language: string = DEFAULT_LANGUAGE) =>
    `${DOMAINS.PRODUCTION_API}/public/manifest/${language}.json`,
  // CDN paths
  cdnData: (file: string) =>
    `${DOMAINS.CDN}/public/collections/en/data/${file}.json`,
  cdnConfig: (file: string) =>
    `${DOMAINS.CDN}/public/collections/en/config/${file}`,
  cdnImage: (imagePath: string) =>
    `${DOMAINS.CDN}/public/image/${imagePath}`,

  // Third-party APIs
  ipGeolocation: () => `${DOMAINS.IP_API}/json/`,

  // Local asset paths (DEPRECATED - use configRoute, manifestRoute, serviceWorkerRoute instead)
  localConfig: (file: string) => `/config/${file}.json`,
  localData: (file: string) => `/data/${file}.json`,
  localImage: (imagePath: string) => `/image/${imagePath}`,
  localImages: (imagePath: string) => `/images/${imagePath}`,
} as const;

// ============================================================================
// LANGUAGE CONFIGURATION
// ============================================================================

export const SUPPORTED_LANGUAGES = [
  'en',    // English
  'es',    // Spanish
  'fr',    // French
  'de',    // German
  'hi',    // Hindi
  'ta',    // Tamil
  'ar-AE', // Arabic - UAE
  'id',    // Indonesian
  'my',    // Burmese
  'si',    // Sinhala
  'th',    // Thai
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// ============================================================================
// DATA FILE NAMES
// ============================================================================

export const DATA_FILES = {
  // Data files
  experience: 'experience',
  projects: 'projects',
  skills: 'skills',
  education: 'education',
  achievements: 'achievements',
  caseStudies: 'caseStudies',
  contentLabels: 'contentLabels',

  // Config files
  apiConfig: 'apiConfig',
  pageLayout: 'pageLayout',
  urlConfig: 'urlConfig',

  // Error messages
  errorMessages: 'errorMessages',
  defaultContentLabels: 'defaultContentLabels',
} as const;

// ============================================================================
// IMAGE ASSETS
// ============================================================================

export const IMAGE_ASSETS = {
  // Profile images
  profile: {
    png: 'profile.png',
    webp: 'profile.webp',
  },

  // Case study images
  caseStudies: {
    fwd: 'case-studies/fwd.jpg',
  },

  // Icons
  logo: 'logo.svg',
  appleTouchIcon: 'apple-touch-icon.svg',
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get full URL for production API collection data
 * @example getCollectionUrl('en', 'data', 'experience')
 *          → 'https://static.kuhandranchatbot.info/public/collections/en/data/experience.json'
 */
export function getCollectionUrl(
  language: SupportedLanguage = DEFAULT_LANGUAGE,
  type: 'data' | 'config',
  file: string
): string {
  const normalizedFile = file.replace(/\.json$/i, '');
  return API_ENDPOINTS.collections(language, type, normalizedFile);
}

/**
 * Get full URL for CDN data
 * @example getCdnDataUrl('skills')
 *          → 'https://static.kuhandranchatbot.info/public/collections/en/data/skills.json'
 */
export function getCdnDataUrl(file: string): string {
  const normalizedFile = file.replace(/\.json$/i, '');
  return API_ENDPOINTS.cdnData(normalizedFile);
}

/**
 * Get full URL for CDN image
 * @example getCdnImageUrl('profile.webp')
 *          → 'https://static.kuhandranchatbot.info/public/image/profile.webp'
 */
export function getCdnImageUrl(imagePath: string): string {
  // Normalize path: remove common prefixes
  let normalizedPath = imagePath.replace(/^\/+/, ''); // Remove leading slashes
  
  // Strip duplicate/nested path prefixes
  const prefixes = ['public/api/image/', 'api/image/', 'public/image/', 'image/'];
  let matched = true;
  
  while (matched) {
    matched = false;
    for (const prefix of prefixes) {
      if (normalizedPath.startsWith(prefix)) {
        normalizedPath = normalizedPath.substring(prefix.length);
        matched = true;
      }
    }
  }
  
  return API_ENDPOINTS.cdnImage(normalizedPath);
}

/**
 * Get full URL for local asset
 * @example getLocalImageUrl('profile.png')
 *          → '/image/profile.png'
 */
export function getLocalImageUrl(imagePath: string): string {
  return API_ENDPOINTS.localImage(imagePath);
}

/**
 * Get full URL for IP geolocation API
 * @example getIpGeolocationUrl()
 *          → 'https://ipapi.co/json/'
 */
export function getIpGeolocationUrl(): string {
  return API_ENDPOINTS.ipGeolocation();
}

/**
 * Get content proxy URL for internal API
 * @example getContentProxyUrl('data')
 *          → '/api/content/data'
 */
export function getContentProxyUrl(
  type: 'data' | 'config',
  language?: SupportedLanguage,
  file?: string
): string {
  const baseUrl = API_ENDPOINTS.contentProxy(type);
  const params = new URLSearchParams();
  if (language) params.append('language', language);
  if (file) params.append('file', file);
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Get full app URL (works on both server and client)
 * @example getAppUrl()
 *          → 'http://localhost:3000' (dev) or NEXT_PUBLIC_SITE_URL (prod)
 */
export function getAppUrl(): string {
  return DOMAINS.getAppUrl();
}

/**
 * Get language-specific config URL
 * @example getConfigRouteUrl('en', 'apiConfig')
 *          → '/api/config/en/apiConfig'
 */
export function getConfigRouteUrl(
  language: SupportedLanguage = DEFAULT_LANGUAGE,
  configType: string
): string {
  return API_ENDPOINTS.configRoute(language, configType);
}

/**
 * Get language-specific manifest URL
 * @example getManifestUrl('en')
 *          → '/api/manifest/en'
 */
export function getManifestUrl(
  language: SupportedLanguage = DEFAULT_LANGUAGE
): string {
  return API_ENDPOINTS.manifestRoute(language);
}
