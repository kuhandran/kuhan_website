/**
 * Configuration Loader
 * Fetches configuration files from local cache first, then CDN
 * This ensures faster loading times
 */

import { getErrorMessageSync } from './appConfig';

const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_BASE_URL || 'https://static-api-opal.vercel.app/api/config';
const LOCAL_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_BASE_URL || '/config';

let pageLayoutCache: any = null;
let apiConfigCache: any = null;

/**
 * Fetch page layout configuration - tries local first for faster loading
 */
export async function fetchPageLayout() {
  if (pageLayoutCache) return pageLayoutCache;

  try {
    // Try local first (faster)
    try {
      const localResponse = await fetch(`${LOCAL_BASE_URL}/pageLayout.json`);
      if (localResponse.ok) {
        pageLayoutCache = await localResponse.json();
        return pageLayoutCache;
      }
    } catch (localError) {
      // Local failed, try CDN
    }

    // Fall back to CDN
    const cdnResponse = await fetch(`${CDN_BASE_URL}/pageLayout.json`);
    if (!cdnResponse.ok) throw new Error(getErrorMessageSync('data.httpError', `HTTP error! status: ${cdnResponse.status}`));
    pageLayoutCache = await cdnResponse.json();
    return pageLayoutCache;
  } catch (error) {
    return { sections: [] };
  }
}

/**
 * Fetch API configuration - tries local first for faster loading
 */
export async function fetchApiConfig() {
  if (apiConfigCache) return apiConfigCache;

  try {
    // Try local first (faster)
    try {
      const localResponse = await fetch(`${LOCAL_BASE_URL}/apiConfig.json`);
      if (localResponse.ok) {
        apiConfigCache = await localResponse.json();
        return apiConfigCache;
      }
    } catch (localError) {
      // Local failed, try CDN
    }

    // Fall back to CDN
    const cdnResponse = await fetch(`${CDN_BASE_URL}/apiConfig.json`);
    if (!cdnResponse.ok) throw new Error(getErrorMessageSync('data.httpError', `HTTP error! status: ${cdnResponse.status}`));
    apiConfigCache = await cdnResponse.json();
    return apiConfigCache;
  } catch (error) {
    console.error(getErrorMessageSync('data.apiConfig'), error);
    return {
      baseUrl: '',
      endpoints: {
        contact: '',
        chatbot: '',
      },
    };
  }
}

/**
 * Get cached page layout (must call fetchPageLayout first)
 */
export function getPageLayoutSync() {
  return pageLayoutCache || { sections: [] };
}

/**
 * Get cached API config (must call fetchApiConfig first)
 */
export function getApiConfigSync() {
  return apiConfigCache || {};
}
