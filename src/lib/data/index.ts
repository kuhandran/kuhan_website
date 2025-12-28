/**
 * Data Loader Module
 * Implements lazy loading pattern:
 * - Each component loads its own data via useXXX() hooks
 * - Data is fetched on-demand when component renders
 * - No eager/bulk loading - better performance
 * Development: http://localhost:3000/data/ (local public/data/)
 * Production: https://static.kuhandranchatbot.info/data/
 */

import { getDataBaseUrl } from '@/lib/config/dataConfig';

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
export async function preloadData(filenames: string[]) {
  const DATA_BASE_URL = getDataBaseUrl();

  console.log(`[Data Loader] Preloading data: ${filenames.join(', ')}`);
  
  try {
    await Promise.allSettled(
      filenames.map(async (filename) => {
        try {
          const url = `${DATA_BASE_URL}/${filename}`;
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          await response.json();
          console.log(`[Data Loader] ✓ Preloaded ${filename}`);
        } catch (error) {
          console.warn(`[Data Loader] Preload failed for ${filename}:`, error);
        }
      })
    );
  } catch (error) {
    console.error('[Data Loader] Preload error:', error);
  }
}

// Legacy function for backwards compatibility (now a no-op)
export async function loadAllData() {
  console.log('[Data Loader] Using lazy loading pattern - data loaded per component');
}

