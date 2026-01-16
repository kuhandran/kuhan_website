/**
 * Configuration Loaders
 * Consolidated module for loading all configuration files
 * Includes: URL config, error messages, page layout, API config, and data source utilities
 * 
 * Supports both client and server-side rendering with caching
 */

import { DEFAULT_LANGUAGE, DATA_FILES, getConfigRouteUrl, getCollectionUrl } from './domains';

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

let cachedUrlConfig: any = null;
let cachedErrorMessages: any = null;
let cachedPageLayout: any = null;
let cachedApiConfig: any = null;

let urlConfigPromise: Promise<any> | null = null;
let errorMessagesPromise: Promise<any> | null = null;
let pageLayoutPromise: Promise<any> | null = null;
let apiConfigPromise: Promise<any> | null = null;

// ============================================================================
// URL CONFIGURATION
// ============================================================================

/**
 * Load URL configuration from language-specific endpoint
 * Contains all service URLs, domains, paths, and CSP configuration
 */
export async function loadUrlConfig(language: string = DEFAULT_LANGUAGE): Promise<any> {
  if (cachedUrlConfig) return cachedUrlConfig;
  if (urlConfigPromise) return urlConfigPromise;

  urlConfigPromise = (async () => {
    try {
      const urlConfigUrl = getConfigRouteUrl(language as any, DATA_FILES.urlConfig);
      const response = await fetch(urlConfigUrl);
      if (!response.ok) throw new Error('Failed to load URL config');
      cachedUrlConfig = await response.json();
      return cachedUrlConfig;
    } catch (error) {
      console.error('Error loading URL config:', error);
      urlConfigPromise = null;
      return {};
    }
  })();

  return urlConfigPromise;
}

/**
 * Get cached URL config (synchronous) - returns empty object if not yet loaded
 */
export function getUrlConfigSync(): any {
  return cachedUrlConfig || {};
}

/**
 * Get specific URL from config
 * Usage: getUrl('fullUrls.contactForm') -> "https://..."
 */
export async function getUrl(path: string): Promise<string> {
  const config = await loadUrlConfig();
  const keys = path.split('.');
  let value: any = config;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`URL path not found: ${path}`);
      return '';
    }
  }

  return typeof value === 'string' ? value : '';
}

/**
 * Get URL synchronously (uses cached data)
 */
export function getUrlSync(path: string, defaultUrl?: string): string {
  const config = getUrlConfigSync();
  if (!config || Object.keys(config).length === 0) {
    return defaultUrl || '';
  }

  const keys = path.split('.');
  let value: any = config;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultUrl || '';
    }
  }

  return typeof value === 'string' ? value : defaultUrl || '';
}

// ============================================================================
// ERROR MESSAGES
// ============================================================================

/**
 * Load error messages from external JSON file
 * Contains all application error messages for easy multi-language support
 */
export async function loadErrorMessages(): Promise<any> {
  if (cachedErrorMessages) return cachedErrorMessages;
  if (errorMessagesPromise) return errorMessagesPromise;

  errorMessagesPromise = (async () => {
    try {
      const errorMessagesUrl = `/data/${DATA_FILES.errorMessages}.json`;
      const response = await fetch(errorMessagesUrl);
      if (!response.ok) throw new Error('Failed to load error messages');
      cachedErrorMessages = await response.json();
      return cachedErrorMessages;
    } catch (error) {
      console.error('Error loading error messages:', error);
      errorMessagesPromise = null;
      return {};
    }
  })();

  return errorMessagesPromise;
}

/**
 * Get cached error messages (synchronous) - returns empty object if not yet loaded
 */
export function getErrorMessagesSync(): any {
  return cachedErrorMessages || {};
}

/**
 * Get specific error message from config
 * Usage: getErrorMessage('contact.validation.missingFields') -> "All fields are required"
 */
