/**
 * Language Configuration Loader
 * Fetches language data from production API
 * Supports dynamic language list and configurations
 */

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  variants?: string[];
  status: 'completed' | 'pending';
  lastUpdated: string | null;
}

export interface LanguagesConfig {
  languages: LanguageInfo[];
  defaultLanguage: string;
  fallbackLanguage: string;
  supportedLocales: number;
  completedLocales: number;
  fileTypes: string[];
  apiEndpoints: Record<string, string>;
}

// Cache the languages config
let cachedLanguagesConfig: LanguagesConfig | null = null;
let languagesConfigPromise: Promise<LanguagesConfig | null> | null = null;

/**
 * Fetch languages configuration from API
 * Falls back to local config if API is unavailable
 */
export async function fetchLanguagesConfig(): Promise<LanguagesConfig | null> {
  if (cachedLanguagesConfig) {
    return cachedLanguagesConfig;
  }

  if (languagesConfigPromise) {
    return languagesConfigPromise;
  }

  languagesConfigPromise = (async () => {
    try {
      // Try to fetch from production API first
      const { getInfoFromAPI } = await import('@/lib/api');
      const response = await getInfoFromAPI<{ data?: LanguagesConfig } | LanguagesConfig>(
        'GET',
        'api/config/languages',
        undefined,
        true
      );
      
      // Extract data from API response wrapper
      const result = (response && 'data' in response ? response.data : response) as LanguagesConfig | undefined;
      
      if (result && result.languages) {
        cachedLanguagesConfig = result;
        return cachedLanguagesConfig;
      }

      console.warn('Failed to fetch languages from API, falling back to local config');
      
      // Fallback to local config
      return getDefaultLanguagesConfig();
    } catch (error) {
      console.error('Error fetching languages config:', error);
      languagesConfigPromise = null;
      return getDefaultLanguagesConfig();
    }
  })();

  return languagesConfigPromise;
}

/**
 * Get default fallback language configuration
 * Used when API is unavailable
 */
export function getDefaultLanguagesConfig(): LanguagesConfig {
  return {
    languages: [
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇬🇧',
        region: 'Global',
        status: 'completed',
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      {
        code: 'ar-AE',
        name: 'Arabic',
        nativeName: 'العربية',
        flag: '🇦🇪',
        region: 'Middle East',
        status: 'completed',
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        flag: '🇪🇸',
        region: 'Europe',
        status: 'completed',
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        region: 'Europe',
        status: 'completed',
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      {
        code: 'hi',
        name: 'Hindi',
        nativeName: 'हिन्दी',
        flag: '🇮🇳',
        region: 'South Asia',
        status: 'completed',
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      {
        code: 'id',
        name: 'Indonesian',
        nativeName: 'Bahasa Indonesia',
        flag: '🇮🇩',
        region: 'Southeast Asia',
        status: 'completed',
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      {
        code: 'ta',
        name: 'Tamil',
        nativeName: 'தமிழ்',
        flag: '🇮🇳',
        region: 'South Asia',
        status: 'completed',
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      {
        code: 'th',
        name: 'Thai',
        nativeName: 'ไทย',
        flag: '🇹🇭',
        region: 'Southeast Asia',
        status: 'completed',
        lastUpdated: new Date().toISOString().split('T')[0],
      },
    ],
    defaultLanguage: 'en',
    fallbackLanguage: 'en',
    supportedLocales: 8,
    completedLocales: 8,
    fileTypes: [
      'contentLabels',
      'projects',
      'experience',
      'skills',
      'education',
      'achievements',
    ],
    apiEndpoints: {
      listLanguages: 'GET /api/config/languages',
      getLocaleData: 'GET /api/collections/:language/:type/:file',
    },
  };
}

/**
 * Get only completed languages
 */
export async function getCompletedLanguages(): Promise<LanguageInfo[]> {
  const config = await fetchLanguagesConfig();
  return config?.languages.filter((lang) => lang.status === 'completed') || [];
}

/**
 * Get language by code
 */
export async function getLanguageByCode(
  code: string
): Promise<LanguageInfo | undefined> {
  const config = await fetchLanguagesConfig();
  return config?.languages.find((lang) => lang.code === code);
}

/**
 * Fetch multilingual content from API
 * @param languageCode - Language code (e.g., 'en', 'ta', 'ar-AE')
 * @param fileType - File type (e.g., 'contentLabels', 'projects')
 */
export async function fetchLocaleData(
  languageCode: string,
  fileType: string
): Promise<Record<string, unknown> | null> {
  try {
    const { getCollection } = await import('@/lib/api');
    const result = await getCollection<Record<string, unknown>>(
      `${fileType}`,
      'data',
      languageCode as 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ta' | 'ar-AE' | 'id' | 'my' | 'si' | 'th'
    );
    
    if (!result) {
      console.warn(
        `Failed to fetch ${fileType} for language ${languageCode}`
      );
      return null;
    }

    return result;
  } catch (error) {
    console.error(
      `Error fetching locale data for ${languageCode}/${fileType}:`,
      error
    );
    return null;
  }
}

/**
 * Get browser's preferred language code from languages config
 */
export async function detectBrowserLanguage(): Promise<string> {
  const config = await fetchLanguagesConfig();
  
  if (!config) {
    return 'en';
  }

  const browserLang = navigator.language || 'en';
  const completedLanguages = config.languages
    .filter((lang) => lang.status === 'completed')
    .map((lang) => lang.code);

  // Try exact match
  if (completedLanguages.includes(browserLang)) {
    return browserLang;
  }

  // Try language code without region (e.g., 'en' from 'en-US')
  const baseLanguage = browserLang.split('-')[0];
  const matchedLang = completedLanguages.find((code) =>
    code.startsWith(baseLanguage)
  );

  return matchedLang || config.defaultLanguage || 'en';
}
