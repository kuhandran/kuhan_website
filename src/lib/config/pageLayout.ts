import { PageLayoutConfig } from '@/lib/config/types';
import { projectsData } from '@/lib/data/projects';
import { experienceData } from '@/lib/data/experience';
import { skillsData } from '@/lib/data/skills';
import { educationData } from '@/lib/data/education';
import { contentLabels } from '@/lib/data/contentLabels';
import { fetchPageLayout, getPageLayoutSync } from '@/lib/config/loaders';
import { fetchCollectionData } from '@/lib/api/fetchers';
import { DEFAULT_LANGUAGE, SupportedLanguage } from '@/lib/config/domains';

/**
 * Main Page Layout Configuration
 * Loaded from CDN: https://static.kuhandranchatbot.info/config/pageLayout.json
 * Returns configuration as a function to avoid serialization issues
 * Defines the structure, order, and styling of all sections
 * Data-driven rendering with reusable components
 */

// Helper function to resolve dataSource references to actual data
async function resolveDataSources(config: unknown, language: SupportedLanguage = DEFAULT_LANGUAGE): Promise<PageLayoutConfig> {
  // Safely handle null/undefined config or sections
  if (!config || typeof config !== 'object' || !('sections' in config)) {
    return { sections: [] };
  }
  
  const configObj = config as Record<string, unknown>;
  if (!Array.isArray(configObj.sections)) {
    return { sections: [] };
  }

  // Fetch achievements and case studies data (these aren't pre-imported)
  let achievementsData: unknown = [];
  let caseStudiesData: unknown = [];
  
  try {
    achievementsData = await fetchCollectionData('achievements', language);
  } catch (error) {
    console.warn('[PageLayout] Failed to fetch achievements:', error);
  }

  try {
    caseStudiesData = await fetchCollectionData('caseStudies', language);
  } catch (error) {
    console.warn('[PageLayout] Failed to fetch caseStudies:', error);
  }

  return {
    ...configObj,
    sections: configObj.sections.map((section: unknown) => {
      if (!section || typeof section !== 'object') {
        return section;
      }
      
      const sectionObj = section as Record<string, unknown>;
      const processedSection = { ...sectionObj };
      
      // Resolve data source references
      if (processedSection.dataSource) {
        const dataSources: Record<string, unknown> = {
          projects: projectsData,
          experience: experienceData,
          skills: skillsData,
          education: educationData,
          achievements: achievementsData,
          caseStudies: caseStudiesData,
        };
        
        const sourceKey = processedSection.dataSource as string;
        const sourceData = dataSources[sourceKey];
        
        // Ensure data is always an array or empty array
        processedSection.data = Array.isArray(sourceData) ? sourceData : Array.isArray(processedSection.data) ? processedSection.data : [];
      }
      
      // Resolve header labels from contentLabels if needed
      if (processedSection.header && processedSection.id) {
        const headerObj = processedSection.header as Record<string, unknown>;
        if (!headerObj.subtitle && processedSection.id) {
          const sectionLabels = (contentLabels as Record<string, unknown>)[processedSection.id as string];
          if (sectionLabels && typeof sectionLabels === 'object') {
            const labelsObj = sectionLabels as Record<string, unknown>;
            processedSection.header = {
              subtitle: labelsObj.subtitle || headerObj.subtitle,
              title: labelsObj.title || headerObj.title,
              description: labelsObj.description || headerObj.description,
            };
          }
        }
      }
      
      // Final safety: ensure data is always an array if it exists
      if ('data' in processedSection && processedSection.data !== null && processedSection.data !== undefined) {
        if (!Array.isArray(processedSection.data)) {
          processedSection.data = [];
        }
      }
      
      return processedSection;
    }),
  } as PageLayoutConfig;
}

export async function getPageLayoutConfig(language: SupportedLanguage = DEFAULT_LANGUAGE): Promise<PageLayoutConfig> {
  const layoutConfigJson = await fetchPageLayout();
  return resolveDataSources(layoutConfigJson, language);
}

/**
 * Get page layout without async data resolution
 * Returns config with empty arrays for achievements/caseStudies
 * Used when you need sync access to cached layout
 */
export function getPageLayoutConfigSync(): PageLayoutConfig {
  const layoutConfigJson = getPageLayoutSync();
  
  // Safely handle null/undefined config or sections
  if (!layoutConfigJson || typeof layoutConfigJson !== 'object' || !('sections' in layoutConfigJson)) {
    return { sections: [] };
  }
  
  const configObj = layoutConfigJson as Record<string, unknown>;
  if (!Array.isArray(configObj.sections)) {
    return { sections: [] };
  }
  
  // Note: This sync version doesn't fetch achievements/caseStudies
  // Those are only available through getPageLayoutConfig() async version
  return {
    ...configObj,
    sections: configObj.sections.map((section: unknown) => {
      if (!section || typeof section !== 'object') {
        return section;
      }
      
      const sectionObj = section as Record<string, unknown>;
      const processedSection = { ...sectionObj };
      
      // Resolve header labels from contentLabels if needed
      if (processedSection.header && processedSection.id) {
        const headerObj = processedSection.header as Record<string, unknown>;
        if (!headerObj.subtitle && processedSection.id) {
          const sectionLabels = (contentLabels as Record<string, unknown>)[processedSection.id as string];
          if (sectionLabels && typeof sectionLabels === 'object') {
            const labelsObj = sectionLabels as Record<string, unknown>;
            processedSection.header = {
              subtitle: labelsObj.subtitle || headerObj.subtitle,
              title: labelsObj.title || headerObj.title,
              description: labelsObj.description || headerObj.description,
            };
          }
        }
      }
      
      return processedSection;
    }),
  } as PageLayoutConfig;
}