/**
 * Language Dropdown System - Quick Start Guide
 * 
 * This file demonstrates how to use the new API-driven language dropdown system
 */

// ============================================================================
// 1. BASIC USAGE - Use the Language Switcher Component in Your Navbar
// ============================================================================

import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';

export function MyNavbar() {
  return (
    <nav>
      <h1>My Website</h1>
      {/* Add the language switcher to your navbar */}
      <LanguageSwitcher />
    </nav>
  );
}

// ============================================================================
// 2. ACCESS LANGUAGE STATE - Get Current Language in Any Component
// ============================================================================

'use client';
import { useLanguage } from '@/lib/hooks/useLanguageHook';

export function LanguageDisplay() {
  const { language, languages, currentLanguageInfo } = useLanguage();

  return (
    <div>
      <p>Current Language: {currentLanguageInfo?.nativeName}</p>
      <p>Flag: {currentLanguageInfo?.flag}</p>
      <p>Region: {currentLanguageInfo?.region}</p>
      <p>Available Languages: {languages.length}</p>
    </div>
  );
}

// ============================================================================
// 3. LOAD MULTILINGUAL CONTENT - Fetch Translated Content
// ============================================================================

'use client';
import { useLanguage } from '@/lib/hooks/useLanguageHook';
import { getContentLabels, getProjects } from '@/lib/utils/contentLoader';
import { useEffect, useState } from 'react';

export function MySection() {
  const { language } = useLanguage();
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      // Fetch content labels for current language
      const labels = await getContentLabels(language);
      setContent(labels);
      setIsLoading(false);
    };

    loadContent();
  }, [language]); // Re-fetch when language changes

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{content?.navigation?.about}</h2>
      <p>{content?.hero?.greeting}</p>
    </div>
  );
}

// ============================================================================
// 4. LISTEN TO LANGUAGE CHANGES - React to Language Switches
// ============================================================================

'use client';
import { useEffect } from 'react';

export function LanguageChangeListener() {
  useEffect(() => {
    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log('Language changed to:', customEvent.detail.language);
      // Reload data, refresh translations, etc.
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  return null;
}

// ============================================================================
// 5. GET DIFFERENT CONTENT TYPES - Access Various Data
// ============================================================================

'use client';
import { useLanguage } from '@/lib/hooks/useLanguageHook';
import {
  getMultilingualContent,
  getProjects,
  getExperience,
  getSkills,
  getEducation,
  getAchievements,
} from '@/lib/utils/contentLoader';
import { useEffect, useState } from 'react';

export function ContentExample() {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<any>(null);

  useEffect(() => {
    const loadProjects = async () => {
      const projectsData = await getProjects(language);
      setProjects(projectsData);
    };

    loadProjects();
  }, [language]);

  // Similar patterns for other content types:
  // const experience = await getExperience(language);
  // const skills = await getSkills(language);
  // const education = await getEducation(language);
  // const achievements = await getAchievements(language);

  return (
    <div>
      <h2>Projects ({language})</h2>
      <pre>{JSON.stringify(projects, null, 2)}</pre>
    </div>
  );
}

// ============================================================================
// 6. PREFETCH LANGUAGES - Improve Performance for Known Languages
// ============================================================================

'use client';
import { useEffect } from 'react';
import { prefetchLanguageContent } from '@/lib/utils/contentLoader';

export function LanguagePrefetcher() {
  useEffect(() => {
    // Prefetch content for commonly used languages
    // This happens in the background and improves perceived performance
    prefetchLanguageContent(['en', 'ta', 'ar-AE', 'hi']);
  }, []);

  return null;
}

// ============================================================================
// 7. MANUAL LANGUAGE CHANGE - Change Language Programmatically
// ============================================================================

'use client';
import { useLanguage } from '@/lib/hooks/useLanguageHook';

export function LanguageButtons() {
  const { language, changeLanguage, languages } = useLanguage();

  return (
    <div>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={language === lang.code ? 'active' : ''}
        >
          {lang.flag} {lang.name}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// 8. API CONFIGURATION - Understand the Language API
// ============================================================================

/*
FETCH LANGUAGES:
GET https://static-api-opal.vercel.app/api/config-file/languages.json

Response Structure:
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
    },
    ...
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

FETCH CONTENT FOR A LANGUAGE:
GET https://static-api-opal.vercel.app/api/collections/{code}/data/{fileType}.json

Examples:
https://static-api-opal.vercel.app/api/collections/ta/data/contentLabels.json
https://static-api-opal.vercel.app/api/collections/ar-AE/data/projects.json
https://static-api-opal.vercel.app/api/collections/en/data/experience.json
*/

// ============================================================================
// 9. SETUP IN YOUR APP - Required Configuration
// ============================================================================

/*
In src/app/layout.tsx:

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
*/

// ============================================================================
// 10. SUPPORTED LANGUAGES
// ============================================================================

/*
Code   | Name       | Native Name    | Flag | Region         | Status
-------|------------|----------------|------|----------------|----------
en     | English    | English        | 🇬🇧 | Global         | Completed
ar-AE  | Arabic     | العربية        | 🇦🇪 | Middle East    | Completed
es     | Spanish    | Español        | 🇪🇸 | Europe         | Completed
fr     | French     | Français       | 🇫🇷 | Europe         | Completed
hi     | Hindi      | हिन्दी          | 🇮🇳 | South Asia     | Completed
id     | Indonesian | Bahasa Indonesia | 🇮🇩 | Southeast Asia | Completed
my     | Burmese    | မြန်မာ          | 🇲🇲 | Southeast Asia | Completed
si     | Sinhala    | සිංහල         | 🇱🇰 | South Asia     | Completed
ta     | Tamil      | தமிழ்          | 🇮🇳 | South Asia     | Completed
th     | Thai       | ไทย            | 🇹🇭 | Southeast Asia | Completed
*/

// ============================================================================
// 11. CACHING & PERFORMANCE
// ============================================================================

/*
Automatic Caching:
- Language configuration: 1 hour
- Content data: In-memory during session
- User preference: localStorage

Clear Cache if Needed:
import { clearContentCache } from '@/lib/utils/contentLoader';
clearContentCache();

Check Cached Data:
localStorage.getItem('preferredLanguage') // Get user's language preference
*/

// ============================================================================
// 12. ERROR HANDLING
// ============================================================================

'use client';
import { useEffect, useState } from 'react';
import { getMultilingualContent } from '@/lib/utils/contentLoader';

export function SafeContentLoader({ language, fileType }: { language: string; fileType: string }) {
  const [content, setContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getMultilingualContent(language, fileType);
        if (!data) {
          setError(`No content found for ${language}/${fileType}`);
          setContent(null);
        } else {
          setContent(data);
          setError(null);
        }
      } catch (err) {
        setError(`Failed to load content: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setContent(null);
      }
    };

    loadContent();
  }, [language, fileType]);

  if (error) return <div className="error">{error}</div>;
  if (!content) return <div>Loading...</div>;
  return <div>{JSON.stringify(content)}</div>;
}

export default LanguageDisplay;
