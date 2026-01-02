'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguageHook';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/lib/config/domains';

/**
 * Language Selector Component
 * Allows users to change language and automatically reloads data
 */
export function LanguageSelector() {
  const { language, changeLanguage, isLoading: languageLoading } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLanguageChange = async (newLanguage: SupportedLanguage) => {
    await changeLanguage(newLanguage);
    setShowDropdown(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={languageLoading}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: languageLoading ? '#ccc' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: languageLoading ? 'not-allowed' : 'pointer',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          minWidth: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>{language.toUpperCase()}</span>
        {languageLoading && <span style={{ marginLeft: '0.5rem' }}>⟳</span>}
      </button>

      {showDropdown && !languageLoading && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginTop: '0.5rem',
            minWidth: '150px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 1000,
          }}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem 1rem',
                border: 'none',
                backgroundColor: language === lang ? '#e0e7ff' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.9rem',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor =
                  language === lang ? '#e0e7ff' : 'transparent';
              }}
            >
              {lang} {lang === 'en' && '(Default)'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
