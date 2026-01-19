/**
 * Service Worker
 * Caches images, API responses, and static content for offline support
 */

// Cache version - increment when updating caching strategy
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAMES = {
  STATIC: `${CACHE_VERSION}-static`,
  API: `${CACHE_VERSION}-api`,
  IMAGES: `${CACHE_VERSION}-images`,
  CDN: `${CACHE_VERSION}-cdn`,
};

// Assets to cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html', // optional fallback page
];

// API endpoints to cache
const API_CACHE_URLS = [
  'https://static.kuhandranchatbot.info/api/collections',
  'https://api-gateway-9unh.onrender.com/api',
];

// Image domains to cache
const IMAGE_DOMAINS = [
  'static.kuhandranchatbot.info',
  'localhost:3000',
];

// Max ages for different cache types (in milliseconds)
const CACHE_MAX_AGE = {
  IMAGES: 30 * 24 * 60 * 60 * 1000, // 30 days
  API: 7 * 24 * 60 * 60 * 1000,     // 7 days
  STATIC: 24 * 60 * 60 * 1000,      // 1 day
  CDN: 7 * 24 * 60 * 60 * 1000,     // 7 days
};

// ============================================================================
// INSTALL EVENT - Cache essential assets
// ============================================================================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    (async () => {
      try {
        // Cache static assets
        const staticCache = await caches.open(CACHE_NAMES.STATIC);
        await staticCache.addAll(PRECACHE_URLS.filter(url => url !== '/offline.html'));

        console.log('[SW] Static cache created');

        // Skip waiting - activate immediately
        self.skipWaiting();
      } catch (error) {
        console.error('[SW] Install failed:', error);
      }
    })()
  );
});

// ============================================================================
// ACTIVATE EVENT - Clean up old caches
// ============================================================================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      const cachesToDelete = cacheNames.filter(
        (name) => !Object.values(CACHE_NAMES).includes(name)
      );

      await Promise.all(cachesToDelete.map((name) => caches.delete(name)));

      if (cachesToDelete.length > 0) {
        console.log('[SW] Deleted old caches:', cachesToDelete);
      }

      // Claim all clients
      self.clients.claim();
    })()
  );
});

// ============================================================================
// FETCH EVENT - Cache strategies for different content types
// ============================================================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different content types with appropriate strategies
  if (isImageRequest(url)) {
    event.respondWith(cacheImageStrategy(request));
  } else if (isApiRequest(url)) {
    event.respondWith(cacheApiStrategy(request));
  } else if (isStaticAsset(url)) {
    event.respondWith(cacheStaticStrategy(request));
  } else {
    event.respondWith(networkFirstStrategy(request));
  }
});

// ============================================================================
// CACHE STRATEGIES
// ============================================================================

/**
 * Cache First Strategy - Return cached version, update in background
 * Best for: Images, assets that don't change often
 */
async function cacheImageStrategy(request) {
  const cacheName = CACHE_NAMES.IMAGES;
  const url = request.url;

  try {
    // Check cache first
    const cached = await caches.match(request);
    if (cached && !isExpired(cached)) {
      // Update cache in background
      updateCacheInBackground(url, cacheName);
      return cached;
    }

    // Not in cache or expired - fetch from network
    const response = await fetch(request);

    // Cache successful responses
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Return cached version if available, even if expired
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    // Return offline image placeholder
    return createOfflineImage();
  }
}

/**
 * Stale While Revalidate Strategy - Return cached, update in background
 * Best for: API data, content that can be slightly stale
 */
async function cacheApiStrategy(request) {
  const cacheName = CACHE_NAMES.API;
  const url = request.url;

  try {
    // Return cached response immediately
    const cached = await caches.match(request);
    if (cached && !isExpired(cached)) {
      // Update cache in background
      updateCacheInBackground(url, cacheName);
      return cached;
    }

    // No cache or expired - fetch from network
    const response = await fetch(request);

    // Cache successful JSON responses
    if (response && response.status === 200 && isJsonResponse(response)) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Return cached version if available
    const cached = await caches.match(request);
    if (cached) {
      console.log('[SW] Serving cached API response:', url);
      return cached;
    }

    // Return offline response
    return createOfflineResponse();
  }
}

