# API Response Mapping Audit - static.kuhandranchatbot.info

## Overview
This document outlines the audit and fixes applied to ensure all API responses from `https://static.kuhandranchatbot.info/` are properly mapped to extract the `response.data` field.

**Base Domain:** `https://static.kuhandranchatbot.info`

---

## Files Updated

### 1. [src/lib/public/fetchers.ts](src/lib/public/fetchers.ts)
**Purpose:** Central API data fetcher for configurations and collections

#### Functions Modified:

#### `fetchConfig<T>()` 
- **Endpoint Pattern:** `https://static.kuhandranchatbot.info/public/collections/{language}/config/{configType}`
- **Config Types:** `apiConfig`, `pageLayout`, `urlConfig`
- **Change:** Extract `response.data || response` to unwrap API wrapper
- **Before:**
  ```typescript
  const data = await response.json();
  setInCache(cacheKey, data);
  ```
- **After:**
  ```typescript
  const responseData = await response.json();
  // Extract 'data' field if present (API response wrapper from static.kuhandranchatbot.info)
  const data = responseData.data || responseData;
  setInCache(cacheKey, data);
  ```

#### `fetchCollectionData<T>()`
- **Endpoint Pattern:** `https://static.kuhandranchatbot.info/public/collections/{language}/data/{dataType}`
- **Data Types:** `projects`, `experience`, `skills`, `education`, `achievements`, `caseStudies`, `contentLabels`
- **Change:** Extract `response.data || response` to unwrap API wrapper
- **Before:**
  ```typescript
  const data = await response.json();
  setInCache(cacheKey, data);
  ```
- **After:**
  ```typescript
  const responseData = await response.json();
  // Extract 'data' field if present (API response wrapper from static.kuhandranchatbot.info)
  const data = responseData.data || responseData;
  setInCache(cacheKey, data);
  ```

#### `fetchManifest()`
- **Endpoint:** `https://static.kuhandranchatbot.info/public/manifest/{language}`
- **Change:** Extract `response.data || response`
- **Applied same mapping pattern as above**

---

### 2. [src/lib/utils/contentLoader.ts](src/lib/utils/contentLoader.ts)
**Purpose:** Multilingual content loader with caching

#### `getMultilingualContent()`
- **Endpoint:** `/public/content/data?language={language}&file={fileType}` (proxied to CDN)
- **Change:** Extract `response.data || response` from proxy response
- **Before:**
  ```typescript
  content = await response.json();
  ```
- **After:**
  ```typescript
  const responseData = await response.json();
  // Extract 'data' field if present (API response wrapper from static.kuhandranchatbot.info)
  content = responseData.data || responseData;
  ```

**Affected Higher-Level Functions:**
- `getContentLabels()`
- `getProjects()`
- `getExperience()`
- `getSkills()`
- `getEducation()`
- `getAchievements()`
- `getApiConfig()`

---

### 3. [src/lib/public/resources.ts](src/lib/public/resources.ts)
**Purpose:** Static API resource utilities (images, resumes, configs, storage files)

#### `getStorageFile<T>()`
- **Endpoint:** `https://static.kuhandranchatbot.info/public/storage-files/{fileName}`
- **Change:** Extract `response.data || response`
- **Before:**
  ```typescript
  const data = await response.json();
  setInCache(cacheKey, data);
  ```
- **After:**
  ```typescript
  const responseData = await response.json();
  // Extract 'data' field if present (API response wrapper from static.kuhandranchatbot.info)
  const data = responseData.data || responseData;
  setInCache(cacheKey, data);
  ```

#### `getCollection<T>()`
- **Endpoint:** `https://static.kuhandranchatbot.info/public/collections/{language}/{type}/{cleanUrl}`
- **Change:** Extract `response.data || response`
- **Applied same mapping pattern as above**

---

### 4. [src/lib/data/achievements.ts](src/lib/data/achievements.ts)
**Purpose:** Achievements data loader

#### `fetchAchievementsData()`
- **Endpoint:** From `getDataSourceUrl('achievements', language)` → CDN
- **Change:** Extract `response.data || response`
- **Before:**
  ```typescript
  const result = await response.json();
  cachedData.set(language, result);
  ```
- **After:**
  ```typescript
  const responseData = await response.json();
  // Extract 'data' field if present (API response wrapper from static.kuhandranchatbot.info)
  const result = responseData.data || responseData;
  cachedData.set(language, result);
  ```

---

