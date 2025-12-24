/**
 * Application Configuration Loader
 * Centralized loading of URLs and error messages from JSON files
 * Supports both client and server-side rendering
 */

let cachedUrlConfig: any = null;
let cachedErrorMessages: any = null;
let urlConfigPromise: Promise<any> | null = null;
let errorMessagesPromise: Promise<any> | null = null;

/**
 * Load URL configuration from external JSON file
 * Contains all service URLs, domains, paths, and CSP configuration
 */
export async function loadUrlConfig(): Promise<any> {
  if (cachedUrlConfig) return cachedUrlConfig;
  if (urlConfigPromise) return urlConfigPromise;

  urlConfigPromise = (async () => {
    try {
      const response = await fetch('/config/urlConfig.json');
      if (!response.ok) throw new Error('Failed to load URL config');
      cachedUrlConfig = await response.json();
      return cachedUrlConfig;
    } catch (error) {
      console.error('Error loading URL config:', error);
      urlConfigPromise = null;
      return {};
    }
  })();

  return urlConfigPromise;
}

/**
 * Load error messages from external JSON file
 * Contains all application error messages for easy multi-language support
 */
export async function loadErrorMessages(): Promise<any> {
  if (cachedErrorMessages) return cachedErrorMessages;
  if (errorMessagesPromise) return errorMessagesPromise;

  errorMessagesPromise = (async () => {
    try {
      const response = await fetch('/data/errorMessages.json');
      if (!response.ok) throw new Error('Failed to load error messages');
      cachedErrorMessages = await response.json();
      return cachedErrorMessages;
    } catch (error) {
      console.error('Error loading error messages:', error);
      errorMessagesPromise = null;
      return {};
    }
  })();

  return errorMessagesPromise;
}

/**
 * Get cached URL config (synchronous) - returns empty object if not yet loaded
 */
export function getUrlConfigSync(): any {
  return cachedUrlConfig || {};
}

/**
 * Get cached error messages (synchronous) - returns empty object if not yet loaded
 */
export function getErrorMessagesSync(): any {
  return cachedErrorMessages || {};
}

/**
 * Initialize app config (call during app startup)
 */
export async function initializeAppConfig(): Promise<void> {
  await Promise.all([loadUrlConfig(), loadErrorMessages()]);
}

/**
 * Get specific URL from config
 * Usage: getUrl('fullUrls.contactForm') -> "https://..."
 */
export async function getUrl(path: string): Promise<string> {
  const config = await loadUrlConfig();
  const keys = path.split('.');
  let value: any = config;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`URL path not found: ${path}`);
      return '';
    }
  }

  return typeof value === 'string' ? value : '';
}

/**
 * Get specific error message from config
 * Usage: getErrorMessage('contact.validation.missingFields') -> "All fields are required"
 */
export async function getErrorMessage(path: string, defaultMessage?: string): Promise<string> {
  const messages = await loadErrorMessages();
  const keys = path.split('.');
  let value: any = messages;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Error message path not found: ${path}`);
      return defaultMessage || path;
    }
  }

  return typeof value === 'string' ? value : defaultMessage || path;
}

/**
 * Get error message synchronously (uses cached data)
 */
export function getErrorMessageSync(path: string, defaultMessage?: string): string {
  const messages = getErrorMessagesSync();
  if (!messages || Object.keys(messages).length === 0) {
    return defaultMessage || path;
  }

  const keys = path.split('.');
  let value: any = messages;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultMessage || path;
    }
  }

  return typeof value === 'string' ? value : defaultMessage || path;
}

/**
 * Get URL synchronously (uses cached data)
 */
export function getUrlSync(path: string, defaultUrl?: string): string {
  const config = getUrlConfigSync();
  if (!config || Object.keys(config).length === 0) {
    return defaultUrl || '';
  }

  const keys = path.split('.');
  let value: any = config;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultUrl || '';
    }
  }

  return typeof value === 'string' ? value : defaultUrl || '';
}
