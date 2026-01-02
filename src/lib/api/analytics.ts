/**
 * Analytics and Backend API Functions
 * Handles: contact form submission, event tracking, visitor location
 */

import { getIpGeolocationUrl } from '@/lib/config/domains';
import { getFromCache, setInCache } from './cache-legacy';

// ============================================================================
// CONTACT FORM
// ============================================================================

/**
 * Send contact form data to backend
 */
export async function submitContact(data: {
  name: string;
  email: string;
  message: string;
  subject?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[API Error] Failed to submit contact:', error);
    return { success: false, message: 'Failed to submit contact form' };
  }
}

// ============================================================================
// EVENT TRACKING
// ============================================================================

/**
 * Track analytics event
 */
export async function trackEvent(event: {
  type: string;
  action: string;
  label?: string;
  value?: number;
}): Promise<void> {
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error('[API Error] Failed to track event:', error);
  }
}

// ============================================================================
// VISITOR LOCATION
// ============================================================================

/**
 * Get visitor location via IP geolocation
 */
export async function getVisitorLocation() {
  const cacheKey = 'visitor:location';
  
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const url = getIpGeolocationUrl();
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    setInCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('[API Error] Failed to get visitor location:', error);
    return null;
  }
}
