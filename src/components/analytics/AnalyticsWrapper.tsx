'use client';

import { useEffect } from 'react';

/**
 * Analytics Wrapper Component
 * Initializes and manages analytics tracking
 * - Checks consent before tracking
 * - Handles tracking initialization
 * - Manages analytics state
 */
export default function AnalyticsWrapper() {
  useEffect(() => {
    // Get analytics consent from cookie
    const getAnalyticsConsent = () => {
      const consentCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('analytics-consent='));

      if (!consentCookie) return null;
      return consentCookie.split('=')[1] === 'true';
    };

    const consent = getAnalyticsConsent();

    // Only initialize analytics if user has consented
    if (consent) {
      // Analytics initialization code here
      console.log('[Analytics] Tracking enabled');
    } else if (consent === false) {
      console.log('[Analytics] Tracking disabled by user');
    }
  }, []);

  return null; // This component doesn't render anything
}
