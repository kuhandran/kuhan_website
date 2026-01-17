/**
 * Language Content Loader
 * Loads language-specific content from the production API
 * Falls back to English (en) if requested language or file is not available
 * 
 * API Endpoints:
 * - Config: https://static.kuhandranchatbot.info/api/collections/{language}/config/{type}
 * - Data: https://static.kuhandranchatbot.info/api/collections/{language}/data/{type}
 */

import { getCollectionUrl } from '@/lib/config/domains';

const DEFAULT_LANGUAGE = 'en';
const LANGUAGE_CACHE: Record<string, Record<string, unknown>> = {};

interface LanguageLoaderOptions {
  languageCode?: string;
  preferCache?: boolean;
  fallbackLanguage?: string;
}

/**
 * Load configuration files from the API for a specific language
 * @param languageCode - Language code (e.g., 'en', 'ta', 'ar-AE')
 * @param configType - Config file type ('urlConfig', 'apiConfig', 'pageLayout')
 * @param options - Optional settings for caching and fallback
 * @returns Configuration object or null if not found
 * 
 * Example:
 * const urlConfig = await loadLanguageConfig('ta', 'urlConfig');
 * const pageLayout = await loadLanguageConfig('en', 'pageLayout');
 */
export async function loadLanguageConfig(
  languageCode: string = DEFAULT_LANGUAGE,
  configType: 'urlConfig' | 'apiConfig' | 'pageLayout',
  options: LanguageLoaderOptions = {}
): Promise<unknown> {
  const {
    preferCache = true,
    fallbackLanguage = DEFAULT_LANGUAGE,
  } = options;

  // Ensure fallback language is not the same as requested
  const actualFallback = fallbackLanguage !== languageCode ? fallbackLanguage : DEFAULT_LANGUAGE;

  try {
    // Check cache first if preferred
    if (preferCache && LANGUAGE_CACHE[languageCode]?.[configType]) {
      console.log(`✓ Cache hit: ${languageCode}/${configType}`);
      return LANGUAGE_CACHE[languageCode][configType];
    }

    console.log(`📖 Loading config: ${languageCode}/${configType}`);

    const url = getCollectionUrl(languageCode as 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ta' | 'ar-AE' | 'id' | 'my' | 'si' | 'th', 'config', configType);
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (response.ok) {
      const data = await response.json();
      // Extract 'data' field if present (API response wrapper)
      const content = data.data || data;
      
      // Cache the result
      if (!LANGUAGE_CACHE[languageCode]) {
        LANGUAGE_CACHE[languageCode] = {};
      }
      LANGUAGE_CACHE[languageCode][configType] = content;

      console.log(`✓ Loaded: ${languageCode}/${configType}`);
      return content;
    }

    // If the requested language fails and it's not the fallback, try fallback
    if (languageCode !== actualFallback) {
      console.warn(
        `⚠ Config not found for ${languageCode}/${configType}, falling back to ${actualFallback}`
      );
      return loadLanguageConfig(actualFallback, configType, {
        ...options,
        preferCache,
      });
    }

    console.error(`✗ Failed to load ${configType} for language ${languageCode}`);
    return null;
  } catch (error) {
    console.error(
      `✗ Error loading ${configType} for language ${languageCode}:`,
      error
    );

    // Try fallback
    if (languageCode !== actualFallback) {
      console.warn(
        `⚠ Error in ${languageCode}, falling back to ${actualFallback}`
      );
      return loadLanguageConfig(actualFallback, configType, options);
    }

    return null;
  }
}

/**
 * Load data files from the API for a specific language
 * @param languageCode - Language code (e.g., 'en', 'ta', 'ar-AE')
 * @param dataType - Data file type ('contentLabels', 'projects', 'experience', etc.)
 * @param options - Optional settings for caching and fallback
 * @returns Data object or null if not found
 * 
 * Example:
 * const projects = await loadLanguageData('ta', 'projects');
 * const skills = await loadLanguageData('en', 'skills');
 */
export async function loadLanguageData(
  languageCode: string = DEFAULT_LANGUAGE,
  dataType: string,
  options: LanguageLoaderOptions = {}
): Promise<unknown> {
  const {
    preferCache = true,
    fallbackLanguage = DEFAULT_LANGUAGE,
  } = options;

  // Ensure fallback language is not the same as requested
  const actualFallback = fallbackLanguage !== languageCode ? fallbackLanguage : DEFAULT_LANGUAGE;

  try {
    // Check cache first if preferred
    if (preferCache && LANGUAGE_CACHE[languageCode]?.[dataType]) {
      console.log(`✓ Cache hit: ${languageCode}/${dataType}`);
      return LANGUAGE_CACHE[languageCode][dataType];
    }

    console.log(`📊 Loading data: ${languageCode}/${dataType}`);

    const url = getCollectionUrl(languageCode as 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ta' | 'ar-AE' | 'id' | 'my' | 'si' | 'th', 'data', dataType);
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (response.ok) {
      const data = await response.json();
      // Extract 'data' field if present (API response wrapper)
      const content = data.data || data;

      // Cache the result
      if (!LANGUAGE_CACHE[languageCode]) {
        LANGUAGE_CACHE[languageCode] = {};
      }
      LANGUAGE_CACHE[languageCode][dataType] = content;

      console.log(`✓ Loaded: ${languageCode}/${dataType}`);
      return content;
    }

    // If the requested language fails and it's not the fallback, try fallback
    if (languageCode !== actualFallback) {
      console.warn(
        `⚠ Data not found for ${languageCode}/${dataType}, falling back to ${actualFallback}`
      );
      return loadLanguageData(actualFallback, dataType, {
        ...options,
        preferCache,
      });
    }

    console.error(`✗ Failed to load ${dataType} for language ${languageCode}`);
    return null;
  } catch (error) {
    console.error(
      `✗ Error loading ${dataType} for language ${languageCode}:`,
      error
    );

    // Try fallback
    if (languageCode !== actualFallback) {
      console.warn(
        `⚠ Error in ${languageCode}, falling back to ${actualFallback}`
      );
      return loadLanguageData(actualFallback, dataType, options);
    }

    return null;
  }
}

/**
 * Clear the language cache
 * Useful for refreshing content without restarting the app
 * @param languageCode - Optional: Only clear cache for a specific language
 */
export function clearLanguageCache(languageCode?: string): void {
  if (languageCode) {
    delete LANGUAGE_CACHE[languageCode];
    console.log(`🗑 Cleared cache for language: ${languageCode}`);
  } else {
    Object.keys(LANGUAGE_CACHE).forEach((lang) => {
      delete LANGUAGE_CACHE[lang];
    });
    console.log(`🗑 Cleared all language caches`);
  }
}

/**
 * Get all available languages from the collections folder
 * This checks which language folders exist in public/collections
 * @returns Array of available language codes
 */
export const SUPPORTED_LANGUAGES = [
  'en',
  'ar-AE',
  'es',
  'fr',
  'de',
  'hi',
  'id',
  'my',
  'si',
  'ta',
  'th',
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Validate if a language code is supported
 */
export function isSupportedLanguage(code: string): code is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(code as SupportedLanguage);
}

/**
 * Get the correct language code, validating it against supported languages
 * Falls back to default language if code is not supported
 */
export function getSafeLanguageCode(
  code: string,
  defaultLanguage: string = DEFAULT_LANGUAGE
): SupportedLanguage {
  if (isSupportedLanguage(code)) {
    return code;
  }
  
  if (isSupportedLanguage(defaultLanguage)) {
    return defaultLanguage;
  }

  return 'en';
}
