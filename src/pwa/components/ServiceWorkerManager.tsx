'use client';

import { useEffect, useState } from 'react';

/**
 * Browser Native Cache API Manager
 * Uses browser's Cache API for offline support
 * No service worker needed - caching handled by fetch interceptors and cache strategies
 */
export function ServiceWorkerManager() {
  const [isCacheReady, setIsCacheReady] = useState(false);

  useEffect(() => {
    // Only initialize in browser environment
    if (typeof window === 'undefined') return;

    const initializeCache = async () => {
      try {
        // Check if Cache API is available
        if ('caches' in window) {
          setIsCacheReady(true);
          console.log('[Cache] Browser Cache API available');
          // Cache warming is handled at request time to avoid response cloning issues
        }
      } catch (error) {
        console.warn('[Cache] Initialization error:', error);
      }
    };

    initializeCache();
  }, []);

  return null; // This component doesn't render anything
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
