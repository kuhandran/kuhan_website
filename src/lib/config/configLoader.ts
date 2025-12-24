/**
 * Configuration Loader
 * Fetches configuration files from CDN with caching
 */

import { getErrorMessageSync } from './appConfig';

const CDN_BASE_URL = 'https://static.kuhandranchatbot.info/config';

let pageLayoutCache: any = null;
let apiConfigCache: any = null;

/**
 * Fetch page layout configuration from CDN
 */
export async function fetchPageLayout() {
  if (pageLayoutCache) return pageLayoutCache;

  try {
    const response = await fetch(`${CDN_BASE_URL}/pageLayout.json`);
    if (!response.ok) throw new Error(getErrorMessageSync('data.httpError', `HTTP error! status: ${response.status}`));
    pageLayoutCache = await response.json();
    return pageLayoutCache;
  } catch (error) {
    console.error(getErrorMessageSync('data.pageLayout'), error);
    return { sections: [] };
  }
}

/**
 * Fetch API configuration from CDN
 */
export async function fetchApiConfig() {
  if (apiConfigCache) return apiConfigCache;

  try {
    const response = await fetch(`${CDN_BASE_URL}/apiConfig.json`);
    if (!response.ok) throw new Error(getErrorMessageSync('data.httpError', `HTTP error! status: ${response.status}`));
    apiConfigCache = await response.json();
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
