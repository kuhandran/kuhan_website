'use client';

import { useEffect, useState } from 'react';

/**
 * Service Worker Manager
 * Registers service worker, caches API data, and manages offline support
 */
export function ServiceWorkerManager() {
  const [isCacheReady, setIsCacheReady] = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    // Only initialize in browser environment
    if (typeof window === 'undefined') return;

    const initializeServiceWorker = async () => {
      try {
        // Register service worker
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none',
          });

          console.log('[SW] Service worker registered:', registration.scope);
          setSwRegistered(true);

          // Check for updates periodically
          const updateCheckInterval = setInterval(async () => {
            try {
              await registration.update();
            } catch (error) {
              console.warn('[SW] Update check failed:', error);
            }
          }, 60000); // Check every 60 seconds

          // Listen for controller change
          let refreshing = false;
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            console.log('[SW] New service worker activated, reloading...');
            window.location.reload();
          });

          return () => clearInterval(updateCheckInterval);
        }

        // Check if Cache API is available
        if ('caches' in window) {
          setIsCacheReady(true);
          console.log('[SW] Browser Cache API available');
        }

        // Pre-cache essential API endpoints
        await precacheEssentialData();
      } catch (error) {
        console.warn('[SW] Initialization error:', error);
      }
    };

    const cleanup = initializeServiceWorker();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return null; // This component doesn't render anything
}

/**
 * Pre-cache essential API endpoints and data
 */
async function precacheEssentialData() {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return;
  }

  const essentialUrls = [
    'https://static.kuhandranchatbot.info/api/collections/en/data/contentLabels.json',
    'https://static.kuhandranchatbot.info/api/collections/en/data/projects.json',
    'https://static.kuhandranchatbot.info/api/collections/en/data/experience.json',
    'https://static.kuhandranchatbot.info/api/collections/en/data/skills.json',
  ];

  essentialUrls.forEach((url) => {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_API',
      data: { url },
    });
  });

  console.log('[SW] Sent pre-cache request for essential data');
}

/**
 * Hook to check if app is online
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('[App] Back online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('[App] Went offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
