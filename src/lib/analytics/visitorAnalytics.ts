/**
 * Visitor Analytics Utility
 * Collects: Location, Language, Browser, Organization
 * Requires user consent for analytics
 */

export interface VisitorData {
  location: {
    city: string;
    country: string;
    countryCode: string;
    latitude: number;
    longitude: number;
  };
  language: string;
  browser: {
    name: string;
    version: string;
    os: string;
  };
  organization?: {
    name: string;
    domain: string;
  };
  timestamp: string;
  userAgent: string;
}

// Detect Browser Info from User Agent
function getBrowserInfo(userAgent: string) {
  const browsers = [
    { name: 'Chrome', regex: /Chrome\/(\d+)/ },
    { name: 'Safari', regex: /Version\/(\d+).*Safari/ },
    { name: 'Firefox', regex: /Firefox\/(\d+)/ },
    { name: 'Edge', regex: /Edg\/(\d+)/ },
    { name: 'Opera', regex: /OPR\/(\d+)/ },
  ];

  const osPatterns = [
    { name: 'Windows', regex: /Windows/ },
    { name: 'macOS', regex: /Macintosh|Mac OS X/ },
    { name: 'Linux', regex: /Linux/ },
    { name: 'iOS', regex: /iPhone|iPad|iPod/ },
    { name: 'Android', regex: /Android/ },
  ];

  let browserName = 'Unknown';
  let version = 'Unknown';
  let os = 'Unknown';

  for (const browser of browsers) {
    const match = userAgent.match(browser.regex);
    if (match) {
      browserName = browser.name;
      version = match[1];
      break;
    }
  }

  for (const osPattern of osPatterns) {
    if (osPattern.regex.test(userAgent)) {
      os = osPattern.name;
      break;
    }
  }

  return { name: browserName, version, os };
}

// Get Language
function getLanguage(): string {
  return navigator.language || 'Unknown';
}

// Fetch IP-based location data
async function getLocationData(): Promise<any> {
  try {
    // Using ipapi.co (free, no auth required, privacy-friendly)
    const response = await fetch('https://ipapi.co/json/', {
      headers: {
        'User-Agent': 'Kuhandran-Portfolio-Analytics',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch location');

    const data = await response.json();
    return {
      city: data.city || 'Unknown',
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'Unknown',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
    };
  } catch (error) {
    console.error('Error fetching location:', error);
    return {
      city: 'Unknown',
      country: 'Unknown',
      countryCode: 'Unknown',
      latitude: 0,
      longitude: 0,
    };
  }
}

// Detect organization from domain (if visitor uses corporate email)
async function detectOrganization(ipAddress?: string): Promise<any> {
  try {
    // Using ipqualityscore API or similar for company detection
    // This requires API key - alternative: use clearbit.com
    
    // For now, return null - you can integrate paid service later
    // Example: Clearbit API - https://clearbit.com/resources/api
    
    return null;
  } catch (error) {
    console.error('Error detecting organization:', error);
    return null;
  }
}

// Main function to collect all visitor data
export async function collectVisitorAnalytics(): Promise<VisitorData> {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  const location = await getLocationData();
  const browser = getBrowserInfo(userAgent);
  const language = getLanguage();
  const organization = await detectOrganization();

  return {
    location,
    language,
    browser,
    organization: organization || undefined,
    timestamp: new Date().toISOString(),
    userAgent,
  };
}

// Send analytics to your backend
export async function sendVisitorAnalytics(visitorData: VisitorData): Promise<void> {
  try {
    const response = await fetch('/api/analytics/visitor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitorData),
    });

    if (!response.ok) {
      console.error('Failed to send analytics');
    }
  } catch (error) {
    console.error('Error sending analytics:', error);
  }
}

// Format visitor data for display
export function formatVisitorInfo(data: VisitorData): string {
  return `📍 ${data.location.city}, ${data.location.country} | 🌐 ${data.language} | 🖥️ ${data.browser.name} (${data.browser.os})`;
}
