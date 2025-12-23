/**
 * Content Labels
 * Loaded from public/data/contentLabels.json
 * All UI labels, headers, descriptions organized hierarchically
 * Can be easily migrated to a backend API endpoint or CMS
 */

import labelsJson from '../../../public/data/contentLabels.json';

export const contentLabels = labelsJson;

/**
 * Helper function to get label by path
 * Usage: getLabel('hero.greeting') -> "Hi, I'm Kuhandran"
 */
export const getLabel = (path: string, defaultValue?: string): string => {
  const keys = path.split('.');
  let value: any = contentLabels;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue || path;
    }
  }

  return typeof value === 'string' ? value : defaultValue || path;
};
