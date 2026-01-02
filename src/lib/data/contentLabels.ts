/**
 * Content Labels
 * Loaded from: CDN (https://static.kuhandranchatbot.info/data/contentLabels.json)
 * Falls back to: Local file (/data/defaultContentLabels.json)
 * All UI labels, headers, descriptions organized hierarchically
 * 
 * ⚠️ Domains are now centralized in src/config/domains.ts
 */

import React from 'react';
import { getErrorMessageSync } from '@/lib/config/loaders';
import { fetchContentLabels as fetchContentLabelsAPI } from '@/lib/api/apiClient';
import { SupportedLanguage, DEFAULT_LANGUAGE } from '@/lib/config/domains';
import { useLanguage } from '@/lib/hooks/useLanguageHook';

interface ContentLabelsData {
  [key: string]: any;
}

let cachedLabels: ContentLabelsData = {};
let defaultLabelsData: ContentLabelsData | null = null;

// Load default labels from local JSON file
const loadDefaultLabels = async (): Promise<ContentLabelsData> => {
  if (defaultLabelsData) return defaultLabelsData;
  
  try {
    defaultLabelsData = {};
    return defaultLabelsData;
  } catch (error) {
    defaultLabelsData = {};
    return defaultLabelsData;
  }
};

export const useContentLabels = () => {
  const { language } = useLanguage();
  const [contentLabels, setContentLabels] = React.useState<ContentLabelsData | null>(cachedLabels || null);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const loadLabels = async () => {
      try {
        console.log(`[ContentLabels] Loading content labels for language: ${language}`);
        const data = await fetchContentLabelsAPI(language as SupportedLanguage);
        if (data) {
          cachedLabels = data;
          setContentLabels(data);
          console.log(`[ContentLabels] Successfully loaded for language: ${language}`);
        } else {
          throw new Error('Failed to fetch content labels');
        }
      } catch (err) {
        console.error(`[ContentLabels] Error loading for language ${language}:`, err);
        const defaultData = await loadDefaultLabels();
        cachedLabels = defaultData;
        setContentLabels(defaultData);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    loadLabels();
  }, [language]); // Re-fetch when language changes

  return { contentLabels, error };
};

/**
 * Export static labels for SSR and non-hook usage
 * These will be populated when the app initializes
 */
export const getStaticContentLabels = (): ContentLabelsData => {
  return cachedLabels || {};
};

/**
 * Initialize labels (call during app startup for SSR)
 */
export async function initializeContentLabels(language: SupportedLanguage = DEFAULT_LANGUAGE): Promise<ContentLabelsData> {
  try {
    const data = await fetchContentLabelsAPI(language);
    if (data) {
      cachedLabels = data;
      return data;
    }
  } catch (error) {
    console.error('Error initializing content labels:', error);
  }
  return {};
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
export { cachedLabels as contentLabels };
export default cachedLabels;
