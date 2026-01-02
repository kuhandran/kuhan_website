/**
 * Configuration Index
 * Central export point for all configuration modules
 * Provides clean imports from @/lib/config or @/config/domains
 */

// Re-export from domains
export {
  DOMAINS,
  API_ENDPOINTS,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  DATA_FILES,
  IMAGE_ASSETS,
  getCollectionUrl,
  getCdnDataUrl,
  getCdnImageUrl,
  getLocalImageUrl,
  getIpGeolocationUrl,
  getContentProxyUrl,
  getAppUrl,
  getConfigRouteUrl,
  getManifestUrl,
  type SupportedLanguage,
} from './domains';

// Re-export from loaders
export {
  loadUrlConfig,
  getUrlConfigSync,
  getUrl,
  getUrlSync,
  loadErrorMessages,
  getErrorMessagesSync,
  getErrorMessage,
  getErrorMessageSync,
  fetchPageLayout,
  getPageLayoutSync,
  fetchApiConfig,
  getApiConfigSync,
  getDataSourceUrl,
  getMultilingualUrl,
  getConfigUrl,
  initializeAppConfig,
} from './loaders';

// Re-export from types
export type {
  PageLayoutConfig,
  SectionConfig,
  ElementConfig,
  ComponentType,
  FormInputConfig,
  FormButtonConfig,
  ProjectCardProps,
  TimelineItemProps,
  SkillBarProps,
  StatCardProps,
  AchievementCardProps,
  EducationCardProps,
} from './types';

// Re-export from language config
export {
  fetchLanguagesConfig,
  getDefaultLanguagesConfig,
  getCompletedLanguages,
  getLanguageByCode,
  fetchLocaleData,
  detectBrowserLanguage,
  type LanguageInfo,
  type LanguagesConfig,
} from './languageConfig';

// Re-export from page layout
export {
  getPageLayoutConfig,
  getPageLayoutConfigSync,
} from './pageLayout';

// Re-export from component registry
export {
  sectionRegistry,
  componentRegistry,
  createComponentRegistry,
  getSectionComponent,
  getElementComponent,
  type ComponentRegistry,
} from './componentRegistry';

// Re-export from image config
export {
  CDN_BASE_URL,
  IMAGES_CDN,
  DATA_CDN,
  getImageUrl,
} from './imageConfig';
