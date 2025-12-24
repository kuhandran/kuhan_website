/**
 * Image and Asset Configuration
 * All images are served from CDN: https://static.kuhandranchatbot.info/images/
 */

export const CDN_BASE_URL = 'https://static.kuhandranchatbot.info';
export const IMAGES_CDN = `${CDN_BASE_URL}/images`;
export const DATA_CDN = `${CDN_BASE_URL}/data`;

// Helper function to get image URL from CDN
export const getImageUrl = (imagePath: string): string => {
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${IMAGES_CDN}/${cleanPath}`;
};

// Cache for fetched data
let contentLabelsCache: any = null;

/**
 * Fetch content labels from CDN with caching
 */
export async function fetchContentLabels() {
  if (contentLabelsCache) {
    return contentLabelsCache;
  }

  try {
    const response = await fetch(`${DATA_CDN}/contentLabels.json`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    contentLabelsCache = await response.json();
    return contentLabelsCache;
  } catch (error) {
    console.error('Error fetching content labels:', error);
    return {};
  }
}

/**
 * Get content labels synchronously (returns cached data or empty object)
 */
export function getContentLabels() {
  return contentLabelsCache || {};
}

/**
 * Initialize content labels (call this early in app lifecycle)
 */
export async function initializeContentLabels() {
  if (!contentLabelsCache) {
    await fetchContentLabels();
  }
}
