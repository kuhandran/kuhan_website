'use client';
import { useEffect } from 'react';
import { trackSectionDwell } from '@/lib/analytics/ga4';

const MIN_DWELL_MS = 4_000; // ignore drive-by scrolls under 4s

/**
 * Tracks how long a visitor reads a section.
 * Uses the section's DOM id so no ref needs to be threaded through props.
 *
 * @param sectionId  The id attribute on the <section> element
 * @param country    ISO country code from useGeolocation (optional)
 */
export function useSectionDwell(sectionId: string, country?: string) {
  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    let enteredAt: number | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          enteredAt = Date.now();
        } else if (enteredAt !== null) {
          const ms = Date.now() - enteredAt;
          if (ms >= MIN_DWELL_MS) trackSectionDwell(sectionId, ms, country);
          enteredAt = null;
        }
      },
      { threshold: 0.25 } // section must be 25% visible to start counting
    );

    observer.observe(el);

    // Flush if the user leaves the page while still reading
    const flush = () => {
      if (enteredAt !== null) {
        const ms = Date.now() - enteredAt;
        if (ms >= MIN_DWELL_MS) trackSectionDwell(sectionId, ms, country);
      }
    };
    window.addEventListener('visibilitychange', flush);

    return () => {
      observer.disconnect();
      window.removeEventListener('visibilitychange', flush);
    };
  }, [sectionId, country]);
}
