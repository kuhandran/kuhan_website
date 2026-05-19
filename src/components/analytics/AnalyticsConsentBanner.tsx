'use client';

import { useState, useEffect } from 'react';

export function AnalyticsConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsent = document.cookie
      .split('; ')
      .find((row) => row.startsWith('analytics-consent='));
    if (!hasConsent) setIsVisible(true);
  }, []);

  const setConsentCookie = (value: boolean, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `analytics-consent=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
  };

  const handleAccept = () => {
    setConsentCookie(true, 365);
    setIsVisible(false);
  };

  const handleReject = () => {
    setConsentCookie(false, 30);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 border-t border-blue-500 z-50 shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold mb-1 text-base">Analytics & Visitor Insights</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            We use anonymised analytics (country, browser, language) to improve this site and track
            resume downloads. No personal data is stored. Accepting also unlocks the resume download.
          </p>
        </div>
        <div className="flex gap-3 whitespace-nowrap">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Reject analytics"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            aria-label="Accept analytics"
          >
            Accept &amp; Unlock Download
          </button>
        </div>
      </div>
    </div>
  );
}
