/**
 * Hooks Index
 * Central export point for all custom hooks
 */

export { useLanguage, useGlobalLanguage, LanguageProvider } from './useLanguageHook';
export { useVisitorAnalytics } from './useVisitorAnalytics';
export {
  useLanguageContent,
  useLanguageConfig,
  useLanguageData,
  type LanguageContentState,
} from './useLanguageContent';
