/**
 * Data Configuration & Environment Detection
 * Centralized utility for environment-aware data loading
 * Prevents hardcoded environment checks scattered throughout the codebase
 */

/**
 * Get the data source URL based on environment
 * Development: Loads from local /data/ folder
 * Production (deployed): Loads from CDN
 * Production (localhost): Loads from local /data/ folder for testing
 * @param filename - The JSON filename (e.g., 'projects.json', 'experience.json')
 * @returns The full URL to the data file
 */
export function getDataSourceUrl(filename: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  // Use local /data/ for development or localhost testing
  if (isDev || isLocalhost) {
    return `/data/${filename}`;
  }
  
  // Use CDN for production on kuhandranchatbot.info
  return `https://static.kuhandranchatbot.info/data/${filename}`;
}

/**
 * Check if running in development environment
 * @returns true if NODE_ENV is 'development'
 */
export function isDevelopmentEnv(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Get the CDN base URL for static assets
 * @returns CDN base URL
 */
export function getCdnBaseUrl(): string {
  return 'https://static.kuhandranchatbot.info';
}

/**
 * Get the data base URL
 * Development: /data (local public/data folder)
 * Production: https://static.kuhandranchatbot.info/data
 * @returns Data base URL
 */
export function getDataBaseUrl(): string {
  const isDev = isDevelopmentEnv();
  return isDev ? '/data' : `${getCdnBaseUrl()}/data`;
}