/**
 * Cache Static Strategy - Cache static assets
 * Best for: CSS, JS, HTML
 */
async function cacheStaticStrategy(request) {
  try {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    const response = await fetch(request);

    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAMES.STATIC);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    return createOfflineResponse();
  }
}

/**
 * Network First Strategy - Try network first, fallback to cache
 * Best for: HTML pages
 */
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);

    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAMES.STATIC);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    return createOfflineResponse();
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if request is for an image
 */
function isImageRequest(url) {
  return /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(url.pathname) ||
         url.pathname.includes('/api/image/') ||
         url.hostname === 'static.kuhandranchatbot.info' &&
         (url.pathname.includes('/image/') || /\.(webp|png|jpg|jpeg|gif)$/i.test(url.pathname));
}

/**
 * Check if request is for API endpoint
 */
function isApiRequest(url) {
  return url.pathname.includes('/api/') && !isImageRequest(url);
}

/**
 * Check if request is for static asset
 */
function isStaticAsset(url) {
  return /\.(css|js|woff|woff2|ttf|eot)$/i.test(url.pathname);
}

/**
 * Check if cached response is expired
 */
function isExpired(response) {
  const cacheControl = response.headers.get('cache-control');
  const dateHeader = response.headers.get('date');

  if (!dateHeader) {
    return false; // Assume fresh if no date header
  }

  const cacheDate = new Date(dateHeader).getTime();
  const now = Date.now();
  const maxAge = CACHE_MAX_AGE.IMAGES; // Default to image cache age

  return (now - cacheDate) > maxAge;
}

/**
 * Check if response is JSON
 */
function isJsonResponse(response) {
  const contentType = response.headers.get('content-type');
  return contentType && contentType.includes('application/json');
}

/**
 * Update cache in background
 */
async function updateCacheInBackground(url, cacheName) {
  try {
    const response = await fetch(url);
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(url, response);
    }
  } catch (error) {
    console.warn('[SW] Failed to update cache for:', url, error);
  }
}

/**
 * Create offline response
 */
function createOfflineResponse() {
  return new Response(
    JSON.stringify({
      error: 'Offline - No cached data available',
      timestamp: new Date().toISOString(),
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }
  );
}

/**
 * Create offline image placeholder
 */
function createOfflineImage() {
  // Return a simple SVG placeholder image
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <rect width="400" height="300" fill="#e0e0e0"/>
      <text x="50%" y="50%" font-size="18" fill="#999" text-anchor="middle" dy=".3em">
        Image unavailable (offline)
      </text>
    </svg>
  `;

  return new Response(svg, {
    status: 200,
    headers: new Headers({
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-store',
    }),
  });
}

// ============================================================================
// MESSAGE HANDLER - Handle messages from clients
// ============================================================================

self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'CACHE_API':
      cacheApiUrl(data.url);
      break;

    case 'CLEAR_CACHE':
      clearAllCaches();
      break;

    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'PRECACHE_URLS':
      precacheUrls(data.urls);
      break;

    default:
      console.warn('[SW] Unknown message type:', type);
  }
});

/**
 * Cache a single API URL
 */
async function cacheApiUrl(url) {
  try {
    const response = await fetch(url);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAMES.API);
      cache.put(url, response);
      console.log('[SW] Cached API URL:', url);
    }
  } catch (error) {
    console.warn('[SW] Failed to cache URL:', url, error);
  }
}

/**
 * Pre-cache multiple URLs
 */
async function precacheUrls(urls) {
  for (const url of urls) {
    await cacheApiUrl(url);
  }
}

/**
 * Clear all caches
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));
  console.log('[SW] All caches cleared');
}

console.log('[SW] Service Worker loaded');
