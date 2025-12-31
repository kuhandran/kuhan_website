# API-Based Data Loading Guide

## Overview

All data loading has been updated to use the production API with language code parameters. Instead of loading from local files like `/data/experience.json`, the system now constructs dynamic URLs based on the language code.

## API Endpoint Structure

```
Base API: https://static-api-opal.vercel.app/api

Data Files:
https://static-api-opal.vercel.app/api/collections/{languageCode}/data/{fileType}.json

Config Files:
https://static-api-opal.vercel.app/api/collections/{languageCode}/config/{configName}.json
```

## URL Examples

### Data Files
```
English (en):
- https://static-api-opal.vercel.app/api/collections/en/data/experience.json
- https://static-api-opal.vercel.app/api/collections/en/data/contentLabels.json
- https://static-api-opal.vercel.app/api/collections/en/data/projects.json
- https://static-api-opal.vercel.app/api/collections/en/data/skills.json
- https://static-api-opal.vercel.app/api/collections/en/data/education.json
- https://static-api-opal.vercel.app/api/collections/en/data/achievements.json

Tamil (ta):
- https://static-api-opal.vercel.app/api/collections/ta/data/experience.json
- https://static-api-opal.vercel.app/api/collections/ta/data/contentLabels.json

Arabic (ar-AE):
- https://static-api-opal.vercel.app/api/collections/ar-AE/data/experience.json
- https://static-api-opal.vercel.app/api/collections/ar-AE/data/contentLabels.json
```

### Config Files
```
https://static-api-opal.vercel.app/api/collections/en/config/apiConfig.json
https://static-api-opal.vercel.app/api/collections/ta/config/apiConfig.json
https://static-api-opal.vercel.app/api/collections/ar-AE/config/pageLayout.json
```

## Updated Functions in `dataConfig.ts`

### 1. `getDataSourceUrl(filename, languageCode, fileType)`
Generic URL builder for any data or config file.

```typescript
import { getDataSourceUrl } from '@/lib/config/dataConfig';

// Get data file
const url = getDataSourceUrl('experience.json', 'en', 'data');
// → https://static-api-opal.vercel.app/api/collections/en/data/experience.json

// Get config file
const url = getDataSourceUrl('apiConfig.json', 'ta', 'config');
// → https://static-api-opal.vercel.app/api/collections/ta/config/apiConfig.json
```

### 2. `getMultilingualUrl(fileType, languageCode)`
Shorthand for data files only.

```typescript
import { getMultilingualUrl } from '@/lib/config/dataConfig';

const url = getMultilingualUrl('experience', 'en');
// → https://static-api-opal.vercel.app/api/collections/en/data/experience.json

const url = getMultilingualUrl('contentLabels', 'ar-AE');
// → https://static-api-opal.vercel.app/api/collections/ar-AE/data/contentLabels.json
```

### 3. `getConfigUrl(configName, languageCode)`
Shorthand for config files.

```typescript
import { getConfigUrl } from '@/lib/config/dataConfig';

const url = getConfigUrl('apiConfig', 'en');
// → https://static-api-opal.vercel.app/api/collections/en/config/apiConfig.json

const url = getConfigUrl('pageLayout', 'ta');
// → https://static-api-opal.vercel.app/api/collections/ta/config/pageLayout.json
```

### 4. `getApiBaseUrl()`
Get the base API URL.

```typescript
import { getApiBaseUrl } from '@/lib/config/dataConfig';

const base = getApiBaseUrl();
// → https://static-api-opal.vercel.app/api
```

## Updated Functions in `contentLoader.ts`

All content loading functions now fetch from the production API using language codes.

### Data Loading Functions

```typescript
import {
  getMultilingualContent,
  getContentLabels,
  getProjects,
  getExperience,
  getSkills,
  getEducation,
  getAchievements,
  getApiConfig,
  getPageLayout,
} from '@/lib/utils/contentLoader';

// Generic function
const data = await getMultilingualContent('en', 'experience');

// Specific functions
const labels = await getContentLabels('en');
const projects = await getProjects('ta');
const experience = await getExperience('ar-AE');
const skills = await getSkills('en');
const education = await getEducation('hi');
const achievements = await getAchievements('en');

// Config files
const apiConfig = await getApiConfig('en');
const pageLayout = await getPageLayout('ta');
```

## Usage in Components

### 1. Fetch Data with Language Code

