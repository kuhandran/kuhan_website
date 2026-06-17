'use client';

// Typed wrapper around window.gtag.
// All functions are no-ops when GA4 is not loaded (dev) or consent is absent.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function fire(event: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', event, params);
}

// ── Conversion events (highest value) ────────────────────────────────────────

export function trackResumeDownload(country = 'unknown', language = 'en') {
  fire('resume_download', {
    event_category: 'conversion',
    country,
    language,
    value: 5,          // relative conversion value for GA4 reports
  });
}

export function trackContactSubmit(country = 'unknown') {
  fire('contact_form_submit', {
    event_category: 'conversion',
    country,
    value: 10,
  });
}

// ── Engagement events ─────────────────────────────────────────────────────────

/** Call when a section has been visible for a meaningful duration */
export function trackSectionDwell(section: string, durationMs: number, country = 'unknown') {
  fire('section_dwell', {
    event_category: 'engagement',
    section_name: section,
    duration_seconds: Math.round(durationMs / 1000),
    country,
  });
}

/** Skills tab switch or 3D/list view toggle */
export function trackSkillView(category: string, viewType: 'list' | '3d') {
  fire('skill_view', {
    event_category: 'engagement',
    skill_category: category,
    view_type: viewType,
  });
}

/** Project card link click */
export function trackProjectClick(title: string, action: 'case_study' | 'live' | 'github') {
  fire('project_click', {
    event_category: 'engagement',
    project_title: title,
    action_type: action,
  });
}
