'use client';

import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import {
  fetchLanguagesConfig,
  getCompletedLanguages,
  detectBrowserLanguage,
  LanguageInfo,
} from '@/lib/config/languageConfig';

interface LanguageContextType {
  language: string;
  languages: LanguageInfo[];
  isLoading: boolean;
  changeLanguage: (code: string) => void;
  currentLanguageInfo: LanguageInfo | undefined;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

/**
 * Hook to use the global language context
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

/**
 * Language Context Provider - Wraps the entire app to provide language state
 * Place this at the root of your application (in layout.tsx or _app.tsx)
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<string>('en');
  const [languages, setLanguages] = useState<LanguageInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load languages from API on mount
  useEffect(() => {
    const initializeLanguages = async () => {
      try {
        const config = await fetchLanguagesConfig();
        const completedLanguages = await getCompletedLanguages();

        setLanguages(completedLanguages);

        // Detect browser language
        const detectedLanguage = await detectBrowserLanguage();

        // Check localStorage for saved preference
        const savedLanguage =
          typeof window !== 'undefined'
            ? localStorage.getItem('preferredLanguage')
            : null;

        const languageToUse = savedLanguage || detectedLanguage;
        setLanguage(languageToUse);
      } catch (error) {
        console.error('Error initializing languages:', error);
        setLanguage('en');
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguages();
  }, []);

  // Change language and save preference
  const changeLanguage = useCallback((code: string) => {
    setLanguage(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', code);
      // Optionally dispatch custom event for other components
      window.dispatchEvent(
        new CustomEvent('languageChange', { detail: { language: code } })
      );
    }
  }, []);

  const currentLanguageInfo = languages.find((lang) => lang.code === language);

  const value: LanguageContextType = {
    language,
    languages,
    isLoading,
    changeLanguage,
    currentLanguageInfo,
  };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

/**
 * Legacy hook for backward compatibility with existing code
 * Use useLanguage() from context instead for new code
 */
export function useGlobalLanguage() {
  try {
    return useLanguage();
  } catch {
    // If not in provider, return default values
    return {
      language: 'en',
      languages: [],
      isLoading: true,
      changeLanguage: () => {},
      currentLanguageInfo: undefined,
    };
  }
}
