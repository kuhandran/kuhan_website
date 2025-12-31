# Multilingual Language Dropdown System

## Overview
The website now features a fully automated language dropdown system that fetches language configurations and multilingual content directly from the production API.

## Architecture

### Components & Files

#### 1. **Language Configuration** (`src/lib/config/languageConfig.ts`)
- Fetches language list from API: `https://static-api-opal.vercel.app/api/config-file/languages.json`
- Caches language configuration for 1 hour
- Provides fallback to local default languages if API is unavailable
- Supports 10 languages: English, Arabic, Spanish, French, Hindi, Indonesian, Burmese, Sinhala, Tamil, Thai

**Key Functions:**
```typescript
fetchLanguagesConfig()        // Fetch languages from API
getCompletedLanguages()       // Get only completed languages
detectBrowserLanguage()       // Detect browser's preferred language
fetchLocaleData(lang, type)   // Fetch specific language content
```

#### 2. **Language Hook** (`src/lib/hooks/useLanguageHook.ts`)
- React Context-based global language state management
- Automatically detects browser language on first load
- Persists language preference to localStorage
- Provides `LanguageProvider` wrapper component

**Usage:**
```typescript
import { useLanguage } from '@/lib/hooks/useLanguageHook';

function MyComponent() {
  const { language, languages, changeLanguage, currentLanguageInfo } = useLanguage();
}
```

#### 3. **Language Switcher Component** (`src/components/language/LanguageSwitcher.tsx`)
- Dropdown UI component showing all available languages
- Displays language flag emoji and native name
- Shows "Coming Soon" badge for pending languages
- Automatically fetches from API (supports unlimited languages)

**Features:**
- Flag emoji display
- Native language names
- Region information
- Loading state handling
- Smooth dropdown animations

#### 4. **Content Loader** (`src/lib/utils/contentLoader.ts`)
- Unified interface for fetching multilingual content
- Automatic API/local fallback mechanism
- Built-in caching system
- Prefetching capability

**Functions:**
```typescript
getMultilingualContent(langCode, fileType)  // Generic content fetcher
getContentLabels(langCode)                   // Get UI labels
getProjects(langCode)                        // Get projects
getExperience(langCode)                      // Get experience
getSkills(langCode)                          // Get skills
getEducation(langCode)                       // Get education
getAchievements(langCode)                    // Get achievements
```

## Setup Instructions

### 1. Install the LanguageProvider (Already Done)
In `src/app/layout.tsx`:
```tsx
import { LanguageProvider } from '@/lib/hooks/useLanguageHook';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
```

### 2. Use the Language Switcher
In your Navbar or header:
```tsx
import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';

export function Navbar() {
  return (
    <nav>
      {/* ... other navbar items ... */}
      <LanguageSwitcher />
    </nav>
  );
}
```

### 3. Access Language State
In any component:
```tsx
'use client';
import { useLanguage } from '@/lib/hooks/useLanguageHook';

export function MyComponent() {
  const { language, languages, currentLanguageInfo } = useLanguage();
  
  return (
    <div>
      <p>Current Language: {currentLanguageInfo?.nativeName}</p>
      <p>Flag: {currentLanguageInfo?.flag}</p>
    </div>
  );
}
```

## API Endpoints

### Languages Configuration
```
GET https://static-api-opal.vercel.app/api/config-file/languages.json
```

**Response:**
```json
{
  "languages": [
    {
      "code": "en",
      "name": "English",
      "nativeName": "English",
      "flag": "🇬🇧",
      "region": "Global",
      "status": "completed",
      "lastUpdated": "2025-01-02"
    }
  ],
  "defaultLanguage": "en",
  "fallbackLanguage": "en",
  "supportedLocales": 10,
  "completedLocales": 10,
  "fileTypes": [
    "contentLabels.json",
    "projects.json",
    "experience.json",
    "skills.json",
    "education.json",
    "achievements.json"
  ]
}
```

### Locale Data
```
GET https://static-api-opal.vercel.app/api/collections/{code}/data/{fileType}.json
```

**Example:**
```
https://static-api-opal.vercel.app/api/collections/ta/data/contentLabels.json
https://static-api-opal.vercel.app/api/collections/ar-AE/data/projects.json
```

## Supported Languages

