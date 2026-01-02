/**
 * useLanguageContent Hook
 * Integrates with the language context to load language-specific content
 * Automatically handles language switching and content reloading
 */

'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useLanguage } from './useLanguageHook';
import {
  loadLanguageConfig,
  loadLanguageData,
  clearLanguageCache,
  getSafeLanguageCode,
  type SupportedLanguage,
} from '@/lib/utils/languageLoader';

interface UseLanguageContentOptions {
  preloadContent?: Array<'config' | 'data'>;
  configTypes?: Array<'urlConfig' | 'apiConfig' | 'pageLayout'>;
  dataTypes?: string[];
  clearCacheOnChange?: boolean;
}

export interface LanguageContentState {
  language: string;
  isLoading: boolean;
  error: string | null;
  loadConfig: (
    configType: 'urlConfig' | 'apiConfig' | 'pageLayout'
  ) => Promise<any>;
  loadData: (dataType: string) => Promise<any>;
  getConfig: (configType: 'urlConfig' | 'apiConfig' | 'pageLayout') => any;
  getData: (dataType: string) => any;
  reloadContent: () => Promise<void>;
}

/**
 * Hook to load and manage language-specific content
 * Automatically loads content when language changes
 * 
 * Example usage:
 * ```tsx
 * const { language, loadData, getData, isLoading } = useLanguageContent({
 *   dataTypes: ['projects', 'skills', 'experience'],
 *   configTypes: ['urlConfig', 'pageLayout'],
 * });
 * 
 * // Load specific data
 * const projects = await loadData('projects');
 * 
 * // Get cached data
 * const skills = getData('skills');
 * ```
 */
export function useLanguageContent(
  options: UseLanguageContentOptions = {}
): LanguageContentState {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedContent, setLoadedContent] = useState<{
    [key: string]: any;
  }>({});

  const {
    configTypes = [],
    dataTypes = [],
    clearCacheOnChange = true,
  } = options;

  const safeLanguageCode = useMemo(
    () => getSafeLanguageCode(language),
    [language]
  );

  // Load config and data files on mount and when language changes
  useEffect(() => {
    const loadAllContent = async () => {
      setIsLoading(true);
      setError(null);

      // Clear cache on language change if requested
      if (clearCacheOnChange && language) {
        clearLanguageCache();
      }

      try {
        const newContent = { ...loadedContent };

        // Load requested config files
        for (const configType of configTypes) {
          try {
            const config = await loadLanguageConfig(safeLanguageCode, configType);
            if (config) {
              newContent[configType] = config;
            }
          } catch (err) {
            console.warn(`Failed to load config ${configType}:`, err);
          }
        }

        // Load requested data files
        for (const dataType of dataTypes) {
          try {
            const data = await loadLanguageData(safeLanguageCode, dataType);
            if (data) {
              newContent[dataType] = data;
            }
          } catch (err) {
            console.warn(`Failed to load data ${dataType}:`, err);
          }
        }

        setLoadedContent(newContent);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load content';
        setError(errorMessage);
        console.error('Error loading language content:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (safeLanguageCode) {
      loadAllContent();
    }
  }, [safeLanguageCode, configTypes, dataTypes, clearCacheOnChange]);

  /**
   * Load a specific config file
   */
  const loadConfig = useCallback(
    async (configType: 'urlConfig' | 'apiConfig' | 'pageLayout') => {
      try {
        const config = await loadLanguageConfig(safeLanguageCode, configType);
        setLoadedContent((prev) => ({
          ...prev,
          [configType]: config,
        }));
        return config;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load config';
        setError(errorMessage);
        console.error(`Error loading config ${configType}:`, err);
        return null;
      }
    },
    [safeLanguageCode]
  );

  /**
   * Load a specific data file
   */
  const loadData = useCallback(
    async (dataType: string) => {
      try {
        const data = await loadLanguageData(safeLanguageCode, dataType);
        setLoadedContent((prev) => ({
          ...prev,
          [dataType]: data,
        }));
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        console.error(`Error loading data ${dataType}:`, err);
        return null;
      }
    },
    [safeLanguageCode]
  );

  /**
   * Get cached config without making a new request
   */
  const getConfig = useCallback(
    (configType: 'urlConfig' | 'apiConfig' | 'pageLayout') => {
      return loadedContent[configType] || null;
    },
    [loadedContent]
  );

  /**
   * Get cached data without making a new request
   */
  const getData = useCallback(
    (dataType: string) => {
      return loadedContent[dataType] || null;
    },
    [loadedContent]
  );

  /**
   * Reload all content for current language
   */
  const reloadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Clear cache and reload
      clearLanguageCache();

      const newContent = { ...loadedContent };

      for (const configType of configTypes) {
        try {
          const config = await loadLanguageConfig(safeLanguageCode, configType, {
            preferCache: false,
          });
          if (config) {
            newContent[configType] = config;
          }
        } catch (err) {
          console.warn(`Failed to reload config ${configType}:`, err);
        }
      }

      for (const dataType of dataTypes) {
        try {
          const data = await loadLanguageData(safeLanguageCode, dataType, {
            preferCache: false,
          });
          if (data) {
            newContent[dataType] = data;
          }
        } catch (err) {
          console.warn(`Failed to reload data ${dataType}:`, err);
        }
      }

      setLoadedContent(newContent);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to reload content';
      setError(errorMessage);
      console.error('Error reloading language content:', err);
    } finally {
      setIsLoading(false);
    }
  }, [safeLanguageCode, configTypes, dataTypes]);

  return {
    language: safeLanguageCode,
    isLoading,
    error,
    loadConfig,
    loadData,
    getConfig,
    getData,
    reloadContent,
  };
}

/**
 * Hook to load only config files
 * Useful when you only need configuration and not data
 */
export function useLanguageConfig(
  configTypes: Array<'urlConfig' | 'apiConfig' | 'pageLayout'> = []
): Omit<LanguageContentState, 'loadData' | 'getData'> & {
  getConfig: (
    configType: 'urlConfig' | 'apiConfig' | 'pageLayout'
  ) => any;
} {
  const content = useLanguageContent({
    configTypes,
    dataTypes: [],
  });

  return {
    language: content.language,
    isLoading: content.isLoading,
    error: content.error,
    loadConfig: content.loadConfig,
    getConfig: content.getConfig,
    reloadContent: content.reloadContent,
  };
}

/**
 * Hook to load only data files
 * Useful when you only need content data and not configuration
 */
export function useLanguageData(
  dataTypes: string[] = []
): Omit<LanguageContentState, 'loadConfig' | 'getConfig'> & {
  getData: (dataType: string) => any;
} {
  const content = useLanguageContent({
    configTypes: [],
    dataTypes,
  });

  return {
    language: content.language,
    isLoading: content.isLoading,
    error: content.error,
    loadData: content.loadData,
    getData: content.getData,
    reloadContent: content.reloadContent,
  };
}
