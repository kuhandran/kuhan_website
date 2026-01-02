'use client';

import { useState, useEffect, useCallback } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

let translationsCache: Translations | null = null;

/**
 * Hook to manage language and translations for case studies
 * Handles browser language detection, localStorage persistence, and translation file loading
 */
export function useCaseStudiesTranslation() {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load translations from JSON
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        if (translationsCache) {
          setTranslations(translationsCache);
          setIsLoading(false);
          return;
        }

        const { getDataSourceUrl } = await import('@/lib/config/loaders');
        const dataUrl = getDataSourceUrl('caseStudiesTranslations.json');

        const response = await fetch(dataUrl);
        if (!response.ok) {
          console.warn('Failed to load translations');
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        translationsCache = data;
        setTranslations(data);
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, []);

  // Detect browser language on mount
  useEffect(() => {
    const browserLanguage = navigator.language.split('-')[0] as Language;
    const supportedLanguages: Language[] = ['en', 'es', 'fr', 'de'];
    
    if (supportedLanguages.includes(browserLanguage)) {
      setLanguage(browserLanguage);
    } else {
      setLanguage('en');
    }

    // Also check localStorage for saved preference
    const savedLanguage = localStorage.getItem('caseStudiesLanguage') as Language | null;
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Change language and save preference
  const changeLanguage = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('caseStudiesLanguage', newLanguage);
  }, []);

  // Get translation for a key
  const t = useCallback((key: string): string => {
    if (!translations || !translations[language]) {
      return key;
    }
    return translations[language][key] || key;
  }, [translations, language]);

  return {
    language,
    changeLanguage,
    t,
    translations,
    isLoading,
    supportedLanguages: ['en', 'es', 'fr', 'de'] as Language[],
  };
}
