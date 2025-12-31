/**
 * Service Worker for PWA with JSON API Caching
 * Implements caching strategies for:
 * - Static assets (app shell)
 * - API calls (JSON data with stale-while-revalidate)
 * - Images (cache-first strategy)
 * - HTML pages (network-first strategy)
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAMES = {
  STATIC: `${CACHE_VERSION}-static`,
  DYNAMIC: `${CACHE_VERSION}-dynamic`,
  API: `${CACHE_VERSION}-api`,
  IMAGES: `${CACHE_VERSION}-images`,
};

// Assets to cache on install (app shell)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
];

// API endpoints to cache
const API_CACHE_ENDPOINTS = [
  '/data/projects.json',
  '/data/experience.json',
  '/data/education.json',
  '/data/skills.json',
  '/data/achievements.json',
  '/data/caseStudies.json',
  '/data/contentLabels.json',
  '/config/pageLayout.json',
  '/config/apiConfig.json',
];

// Static API endpoints (Vercel Static API)
const STATIC_API_BASE = 'https://static-api-opal.vercel.app';

// Image extensions to cache
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'];

/**
 * Install event - cache essential assets
 */
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAMES.STATIC)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          console.warn('[ServiceWorker] Some static assets failed to cache:', err);
        });
      })
      .then(() => {
        console.log('[ServiceWorker] Install complete, skipping waiting');
        return self.skipWaiting();
      })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Activation complete');
      return self.clients.claim();
    })
  );
});

/**
 * Fetch event - implement caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API calls to local /data/* and /config/* endpoints
  if (url.pathname.startsWith('/data/') || url.pathname.startsWith('/config/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle CDN data requests (stale-while-revalidate)
  if ((url.origin === 'https://static.kuhandranchatbot.info' || url.origin === 'https://static-api-opal.vercel.app') && 
      (url.pathname.startsWith('/data/') || url.pathname.startsWith('/config/') || url.pathname.startsWith('/api/'))) {
    event.respondWith(handleCdnApiRequest(request));
    return;
  }

  // Handle image requests (cache-first)
  if (isImageRequest(url)) {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Handle HTML pages (network-first)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(handleHtmlRequest(request));
    return;
  }

  // Handle everything else with network-first
  event.respondWith(handleDefaultRequest(request));
});

/**
 * Stale-While-Revalidate for JSON API calls
 * Returns cached version immediately, updates cache in background
 */
async function handleApiRequest(request) {
  const cacheKey = new Request(request.url);
  
  try {
    // Try to get from cache first
    const cachedResponse = await caches.match(cacheKey);
    
    // Fetch from network in background
    const fetchPromise = fetch(request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        
        // Cache successful responses
        const responseToCache = response.clone();
        caches.open(CACHE_NAMES.API).then((cache) => {
          cache.put(cacheKey, responseToCache);
          console.log('[ServiceWorker] Cached API:', request.url);
        });
        
        return response;
      })
      .catch((err) => {
        console.error('[ServiceWorker] Fetch error:', err);
        // If network fails and we have cache, return it
        return cachedResponse || new Response('Offline', { status: 503 });
      });

    // Return cached response if available, otherwise wait for network
    return cachedResponse || fetchPromise;
  } catch (error) {
    console.error('[ServiceWorker] Error in handleApiRequest:', error);
    // Return offline response
    return new Response(
      JSON.stringify({ error: 'Offline' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Handle CDN API requests with stale-while-revalidate
 */
async function handleCdnApiRequest(request) {
  const cacheKey = new Request(request.url);
  
  try {
    const cachedResponse = await caches.match(cacheKey);

    const fetchPromise = fetch(request)
      .then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAMES.API).then((cache) => {
          cache.put(cacheKey, responseToCache);
          console.log('[ServiceWorker] Cached CDN API:', request.url);
        });

        return response;
      })
      .catch(() => {
        return cachedResponse || new Response('Offline', { status: 503 });
      });

    return cachedResponse || fetchPromise;
  } catch (error) {
    console.error('[ServiceWorker] CDN API error:', error);
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Cache-First strategy for images
 * Uses cached version if available, otherwise fetches from network
 */
async function handleImageRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await fetch(request);

    if (!response || response.status !== 200) {
      return response;
    }

    const responseToCache = response.clone();
    caches.open(CACHE_NAMES.IMAGES).then((cache) => {
      cache.put(request, responseToCache);
      console.log('[ServiceWorker] Cached image:', request.url);
    });

    return response;
  } catch (error) {
    console.error('[ServiceWorker] Image request error:', error);
    // Return placeholder or offline image
    return new Response('', { status: 404 });
  }
}

/**
 * Network-First strategy for HTML pages
 * Tries network first, falls back to cache if offline
 */
async function handleHtmlRequest(request) {
  try {
    const response = await fetch(request);

    if (response && response.status === 200) {
      const responseToCache = response.clone();
      caches.open(CACHE_NAMES.DYNAMIC).then((cache) => {
        cache.put(request, responseToCache);
      });
      return response;
    }

    return response;
  } catch (error) {
    console.log('[ServiceWorker] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

/**
 * Default fetch handler for other resources
 */
async function handleDefaultRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error('[ServiceWorker] Default request error:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

/**
 * Check if request is for an image
 */
function isImageRequest(url) {
  return IMAGE_EXTENSIONS.some(ext => url.pathname.endsWith(ext));
}

/**
 * Message handler for cache management from client
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAMES.API).then(() => {
      console.log('[ServiceWorker] API cache cleared');
      event.ports[0].postMessage({ success: true });
    });
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_API') {
    const { url } = event.data;
    fetch(url)
      .then((response) => {
        if (response.status === 200) {
          caches.open(CACHE_NAMES.API).then((cache) => {
            cache.put(url, response.clone());
            console.log('[ServiceWorker] Manually cached:', url);
            event.ports[0].postMessage({ success: true });
          });
        }
      })
      .catch(() => {
        event.ports[0].postMessage({ success: false });
      });
  }
});

console.log('[ServiceWorker] Service Worker loaded');
