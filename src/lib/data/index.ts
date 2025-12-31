/**
 * Data Loader Module
 * Implements lazy loading pattern:
 * - Each component loads its own data via useXXX() hooks
 * - Data is fetched on-demand when component renders
 * - Uses production API with language codes
 * API: https://static-api-opal.vercel.app/api/collections/{language}/data/{fileType}.json
 */

import { getApiBaseUrl } from '@/lib/config/dataConfig';

// Individual data loaders are in their respective files:
// - src/lib/data/projects.ts (useProjects hook)
// - src/lib/data/experience.ts (useExperience hook)
// - src/lib/data/skills.ts (useSkills hook)
// - src/lib/data/education.ts (useEducation hook)
// - src/lib/data/achievements.ts (fetchAchievementsData)
// - src/lib/data/contentLabels.ts (useContentLabels hook)

// Each hook implements lazy loading via React.useEffect
// Data is only fetched when component mounts, not at app startup

// Optional: Preload specific data in the background
export async function preloadData(filenames: string[], languageCode: string = 'en') {
  const API_BASE_URL = getApiBaseUrl();
  
  try {
    await Promise.allSettled(
      filenames.map(async (filename) => {
        try {
          const url = `${API_BASE_URL}/collections/${languageCode}/data/${filename}`;
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          await response.json();
        } catch (error) {
          // Silent failure - data will be loaded on-demand
        }
      })
    );
  } catch (error) {
    // Silent failure - data will be loaded on-demand
  }
}

// Legacy function for backwards compatibility (now a no-op)
export async function loadAllData() {
  // Using lazy loading pattern - data loaded per component
}