### 5. [src/app/public/content/[type]/route.ts](src/app/public/content/[type]/route.ts)
**Purpose:** Next.js API proxy route for fetching multilingual content

#### GET Handler
- **Route:** `/public/content/[type]?language={language}&file={fileName}`
- **External API Call:** Proxies to `https://static.kuhandranchatbot.info/public/collections/{language}/{type}/{fileName}`
- **Change:** Extract `response.data || response` before returning
- **Before:**
  ```typescript
  const data = await response.json();
  return NextResponse.json(data, ...);
  ```
- **After:**
  ```typescript
  const responseData = await response.json();
  // Extract 'data' field if present (API response wrapper from static.kuhandranchatbot.info)
  const data = responseData.data || responseData;
  return NextResponse.json(data, ...);
  ```

---

## API Endpoints Summary

### Configuration Endpoints
| Endpoint | Pattern | Status |
|----------|---------|--------|
| API Config | `/public/collections/{lang}/config/publicConfig` | ✅ Fixed |
| Page Layout | `/public/collections/{lang}/config/pageLayout` | ✅ Fixed |
| URL Config | `/public/collections/{lang}/config/urlConfig` | ✅ Fixed |
| Manifest | `/public/manifest/{lang}` | ✅ Fixed |

### Data Endpoints
| Endpoint | Pattern | Status |
|----------|---------|--------|
| Projects | `/public/collections/{lang}/data/projects` | ✅ Fixed |
| Experience | `/public/collections/{lang}/data/experience` | ✅ Fixed |
| Skills | `/public/collections/{lang}/data/skills` | ✅ Fixed |
| Education | `/public/collections/{lang}/data/education` | ✅ Fixed |
| Achievements | `/public/collections/{lang}/data/achievements` | ✅ Fixed |
| Case Studies | `/public/collections/{lang}/data/caseStudies` | ✅ Fixed |
| Content Labels | `/public/collections/{lang}/data/contentLabels` | ✅ Fixed |

### Storage Endpoints
| Endpoint | Pattern | Status |
|----------|---------|--------|
| Storage Files | `/public/storage-files/{fileName}` | ✅ Fixed |

---

## Response Mapping Pattern

### Standard Pattern
All API calls from `static.kuhandranchatbot.info` now follow this mapping pattern:

```typescript
const responseData = await response.json();
// Extract 'data' field if present (API response wrapper from static.kuhandranchatbot.info)
const data = responseData.data || responseData;
```

### Why This Works
1. **With wrapper:** If API returns `{ data: {...} }`, we extract the inner object
2. **Without wrapper:** If API returns the data directly, we use the response as-is
3. **Backward compatible:** Works with both response formats

### Error Handling
- All functions maintain their original error handling
- Empty defaults returned on failure (arrays, objects, null)
- Cache is skipped on errors
- Logging preserved for debugging

---

## Supported Languages

```javascript
[
  'en',      // English
  'es',      // Spanish
  'fr',      // French
  'de',      // German
  'hi',      // Hindi
  'ta',      // Tamil
  'ar-AE',   // Arabic - UAE
  'id',      // Indonesian
  'my',      // Burmese
  'si',      // Sinhala
  'th',      // Thai
]
```

---

## Testing Checklist

- [x] Configuration endpoints return correct data structure
- [x] Collection data endpoints return correct data structure
- [x] Storage file endpoints return correct data structure
- [x] Cache works correctly with unwrapped data
- [x] Fallback to local files still works
- [x] Error handling preserved
- [x] All supported languages work
- [x] Backward compatibility maintained

---

## Notes

1. **Language Loader** (`src/lib/utils/languageLoader.ts`): Already had proper `data.data || data` pattern implemented
2. **CDN Base:** Images and static assets use `https://static.kuhandranchatbot.info/` without requiring `response.data` mapping
3. **Fallback System:** Local file fallback is still available and works correctly
4. **Caching:** All functions maintain their caching strategies
5. **Production Ready:** Changes are safe for production deployment

---

## Related Configuration Files

- [src/lib/config/domains.ts](src/lib/config/domains.ts) - API endpoint definitions
- [src/lib/config/loaders.ts](src/lib/config/loaders.ts) - Data source URL resolution
- [src/lib/public/cache-legacy.ts](src/lib/public/cache-legacy.ts) - Cache management

---

**Last Updated:** January 19, 2026
**Audit Scope:** All `https://static.kuhandranchatbot.info/` API endpoints
**Status:** ✅ Complete
