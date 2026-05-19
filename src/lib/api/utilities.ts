import { SupportedLanguage, DEFAULT_LANGUAGE } from '@/lib/config/domains';
import {
  fetchApiConfig,
  fetchPageLayout,
  fetchContentLabels,
  fetchProjects,
  fetchExperience,
  fetchSkills,
  fetchEducation,
} from './fetchers';
import { cacheManager } from './cache';

export async function fetchAllEssentialData(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  try {
    const [apiConfig, pageLayout, contentLabels, projects, experience, skills, education] =
      await Promise.all([
        fetchApiConfig(language),
        fetchPageLayout(language),
        fetchContentLabels(language),
        fetchProjects(language),
        fetchExperience(language),
        fetchSkills(language),
        fetchEducation(language),
      ]);
    return { apiConfig, pageLayout, contentLabels, projects, experience, skills, education };
  } catch (err) {
    console.error('[utilities] fetchAllEssentialData:', err);
    return null;
  }
}

export function clearAllCaches(): void {
  cacheManager.clear();
}

export function clearCacheForLanguage(language: SupportedLanguage): void {
  cacheManager.clear(new RegExp(`:${language}:`));
}
