/**
 * Data Configuration & Environment Detection
 * Centralized utility for multilingual API-aware data loading
 * Constructs URLs based on language code and file type
 * Production API: https://static-api-opal.vercel.app/api
 */

const API_BASE = 'https://static-api-opal.vercel.app/api';
const DEFAULT_LANGUAGE = 'en';

/**
 * Get data source URL - Uses production API with language code
 * @param filename - The JSON filename (e.g., 'experience.json')
 * @param languageCode - Language code (e.g., 'en', 'ta', 'ar-AE'). Defaults to 'en'
 * @param fileType - Type of file: 'data' or 'config'. Defaults to 'data'
 * @returns The full URL to the API endpoint
 * 
 * Examples:
 * - getDataSourceUrl('contentLabels.json', 'en', 'data')
 *   → https://static-api-opal.vercel.app/api/collections/en/data/contentLabels.json
 * - getDataSourceUrl('apiConfig.json', 'ta', 'config')
 *   → https://static-api-opal.vercel.app/api/collections/ta/config/apiConfig.json
 */
export function getDataSourceUrl(
  filename: string,
  languageCode: string = DEFAULT_LANGUAGE,
  fileType: 'data' | 'config' = 'data'
): string {
  // Remove .json extension if present for cleaner URL construction
  const cleanFilename = filename.replace('.json', '');
  
  // Construct the production API URL with language code
  return `${API_BASE}/collections/${languageCode}/${fileType}/${cleanFilename}.json`;
}

/**
 * Get multilingual data URL for a specific file type and language
 * @param fileType - File type without extension (e.g., 'experience', 'projects', 'contentLabels')
 * @param languageCode - Language code (e.g., 'en', 'ta', 'ar-AE'). Defaults to 'en'
 * @returns The full URL to the data file
 * 
 * Examples:
 * - getMultilingualUrl('experience', 'en')
 *   → https://static-api-opal.vercel.app/api/collections/en/data/experience.json
 * - getMultilingualUrl('contentLabels', 'ar-AE')
 *   → https://static-api-opal.vercel.app/api/collections/ar-AE/data/contentLabels.json
 */
export function getMultilingualUrl(
  fileType: string,
  languageCode: string = DEFAULT_LANGUAGE
): string {
  return getDataSourceUrl(`${fileType}.json`, languageCode, 'data');
}

/**
 * Get config file URL for a specific language
 * @param configName - Config name without extension (e.g., 'apiConfig', 'pageLayout')
 * @param languageCode - Language code (e.g., 'en', 'ta'). Defaults to 'en'
 * @returns The full URL to the config file
 * 
 * Examples:
 * - getConfigUrl('apiConfig', 'en')
 *   → https://static-api-opal.vercel.app/api/collections/en/config/apiConfig.json
 * - getConfigUrl('pageLayout', 'ta')
 *   → https://static-api-opal.vercel.app/api/collections/ta/config/pageLayout.json
 */
export function getConfigUrl(
  configName: string,
  languageCode: string = DEFAULT_LANGUAGE
): string {
  return getDataSourceUrl(`${configName}.json`, languageCode, 'config');
}

/**
 * Get API base URL
 * @returns API base URL
 */
export function getApiBaseUrl(): string {
  return API_BASE;
}

/**
 * Check if running in development environment
 * @returns true if NODE_ENV is 'development'
 */
export function isDevelopmentEnv(): boolean {
  return process.env.NODE_ENV === 'development';
}
