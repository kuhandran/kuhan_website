/**
 * Language Content Loader
 * Dynamically loads language-specific content from public/collections/{languageCode}
 * Falls back to English (en) if requested language or file is not available
 * 
 * Directory structure:
 * public/collections/
 *   ├── en/
 *   ├── es/
 *   ├── fr/
 *   ├── de/
 *   ├── hi/
 *   ├── ta/
 *   ├── ar-AE/
 *   └── {languageCode}/
 *       ├── config/
 *       │   ├── urlConfig.json
 *       │   ├── apiConfig.json
 *       │   └── pageLayout.json
 *       └── data/
 *           ├── contentLabels.json
 *           ├── projects.json
 *           ├── experience.json
 *           ├── skills.json
 *           ├── education.json
 *           └── achievements.json
 */

const DEFAULT_LANGUAGE = 'en';
const LANGUAGE_CACHE: { [key: string]: { [key: string]: any } } = {};

interface LanguageLoaderOptions {
  languageCode?: string;
  preferCache?: boolean;
  fallbackLanguage?: string;
}

/**
 * Validates if a language code is available in the collections
 */
async function validateLanguageExists(
  languageCode: string
): Promise<boolean> {
  try {
    // Try to fetch a config file to validate language exists
    const response = await fetch(
      `/public/collections/${languageCode}/config/pageLayout.json`,
      { next: { revalidate: 3600 } }
    );
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Load configuration files from a specific language folder
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
): Promise<any> {
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

    // Normalize language code for file path
    const normalizedLanguage = languageCode.toLowerCase();
    const configFileName = `${configType}.json`;
    const configPath = `/public/collections/${normalizedLanguage}/config/${configFileName}`;

    console.log(`📖 Loading config: ${configPath}`);

    const response = await fetch(configPath, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (response.ok) {
      const data = await response.json();
      
      // Cache the result
      if (!LANGUAGE_CACHE[languageCode]) {
        LANGUAGE_CACHE[languageCode] = {};
      }
      LANGUAGE_CACHE[languageCode][configType] = data;

      console.log(`✓ Loaded: ${languageCode}/${configType}`);
      return data;
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
 * Load data files from a specific language folder
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
): Promise<any> {
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

    // Normalize language code and data type for file path
    const normalizedLanguage = languageCode.toLowerCase();
    const normalizedDataType = dataType.toLowerCase();
    const dataFileName = `${normalizedDataType}.json`;
    const dataPath = `/public/collections/${normalizedLanguage}/data/${dataFileName}`;

    console.log(`📊 Loading data: ${dataPath}`);

    const response = await fetch(dataPath, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (response.ok) {
      const data = await response.json();

      // Cache the result
      if (!LANGUAGE_CACHE[languageCode]) {
        LANGUAGE_CACHE[languageCode] = {};
      }
      LANGUAGE_CACHE[languageCode][dataType] = data;

      console.log(`✓ Loaded: ${languageCode}/${dataType}`);
      return data;
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
