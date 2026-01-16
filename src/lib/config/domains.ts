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
  // Production API
  PRODUCTION_API: 'https://static.kuhandranchatbot.info',

  // CDN - Static content and images
  CDN: 'https://static.kuhandranchatbot.info',

  // Third-party services
  IP_API: 'https://ipapi.co',

  // Local development & production host (dynamic)
  getAppUrl: (): string => {
    if (typeof window !== 'undefined') {
      // Client-side: use current location
      return window.location.origin;
    }
    // Server-side: use environment variable or default
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    return 'http://localhost:3000';
  },
} as const;

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  // Production API paths
  collections: (language: string, type: 'data' | 'config', file: string) =>
    `${DOMAINS.PRODUCTION_API}/api/collections/${language}/${type}/${file}`,

  // Internal API routes
  contentProxy: (type: string) => `/api/content/${type}`,
  analyticsVisitor: () => '/api/analytics/visitor',

  // Language-specific config routes
  configRoute: (language: string, configType: string) =>
    `/api/config/${language}/${configType}`,
  manifestRoute: (language: string = DEFAULT_LANGUAGE) =>
    `/api/manifest/${language}`,

  // CDN paths
  cdnData: (file: string) =>
    `${DOMAINS.CDN}/api/collections/en/data/${file}`,
  cdnConfig: (file: string) =>
    `${DOMAINS.CDN}/api/collections/en/config/${file}`,
  cdnImage: (imagePath: string) =>
    `${DOMAINS.CDN}/api/image/${imagePath}`,

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
 *          → 'https://static-api-opal.vercel.app/collections/en/data/experience.json'
 */
export function getCollectionUrl(
  language: SupportedLanguage = DEFAULT_LANGUAGE,
  type: 'data' | 'config',
  file: string
): string {
  return API_ENDPOINTS.collections(language, type, file);
}

/**
 * Get full URL for CDN data
 * @example getCdnDataUrl('skills')
 *          → 'https://static.kuhandranchatbot.info/data/skills.json'
 */
export function getCdnDataUrl(file: string): string {
  return API_ENDPOINTS.cdnData(file);
}

/**
 * Get full URL for CDN image
 * @example getCdnImageUrl('profile.webp')
 *          → 'https://static.kuhandranchatbot.info/image/profile.webp'
 */
export function getCdnImageUrl(imagePath: string): string {
  return API_ENDPOINTS.cdnImage(imagePath);
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
 *          → 'http://localhost:3000' (dev) or 'https://example.vercel.app' (prod)
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
