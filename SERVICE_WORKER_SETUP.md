# Service Worker & Caching Guide

## Overview

The service worker (`public/sw.js`) implements comprehensive caching strategies for improved performance and offline support. It caches:

- **Images** - All images including profile, projects, company logos
- **API Responses** - Collection data, config, and other API endpoints  
- **Static Assets** - CSS, JavaScript, and fonts
- **CDN Content** - Static content from CDN

## Cache Strategies

### 1. Cache-First (Images & Static Assets)
- Returns cached version immediately
- Updates cache in background
- Falls back to offline placeholder if unavailable

**Best for:** Images, logos, company icons

### 2. Stale-While-Revalidate (API Data)
- Returns cached data immediately
- Fetches fresh data in background
- Ensures always-fresh data without waiting

**Best for:** Projects, experience, skills data

### 3. Network-First (HTML Pages)
- Tries network first
- Falls back to cache if offline
- Caches successful responses

**Best for:** Main pages, dynamic content

## Cache Names & Ages

```typescript
// Cache version: v1.0.0

CACHE_NAMES = {
  STATIC: 'v1.0.0-static'    // 1 day
  API: 'v1.0.0-api'          // 7 days
  IMAGES: 'v1.0.0-images'    // 30 days
  CDN: 'v1.0.0-cdn'          // 7 days
}
```

## Cached Content

### Images
- Profile pictures
- Project screenshots
- Company logos
- SVG icons
- WebP optimized versions

### API Endpoints
- `https://static.kuhandranchatbot.info/api/collections/*/data/*.json`
- `https://api-gateway-9unh.onrender.com/api/*`
- Config and manifest files

### Static Assets
- CSS files
- JavaScript bundles
- Web fonts (WOFF, WOFF2)

## Auto Pre-caching

The service worker automatically pre-caches on install:

```typescript
PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html' (optional)
]
```

On activation, ServiceWorkerManager pre-caches essential data:

```typescript
contentLabels.json
projects.json
experience.json
skills.json
```

## Service Worker Lifecycle

### 1. Install
- Caches static assets
- Skips waiting (activates immediately)

### 2. Activate
- Cleans up old cache versions
- Claims all clients

### 3. Fetch
- Intercepts all GET requests
- Applies appropriate cache strategy
- Falls back to offline response if needed

## Usage

### Automatic Setup

The `ServiceWorkerManager` component handles registration automatically:

```tsx
// In src/app/layout.tsx (already added)
import { ServiceWorkerManager } from '@/pwa';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ServiceWorkerManager />
        {children}
      </body>
    </html>
  );
}
```

### Manual Cache Management

```typescript
import {
  precacheApis,
  precacheImages,
  precacheCdnContent,
  clearAllCaches,
  clearCache,
  getCachedResponse,
  getCacheSize,
  updateServiceWorker,
  initializeDefaultCache,
} from '@/pwa';

// Pre-cache specific API URLs
await precacheApis([
  'https://static.kuhandranchatbot.info/api/collections/en/data/projects.json',
  'https://static.kuhandranchatbot.info/api/collections/en/data/experience.json',
]);

// Pre-cache images
await precacheImages([
  'https://static.kuhandranchatbot.info/image/profile.webp',
  'https://static.kuhandranchatbot.info/image/project-1.webp',
]);

// Pre-cache CDN content
await precacheCdnContent([
  'https://static.kuhandranchatbot.info/api/collections/en/data/contentLabels.json',
]);

// Clear all caches
await clearAllCaches();

// Clear specific cache
await clearCache('v1.0.0-api');

// Get cache information
const cachedResponse = await getCachedResponse(url);
const cacheSizes = await getCacheSize();

// Check for and install updates
const hasUpdate = await updateServiceWorker();

// Initialize default cache on first load
await initializeDefaultCache('en');
```

### Offline Status

```typescript
import { useOnlineStatus, isOffline, onOfflineStatusChange } from '@/pwa';

// React hook
function MyComponent() {
  const isOnline = useOnlineStatus();
  return <div>{isOnline ? 'Online' : 'Offline'}</div>;
}

// Synchronous check
if (isOffline()) {
  console.log('App is offline');
}

// Listen for status changes
const unsubscribe = onOfflineStatusChange((isOffline) => {
  if (isOffline) {
    console.log('Went offline');
  } else {
    console.log('Back online');
  }
});
```

## Debugging

### Chrome DevTools

1. Open DevTools → Application tab
2. Navigate to Service Workers section
3. View registered workers and their status

### View Caches

1. DevTools → Application → Cache Storage
2. Expand cache versions to see stored URLs
3. Click entries to view cached responses

### Clear Service Worker

```javascript
// In browser console
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
  caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
  });
}
```

## Cache Invalidation

To force a cache update, increment the version in `sw.js`:

```typescript
// Before
const CACHE_VERSION = 'v1.0.0';

// After
const CACHE_VERSION = 'v1.0.1';
```

This creates new cache storage, and old caches are automatically deleted during activation.

## Performance Impact

### Benefits
- **Offline Support** - App works without internet
- **Faster Loads** - Cached assets serve instantly
- **Reduced Bandwidth** - Less API calls and image downloads
- **Better UX** - Instant navigation between pages

### Trade-offs
- **Storage Usage** - ~50-100MB for typical portfolio
- **Stale Data** - API might show cached data briefly
- **Updates** - Cache invalidation needed for fresh content

## Best Practices

1. **Pre-cache critical data** on app load
2. **Update cache version** when changing caching strategy
3. **Monitor cache size** to avoid storage issues
4. **Handle offline gracefully** with fallback UI
5. **Test offline behavior** before deploying

## API References

- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