export async function getErrorMessage(path: string, defaultMessage?: string): Promise<string> {
  const messages = await loadErrorMessages();
  const keys = path.split('.');
  let value: any = messages;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Error message path not found: ${path}`);
      return defaultMessage || path;
    }
  }

  return typeof value === 'string' ? value : defaultMessage || path;
}

/**
 * Get error message synchronously (uses cached data)
 */
export function getErrorMessageSync(path: string, defaultMessage?: string): string {
  const messages = getErrorMessagesSync();
  if (!messages || Object.keys(messages).length === 0) {
    return defaultMessage || path;
  }

  const keys = path.split('.');
  let value: any = messages;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultMessage || path;
    }
  }

  return typeof value === 'string' ? value : defaultMessage || path;
}

// ============================================================================
// PAGE LAYOUT CONFIGURATION
// ============================================================================

/**
 * Fetch page layout configuration from static API or local files
 */
export async function fetchPageLayout() {
  if (cachedPageLayout) return cachedPageLayout;
  if (pageLayoutPromise) return pageLayoutPromise;

  pageLayoutPromise = (async () => {
    try {
      // Try local file first (server-side)
      if (typeof window === 'undefined') {
        try {
          const fs = await import('fs/promises');
          const path = await import('path');
          const filePath = path.join(process.cwd(), 'public', 'collections', DEFAULT_LANGUAGE, 'config', 'pageLayout.json');
          const fileContent = await fs.readFile(filePath, 'utf-8');
          cachedPageLayout = JSON.parse(fileContent);
          console.log('[Loaders] pageLayout loaded from local file');
          pageLayoutPromise = null;
          return cachedPageLayout;
        } catch (fileError) {
          console.warn('[Loaders] Local pageLayout file not found, trying API');
        }
      }

      // Fallback to API
      const url = getDataSourceUrl('pageLayout.json', DEFAULT_LANGUAGE, 'config');
      const response = await fetch(url);
      if (!response.ok) throw new Error(getErrorMessageSync('data.httpError', `HTTP error! status: ${response.status}`));
      cachedPageLayout = await response.json();
      pageLayoutPromise = null;
      return cachedPageLayout;
    } catch (error) {
      console.error('Failed to fetch pageLayout:', error);
      pageLayoutPromise = null;
      return { sections: [] };
    }
  })();

  return pageLayoutPromise;
}

/**
 * Get cached page layout (must call fetchPageLayout first)
 */
export function getPageLayoutSync() {
  return cachedPageLayout || { sections: [] };
}

// ============================================================================
// API CONFIGURATION
// ============================================================================

/**
 * Fetch API configuration from static API
 */
export async function fetchApiConfig() {
  if (cachedApiConfig) return cachedApiConfig;
  if (apiConfigPromise) return apiConfigPromise;

  apiConfigPromise = (async () => {
    try {
      const url = getDataSourceUrl('apiConfig.json', DEFAULT_LANGUAGE, 'config');
      const response = await fetch(url);
      if (!response.ok) throw new Error(getErrorMessageSync('data.httpError', `HTTP error! status: ${response.status}`));
      cachedApiConfig = await response.json();
      apiConfigPromise = null;
      return cachedApiConfig;
    } catch (error) {
      console.error(getErrorMessageSync('data.apiConfig'), error);
      apiConfigPromise = null;
      return {
        baseUrl: '',
        endpoints: {
          contact: '',
          chatbot: '',
        },
      };
    }
  })();

  return apiConfigPromise;
}

/**
 * Get cached API config (must call fetchApiConfig first)
 */
export function getApiConfigSync() {
  return cachedApiConfig || {};
}

// ============================================================================
// DATA SOURCE URL UTILITIES
// ============================================================================

/**
 * Get data source URL - Uses production API with language code
 * @param filename - The JSON filename (e.g., 'experience.json')
 * @param languageCode - Language code (e.g., 'en', 'ta', 'ar-AE'). Defaults to 'en'
 * @param fileType - Type of file: 'data' or 'config'. Defaults to 'data'
 * @returns The full URL to the API endpoint
 * 
 * Examples:
 * - getDataSourceUrl('contentLabels.json', 'en', 'data')
 *   → https://static-api-opal.vercel.app/collections/en/data/contentLabels.json
 * - getDataSourceUrl('apiConfig.json', 'ta', 'config')
 *   → https://static-api-opal.vercel.app/collections/ta/config/apiConfig.json
 */
export function getDataSourceUrl(
  filename: string,
  languageCode: string = DEFAULT_LANGUAGE,
  fileType: 'data' | 'config' = 'data'
): string {
  // Remove .json extension if present for cleaner URL construction
  const cleanFilename = filename.replace('.json', '');
  
  // Use centralized getCollectionUrl from domains config
  return getCollectionUrl(languageCode as any, fileType, cleanFilename);
}

/**
 * Get multilingual data URL for a specific file type and language
 * @param fileType - File type without extension (e.g., 'experience', 'projects', 'contentLabels')
 * @param languageCode - Language code (e.g., 'en', 'ta', 'ar-AE'). Defaults to 'en'
 * @returns The full URL to the data file
 * 
 * Examples:
 * - getMultilingualUrl('experience', 'en')
 *   → https://static-api-opal.vercel.app/collections/en/data/experience.json
 * - getMultilingualUrl('contentLabels', 'ar-AE')
 *   → https://static-api-opal.vercel.app/collections/ar-AE/data/contentLabels.json
 */
export function getMultilingualUrl(
  fileType: string,
  languageCode: string = DEFAULT_LANGUAGE
): string {
  return getDataSourceUrl(`${fileType}.json`, languageCode, 'data');
}

/**
 * Get config file URL for a specific language
 * Uses local dynamic API route for development/production
 * @param configName - Config name without extension (e.g., 'apiConfig', 'pageLayout')
 * @param languageCode - Language code (e.g., 'en', 'ta'). Defaults to 'en'
 * @returns The full URL to the config file
 * 
 * Examples:
 * - getConfigUrl('apiConfig', 'en')
 *   → /api/config/en/apiConfig
 * - getConfigUrl('pageLayout', 'ta')
 *   → /api/config/ta/pageLayout
 */
export function getConfigUrl(
  configName: string,
  languageCode: string = DEFAULT_LANGUAGE
): string {
  // Use local dynamic API route instead of external API
  return `/api/config/${languageCode}/${configName}`;
}

// ============================================================================
// APP INITIALIZATION
// ============================================================================

/**
 * Initialize app config (call during app startup)
 */
export async function initializeAppConfig(): Promise<void> {
  await Promise.all([loadUrlConfig(), loadErrorMessages()]);
}

// ============================================================================
// API BASE URL
// ============================================================================

/**
 * Get API base URL for data requests
 * @returns Base URL for production API
 */
export function getApiBaseUrl(): string {
  return 'https://static.kuhandranchatbot.info';
}
