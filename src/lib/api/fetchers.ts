import {
  getConfigRouteUrl,
  getManifestUrl,
  getCollectionUrl,
  SupportedLanguage,
  DEFAULT_LANGUAGE,
} from '@/lib/config/domains';
import { cacheManager } from './cache';

const TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchConfig<T extends Record<string, unknown> = Record<string, unknown>>(
  configType: 'apiConfig' | 'pageLayout' | 'urlConfig',
  language: SupportedLanguage = DEFAULT_LANGUAGE
): Promise<T> {
  const key = `config:${language}:${configType}`;
  const cached = cacheManager.get<T>(key);
  if (cached) return cached;

  try {
    const url = getConfigRouteUrl(language, configType);
    const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'default' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    const data = (raw.data || raw) as T;
    cacheManager.set(key, data, TTL);
    return data;
  } catch (err) {
    console.error(`[fetchers] config ${language}/${configType}:`, err);
    return {} as unknown as T;
  }
}

export const fetchApiConfig = (language: SupportedLanguage = DEFAULT_LANGUAGE) => fetchConfig('apiConfig', language);
export const fetchPageLayout = (language: SupportedLanguage = DEFAULT_LANGUAGE) => fetchConfig('pageLayout', language);
export const fetchUrlConfig  = (language: SupportedLanguage = DEFAULT_LANGUAGE) => fetchConfig('urlConfig', language);

export async function fetchCollectionData<T extends Record<string, unknown> | unknown[] = unknown[]>(
  dataType: string,
  language: SupportedLanguage = DEFAULT_LANGUAGE
): Promise<T> {
  const key = `collection:${language}:${dataType}`;
  const cached = cacheManager.get<T>(key);
  if (cached) return cached;

  try {
    // Server-side: try local public/collections file first
    if (typeof window === 'undefined') {
      try {
        const fs   = await import('fs/promises');
        const path = await import('path');
        const file = path.join(process.cwd(), 'public', 'collections', language, 'data', `${dataType}.json`);
        const data = JSON.parse(await fs.readFile(file, 'utf-8')) as T;
        cacheManager.set(key, data, TTL);
        return data;
      } catch { /* fall through to API */ }
    }

    const baseUrl = getCollectionUrl(language, 'data', dataType);
    const urls = baseUrl.endsWith('.json') ? [baseUrl] : [baseUrl, `${baseUrl}.json`];

    let res: Response | null = null;
    for (const url of urls) {
      try {
        res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'default' });
        if (res.ok) break;
      } catch { continue; }
    }
    if (!res?.ok) throw new Error('Failed to fetch collection');

    let data = await res.json();
    // Unwrap common API envelope shapes
    data = data.data ?? data.content ?? data;
    if (data && typeof data === 'object' && !Array.isArray(data) && 'data' in data) data = data.data;

    cacheManager.set(key, data as T, TTL);
    return data as T;
  } catch (err) {
    console.error(`[fetchers] collection ${language}/${dataType}:`, err);
    return [] as unknown as T;
  }
}

export const fetchProjects       = (l?: SupportedLanguage) => fetchCollectionData('projects', l);
export const fetchExperience     = (l?: SupportedLanguage) => fetchCollectionData('experience', l);
export const fetchSkills         = (l?: SupportedLanguage) => fetchCollectionData('skills', l);
export const fetchEducation      = (l?: SupportedLanguage) => fetchCollectionData('education', l);
export const fetchAchievements   = (l?: SupportedLanguage) => fetchCollectionData('achievements', l);
export const fetchCaseStudies    = (l?: SupportedLanguage) => fetchCollectionData('caseStudies', l);
export const fetchContentLabels  = (l?: SupportedLanguage) => fetchCollectionData('contentLabels', l);

export async function fetchManifest(language: SupportedLanguage = DEFAULT_LANGUAGE): Promise<Record<string, unknown> | null> {
  const key = `manifest:${language}`;
  const cached = cacheManager.get<Record<string, unknown>>(key);
  if (cached) return cached;

  try {
    const res = await fetch(getManifestUrl(language), { headers: { Accept: 'application/json' }, cache: 'default' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json() as Record<string, unknown>;
    const data = (raw.data as Record<string, unknown>) || raw;
    cacheManager.set(key, data, TTL);
    return data;
  } catch (err) {
    console.error(`[fetchers] manifest ${language}:`, err);
    return null;
  }
}
