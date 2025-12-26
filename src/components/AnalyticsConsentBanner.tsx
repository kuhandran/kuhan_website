"use client";

import { useState, useEffect } from 'react';

export function AnalyticsConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = document.cookie
      .split('; ')
      .find((row) => row.startsWith('analytics-consent='));

    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Set cookie for 365 days
    const date = new Date();
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = `analytics-consent=true; expires=${date.toUTCString()}; path=/`;
    setIsVisible(false);
  };

  const handleReject = () => {
    // Set cookie to reject for 30 days
    const date = new Date();
    date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
    document.cookie = `analytics-consent=false; expires=${date.toUTCString()}; path=/`;
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 border-t border-blue-500 z-50">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Analytics & Visitor Insights</h3>
          <p className="text-sm text-slate-300">
            We collect anonymized analytics (location, language, browser) to understand visitor patterns.
            No personal data is stored. Learn more in our{' '}
            <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
        <div className="flex gap-3 whitespace-nowrap">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm border border-slate-600 rounded hover:bg-slate-800 transition"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-blue-600 rounded hover:bg-blue-700 transition font-semibold"
          >
            Accept Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
