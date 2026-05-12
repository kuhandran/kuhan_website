# Quick Start: Redux + API Client

## Installation

```bash
npm install react-redux @reduxjs/toolkit
```

## Setup (5 Steps)

### Step 1: Update layout.tsx

```typescript
// src/app/layout.tsx
import { ReduxProvider } from '@/lib/redux/ReduxProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
```

### Step 2: Add Language Selector to Header

```typescript
// src/components/Header.tsx
'use client';

import { LanguageSelector } from '@/components/language/LanguageSelector';

export function Header() {
  return (
    <header>
      <h1>My Portfolio</h1>
      <LanguageSelector />
    </header>
  );
}
```

### Step 3: Use Data Hooks in Components

```typescript
// src/app/page.tsx
'use client';

import { useCollectionData, useConfig } from '@/lib/hooks/useLanguageData';

export default function Home() {
  const { data: projects } = useCollectionData('projects');
  const { data: layout } = useConfig('pageLayout');

  return (
    <div>
      <h1>{layout?.title}</h1>
      <div>
        {projects?.map(p => (
          <div key={p.id}>{p.name}</div>
        ))}
      </div>
    </div>
  );
}
```

### Step 4: Use API Client Directly (Optional)

```typescript
// For non-React code or specific needs
import { 
  fetchProjects, 
  submitContact,
  trackEvent 
} from '@/lib/api/apiClient';

// Fetch data
const projects = await fetchProjects('en');

// Submit form
const result = await submitContact({
  name: 'John',
  email: 'john@example.com',
  message: 'Hello'
});

// Track event
await trackEvent({
  type: 'page_view',
  action: 'view_projects'
});
```

### Step 5: Test Language Switching

Navigate to your app and click the language selector. When you change the language:
- ✅ Redux state updates
- ✅ All hooks detect the change
- ✅ Components automatically refetch with new language
- ✅ Cache is cleared and repopulated

---

## Common Patterns

### Pattern 1: Load and Display Data

```typescript
'use client';

import { useCollectionData } from '@/lib/hooks/useLanguageData';

export function Projects() {
  const { data, loading, error } = useCollectionData('projects');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}
```

### Pattern 2: Language-Aware Content

```typescript
'use client';

import { useCurrentLanguage } from '@/lib/hooks/useRedux';
import { useCollectionData } from '@/lib/hooks/useLanguageData';

export function Content() {
  const language = useCurrentLanguage();
  const { data: labels } = useCollectionData('contentLabels');

  return (
    <div>
      <p>Current language: {language}</p>
      <h1>{labels?.welcome_message}</h1>
    </div>
  );
}
```

### Pattern 3: Language Switcher

```typescript
'use client';

import { useLanguageManager } from '@/lib/hooks/useLanguageData';
import { LanguageSelector } from '@/components/language/LanguageSelector';

export function Header() {
  const { currentLanguage } = useLanguageManager();

  return (
    <header>
      <h1>My App</h1>
      <LanguageSelector />
      <p>Current: {currentLanguage}</p>
    </header>
  );
}
```

### Pattern 4: Manual API Calls

```typescript
'use client';

import { useState } from 'react';
import { fetchAllEssentialData } from '@/lib/api/apiClient';
import { useCurrentLanguage } from '@/lib/hooks/useRedux';

export function ManualDataLoader() {
  const language = useCurrentLanguage();
  const [data, setData] = useState(null);

  const loadAllData = async () => {
    const allData = await fetchAllEssentialData(language);
    setData(allData);
  };

  return (
    <div>
      <button onClick={loadAllData}>Load All Data</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

---

## Available Hooks

| Hook | Purpose | Returns |
|------|---------|---------|
| `useConfig()` | Fetch config files | `{ data, loading, error, language }` |
| `useCollectionData()` | Fetch collection data | `{ data, loading, error, language }` |
| `useEssentialData()` | Load all data | `{ data, loading, error, language }` |
| `useLanguageManager()` | Manage language | `{ currentLanguage, changeLanguage, isSwitching, clearCache }` |
| `useCurrentLanguage()` | Get current language | `'en' \| 'es' \| ...` |
| `useSupportedLanguages()` | Get all languages | `['en', 'es', ...]` |
| `useSetLanguage()` | Dispatch language | `(language) => void` |

---

## Available API Functions

| Function | Purpose |
|----------|---------|
| `fetchConfig()` | Fetch config file |
| `fetchApiConfig()` | Fetch API config |
| `fetchPageLayout()` | Fetch page layout |
| `fetchUrlConfig()` | Fetch URL config |
| `fetchCollectionData()` | Fetch any collection |
| `fetchProjects()` | Fetch projects |
| `fetchExperience()` | Fetch experience |
| `fetchSkills()` | Fetch skills |
| `fetchEducation()` | Fetch education |
| `fetchAchievements()` | Fetch achievements |
| `fetchCaseStudies()` | Fetch case studies |
| `fetchContentLabels()` | Fetch labels |
| `fetchManifest()` | Fetch PWA manifest |
| `getImageUrl()` | Get CDN image URL |
| `preloadImages()` | Preload images |
| `submitContact()` | Submit contact form |
| `trackEvent()` | Track analytics |
| `getVisitorLocation()` | Get IP location |
| `fetchAllEssentialData()` | Fetch all data |
| `clearApiCache()` | Clear all cache |
| `clearLanguageCache()` | Clear language cache |

---

## Cache Details

- **Default duration**: 5 minutes
- **Key format**: `type:language:datatype`
- **Example keys**: `config:en:pageLayout`, `collection:es:projects`

---

## Troubleshooting

### Data not updating on language change?
- Check that `ReduxProvider` wraps your app
- Ensure component uses Redux hooks, not direct language prop

### Old data showing after language change?
- Cache automatically clears when language changes
- If issue persists, call `clearApiCache()` manually

### Redux DevTools not showing?
- Install Redux DevTools extension
- Check Redux store configuration

---

## Next: Full Implementation

See [REDUX_API_ARCHITECTURE.md](./REDUX_API_ARCHITECTURE.md) for complete documentation.
