'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/hooks/useLanguageHook';
import { Globe, ChevronDown, Loader } from 'lucide-react';

/**
 * Language Switcher Component - API-Driven
 * - Dynamically fetches languages from production API
 * - Shows language flag emoji and native name
 * - Smooth dropdown interaction
 * - Supports unlimited languages from API
 */
export const LanguageSwitcher: React.FC = () => {
  const { language, languages, changeLanguage, isLoading, currentLanguageInfo } =
    useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (code: string) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  // Show loading state
  if (isLoading || languages.length === 0) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-slate-300 text-slate-600 rounded-lg text-sm font-medium cursor-not-allowed"
        aria-label="Loading languages"
      >
        <Loader size={16} className="animate-spin" />
        <span>Loading...</span>
      </button>
    );
  }

  return (
    <div className="relative">
      {/* Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200 hover:shadow-md"
        aria-label="Switch language"
        aria-expanded={isOpen}
        title={currentLanguageInfo?.name}
      >
        <span className="text-lg flex-shrink-0">
          {currentLanguageInfo?.flag || '🌍'}
        </span>
        <span className="hidden sm:inline max-w-[100px] truncate">
          {currentLanguageInfo?.name || 'Language'}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Language Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 max-h-96 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-y-auto"
          role="menu"
        >
          {languages.length > 0 ? (
            languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center justify-between gap-3 w-full text-left px-4 py-3 text-sm transition-colors ${
                  language === lang.code
                    ? 'bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
                role="menuitem"
                aria-current={language === lang.code ? 'true' : undefined}
                title={`${lang.nativeName} - ${lang.region}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-lg flex-shrink-0">{lang.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{lang.name}</div>
                    <div className="text-xs opacity-75 truncate">
                      {lang.nativeName}
                    </div>
                  </div>
                </div>
                {lang.status === 'pending' && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded flex-shrink-0">
                    Coming Soon
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-center text-sm text-slate-500">
              No languages available
            </div>
          )}
        </div>
      )}
    </div>
  );
};
