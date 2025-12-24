/**
 * Content Labels
 * Loaded from: https://static.kuhandranchatbot.info/data/contentLabels.json
 * Falls back to: /data/defaultContentLabels.json
 * All UI labels, headers, descriptions organized hierarchically
 */

import React from 'react';
import { getErrorMessageSync } from '../../lib/config/appConfig';

const CDN_URL = 'https://static.kuhandranchatbot.info/data/contentLabels.json';
const FALLBACK_URL = '/data/defaultContentLabels.json';

let cachedLabels: any = null;
let labelsFetchPromise: Promise<any> | null = null;
let defaultLabelsData: any = null;

// Load default labels from local JSON file
const loadDefaultLabels = async () => {
  if (defaultLabelsData) return defaultLabelsData;
  
  try {
    const response = await fetch(FALLBACK_URL);
    if (!response.ok) throw new Error(getErrorMessageSync('data.defaultLabels', 'Failed to load default labels'));
    defaultLabelsData = await response.json();
    return defaultLabelsData;
  } catch (error) {
    console.warn(getErrorMessageSync('warnings.defaultLabels'), error);
    defaultLabelsData = {};
    return defaultLabelsData;
  }
};

const fetchContentLabels = async () => {
  // Return cached data if available
  if (cachedLabels) return cachedLabels;
  
  // Return existing fetch promise if one is already in progress
  if (labelsFetchPromise) return labelsFetchPromise;
  
  // Create new fetch promise
  labelsFetchPromise = (async () => {
    try {
      const response = await fetch(CDN_URL);
      if (!response.ok) {
        throw new Error(getErrorMessageSync('data.contentLabels', 'Failed to fetch content labels'));
      }
      cachedLabels = await response.json();
      return cachedLabels;
    } catch (error) {
      console.error(getErrorMessageSync('data.contentLabels'), error);
      // Fall back to default labels from file
      cachedLabels = await loadDefaultLabels();
      return cachedLabels;
    } finally {
      labelsFetchPromise = null;
    }
  })();
  
  return labelsFetchPromise;
};

export const useContentLabels = () => {
  const [contentLabels, setContentLabels] = React.useState(cachedLabels || null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchContentLabels()
      .then((data) => setContentLabels(data))
      .catch((err) => setError(err));
  }, []);

  return { contentLabels, error };
};

/**
 * Export static labels for SSR and non-hook usage
 * These will be populated when the app initializes
 */
export const getStaticContentLabels = () => {
  return cachedLabels || {};
};

/**
 * Initialize labels (call during app startup for SSR)
 */
export async function initializeContentLabels() {
  return fetchContentLabels();
}

/**
 * Helper function to get label by path
 * Usage: getLabel('hero.greeting') -> "Hi, I'm Kuhandran"
 */
export const getLabel = (path: string, defaultValue?: string): string => {
  const keys = path.split('.');
  let value: any = cachedLabels;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue || path;
    }
  }

  return typeof value === 'string' ? value : defaultValue || path;
};

// Export default for backward compatibility
// Type as 'any' to avoid strict type checking issues with CDN-loaded data
const contentLabels: any = cachedLabels || {};
export { contentLabels };
export default contentLabels;
