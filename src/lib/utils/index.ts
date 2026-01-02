/**
 * Utils Index
 * Central export point for all utility functions
 */

export {
  loadLanguageConfig,
  loadLanguageData,
  clearLanguageCache,
  getSafeLanguageCode,
  isSupportedLanguage,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from './languageLoader';

export {
  getMultilingualContent,
  getContentLabels,
  getProjects,
  getExperience,
  getSkills,
  getEducation,
  getAchievements,
  getApiConfig,
  getPageLayout,
  clearContentCache,
  prefetchLanguageContent,
} from './contentLoader';
