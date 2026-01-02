/**
 * API Client Index
 * Central export point for all API functions
 * Provides backward compatibility with old apiClient.ts structure
 */

// Re-export everything from modular files
export {
  // Cache utilities (legacy)
  clearApiCache,
  clearLanguageCache,
  isCacheValid,
  getFromCache,
  setInCache,
} from './cache-legacy';

export {
  // Configuration fetchers
  fetchConfig,
  fetchApiConfig,
  fetchPageLayout,
  fetchUrlConfig,
  // Collection fetchers
  fetchCollectionData,
  fetchProjects,
  fetchExperience,
  fetchSkills,
  fetchEducation,
  fetchAchievements,
  fetchCaseStudies,
  fetchContentLabels,
  // Manifest
  fetchManifest,
} from './fetchers';

export {
  // Image utilities
  getImageUrl,
  getImage,
  preloadImages,
  // Resume utilities
  getResume,
  // Config utilities
  getConfig,
  // Storage file utilities
  getStorageFile,
  getLogoSvg,
  getManifestFromStorage,
  // Collection utilities
  getCollection,
  // Generic API request
  getInfoFromAPI,
} from './resources';

export {
  // Contact form
  submitContact,
  // Event tracking
  trackEvent,
  // Visitor location
  getVisitorLocation,
} from './analytics';

export {
  // Bulk operations
  fetchAllEssentialData,
  clearAllCaches,
  clearCacheForLanguage,
} from './utilities';