| Code | Name | Native Name | Flag | Region | Status |
|------|------|-------------|------|--------|--------|
| en | English | English | 🇬🇧 | Global | ✅ Completed |
| ar-AE | Arabic | العربية | 🇦🇪 | Middle East | ✅ Completed |
| es | Spanish | Español | 🇪🇸 | Europe | ✅ Completed |
| fr | French | Français | 🇫🇷 | Europe | ✅ Completed |
| hi | Hindi | हिन्दी | 🇮🇳 | South Asia | ✅ Completed |
| id | Indonesian | Bahasa Indonesia | 🇮🇩 | Southeast Asia | ✅ Completed |
| my | Burmese | မြန်မာ | 🇲🇲 | Southeast Asia | ✅ Completed |
| si | Sinhala | සිංහල | 🇱🇰 | South Asia | ✅ Completed |
| ta | Tamil | தமிழ் | 🇮🇳 | South Asia | ✅ Completed |
| th | Thai | ไทย | 🇹🇭 | Southeast Asia | ✅ Completed |

## Usage Examples

### Basic Language Switching
```tsx
'use client';
import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';

export function Header() {
  return (
    <header>
      <nav>
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
```

### Loading Multilingual Content
```tsx
'use client';
import { useLanguage } from '@/lib/hooks/useLanguageHook';
import { getContentLabels } from '@/lib/utils/contentLoader';
import { useEffect, useState } from 'react';

export function Section() {
  const { language } = useLanguage();
  const [labels, setLabels] = useState(null);

  useEffect(() => {
    const loadLabels = async () => {
      const data = await getContentLabels(language);
      setLabels(data);
    };
    loadLabels();
  }, [language]);

  return (
    <div>
      <h1>{labels?.navigation?.about}</h1>
    </div>
  );
}
```

### Language Detection Component
```tsx
'use client';
import { useLanguage } from '@/lib/hooks/useLanguageHook';

export function LanguageInfo() {
  const { currentLanguageInfo } = useLanguage();

  return (
    <div className="language-info">
      <span>{currentLanguageInfo?.flag}</span>
      <span>{currentLanguageInfo?.nativeName}</span>
      <span>({currentLanguageInfo?.region})</span>
    </div>
  );
}
```

### Listening to Language Changes
```tsx
useEffect(() => {
  const handleLanguageChange = (e: CustomEvent) => {
    console.log('Language changed to:', e.detail.language);
  };

  window.addEventListener('languageChange', handleLanguageChange as EventListener);
  return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
}, []);
```

## Synced Local Data

All multilingual data has been synced to your local project at:
```
/scripts/public/data/{language-code}/{fileType}.json
```

**Directory Structure:**
```
scripts/public/data/
├── ar-AE/
│   ├── contentLabels.json
│   ├── projects.json
│   ├── experience.json
│   ├── skills.json
│   ├── education.json
│   └── achievements.json
├── en/
├── es/
├── fr/
├── hi/
├── id/
├── my/
├── si/
├── ta/
└── th/
```

## Caching Strategy

1. **Language Configuration**: Cached for 1 hour
2. **Locale Data**: Cached in memory during session
3. **Browser Language Preference**: Cached in localStorage

**Clear Cache:**
```typescript
import { clearContentCache } from '@/lib/utils/contentLoader';
clearContentCache();
```

## Performance Optimization

### Prefetch Languages
```tsx
import { prefetchLanguageContent } from '@/lib/utils/contentLoader';

// Load content for multiple languages upfront
useEffect(() => {
  prefetchLanguageContent(['en', 'ta', 'ar-AE']);
}, []);
```

## Fallback Behavior

1. **API Unavailable**: Uses default local languages configuration
2. **Language Data Missing**: Falls back to English (default language)
3. **Invalid Language Code**: Returns empty object with warning

## Error Handling

All functions include built-in error handling:
```typescript
try {
  const data = await getMultilingualContent('ta', 'contentLabels');
} catch (error) {
  console.error('Failed to load content:', error);
  // Falls back gracefully
}
```

## Testing

Test the language switcher:
1. Run `npm run dev`
2. Open browser DevTools > Application > Local Storage
3. Change language - observe `preferredLanguage` key updates
4. Refresh page - verify language preference persists
5. Check Network tab - see API calls to `static-api-opal.vercel.app`

## Environment Variables

No additional environment variables needed. The system uses absolute URLs to the production API.

## Troubleshooting

**Q: Language dropdown shows "Loading..."**
A: The API might be slow. Check network tab. The system will use fallback languages if API fails.

**Q: Language changes don't persist**
A: Clear localStorage and refresh. Check browser's localStorage is enabled.

**Q: New languages not showing**
A: The API might be cached. Wait up to 1 hour or clear the in-memory cache.

**Q: Content not loading for specific language**
A: Check that the language code matches exactly (e.g., `ar-AE` not `ar`). Check the API endpoint is accessible.