```typescript
'use client';
import { useLanguage } from '@/lib/hooks/useLanguageHook';
import { getExperience } from '@/lib/utils/contentLoader';
import { useEffect, useState } from 'react';

export function ExperienceSection() {
  const { language } = useLanguage();
  const [experience, setExperience] = useState(null);

  useEffect(() => {
    const loadExperience = async () => {
      // This will fetch from:
      // https://static-api-opal.vercel.app/api/collections/{language}/data/experience.json
      const data = await getExperience(language);
      setExperience(data);
    };

    loadExperience();
  }, [language]); // Re-fetch when language changes

  if (!experience) return <div>Loading...</div>;

  return (
    <div>
      {experience.map((job) => (
        <div key={job.id}>{job.title}</div>
      ))}
    </div>
  );
}
```

### 2. Using the Language Hook

```typescript
'use client';
import { useLanguage } from '@/lib/hooks/useLanguageHook';
import { getContentLabels } from '@/lib/utils/contentLoader';

export function MyComponent() {
  const { language, currentLanguageInfo } = useLanguage();
  const [labels, setLabels] = useState(null);

  useEffect(() => {
    // Fetch content labels for current language
    getContentLabels(language).then(setLabels);
  }, [language]);

  return (
    <div>
      <h1>{currentLanguageInfo?.name}</h1>
      <p>{labels?.hero?.greeting}</p>
    </div>
  );
}
```

### 3. Fetch Multiple Content Types

```typescript
'use client';
import { useLanguage } from '@/lib/hooks/useLanguageHook';
import {
  getContentLabels,
  getProjects,
  getExperience,
} from '@/lib/utils/contentLoader';
import { useEffect, useState } from 'react';

export function AllContent() {
  const { language } = useLanguage();
  const [data, setData] = useState({ labels: null, projects: null, experience: null });

  useEffect(() => {
    const loadAllContent = async () => {
      // Fetch all content in parallel
      const [labels, projects, experience] = await Promise.all([
        getContentLabels(language),
        getProjects(language),
        getExperience(language),
      ]);

      setData({ labels, projects, experience });
    };

    loadAllContent();
  }, [language]);

  return (
    <div>
      {/* Use data.labels, data.projects, data.experience */}
    </div>
  );
}
```

## Direct URL Construction

If you need to construct URLs directly:

```typescript
import { getDataSourceUrl, getMultilingualUrl, getConfigUrl } from '@/lib/config/dataConfig';

// Method 1: Generic function
const url1 = getDataSourceUrl('experience.json', 'en', 'data');

// Method 2: Multilingual shorthand
const url2 = getMultilingualUrl('experience', 'en');

// Method 3: Config shorthand
const url3 = getConfigUrl('apiConfig', 'en');

// All produce same URL structure with language code
```

## API Response Format

### Data Files
```json
// experience.json
[
  {
    "id": "job-1",
    "title": "Technical Delivery Manager",
    "company": "FWD Insurance",
    "duration": "2 years",
    // ... more fields
  }
]

// contentLabels.json
{
  "navigation": {
    "home": "Home",
    "about": "About",
    // ... more labels
  }
}
```

### Config Files
```json
// apiConfig.json
{
  "apiEndpoints": {
    "analytics": "https://...",
    "contact": "https://..."
  }
}
```

## Caching

All fetched content is automatically cached in memory during the session:

```typescript
import { clearContentCache } from '@/lib/utils/contentLoader';

// Force refresh by clearing cache
clearContentCache();

// Then refetch
const fresh = await getExperience(language);
```

## Performance Optimization

### Prefetch Languages
```typescript
import { prefetchLanguageContent } from '@/lib/utils/contentLoader';

// Prefetch content for multiple languages upfront
useEffect(() => {
  prefetchLanguageContent(
    ['en', 'ta', 'ar-AE'],
    ['contentLabels', 'projects', 'experience']
  );
}, []);
```

## Error Handling

All functions include built-in error handling:

```typescript
try {
  const data = await getExperience('en');
  
  if (!data) {
    console.warn('No data returned from API');
  }
} catch (error) {
  console.error('Failed to fetch experience:', error);
  // Gracefully handle error
}
```

## Debugging

Check console logs to see which URLs are being requested:

```
📡 Fetching: https://static-api-opal.vercel.app/api/collections/en/data/experience.json
✅ Loaded experience for en
```

## Summary of Changes

| Old Approach | New Approach |
|---|---|
| `/data/experience.json` | `https://static-api-opal.vercel.app/api/collections/{language}/data/experience.json` |
| `getDataSourceUrl('experience.json')` | `getMultilingualUrl('experience', language)` |
| Single language hardcoded | Dynamic language code parameter |
| No API structure | Production API with collections/config pattern |

## Next Steps

1. Update all components to use `useLanguage()` hook to get current language
2. Replace all direct file loads with `getMultilingualContent()` or specific functions
3. Pass language code to data loading functions
4. Test with different languages to verify API calls
5. Monitor network requests to ensure correct URLs are being called
