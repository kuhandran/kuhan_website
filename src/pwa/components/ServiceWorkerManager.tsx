'use client';

import { useEffect, useState } from 'react';

/**
 * Service Worker Registration Component
 * Registers the service worker and handles updates
 */
export function ServiceWorkerManager() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    // Only register in browser environment
    if (typeof window === 'undefined') return;

    const registerServiceWorker = async () => {
      try {
        if ('serviceWorker' in navigator) {
          // Add a small delay to ensure app is fully loaded
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none', // Always check for updates
          });

          console.log('[App] Service Worker registered:', registration);
          setIsInstalled(true);

          // Check for updates periodically
          const updateInterval = setInterval(() => {
            registration.update().catch((err) => {
              console.warn('[App] Update check failed:', err);
            });
          }, 60000); // Check every minute

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[App] Service Worker update available');
                  setHasUpdate(true);
                }
              });
            }
          });

          // Cleanup
          return () => clearInterval(updateInterval);
        }
      } catch (error) {
        console.warn('[App] Service Worker registration failed:', error);
        // Gracefully handle registration errors
      }
    };

    registerServiceWorker();

    // Handle controller change (when update is activated)
    navigator.serviceWorker?.addEventListener('controllerchange', () => {
      console.log('[App] Service Worker controller changed');
    });
  }, []);

  /**
   * Manually trigger update installation
   */
  const updateServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          // Tell waiting service worker to skip waiting
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          setHasUpdate(false);
          // Reload after short delay to ensure new SW is active
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    }
  };

  /**
   * Clear API cache and refresh
   */
  const clearCache = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.controller?.postMessage({
        type: 'CLEAR_CACHE',
      });
      
      // Also clear browser caches
      if ('caches' in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName);
          });
        });
      }
      
      console.log('[App] Cache cleared');
    }
  };

  /**
   * Pre-cache API files
   */
  const precacheApiFiles = () => {
    const apiFiles = [
      '/data/projects.json',
      '/data/experience.json',
      '/data/education.json',
      '/data/skills.json',
      '/data/achievements.json',
      '/data/caseStudies.json',
      '/data/contentLabels.json',
      '/config/pageLayout.json',
    ];

    apiFiles.forEach((url) => {
      navigator.serviceWorker.controller?.postMessage({
        type: 'CACHE_API',
        url,
      });
    });
  };

  // Return null - this is a background manager component
  return null;
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
