import { PageLayoutConfig } from '@/lib/config/types';
import { projectsData } from '@/lib/data/projects';
import { experienceData } from '@/lib/data/experience';
import { skillsData } from '@/lib/data/skills';
import { educationData } from '@/lib/data/education';
import { achievementsData } from '@/lib/data/achievements';
import { contentLabels } from '@/lib/data/contentLabels';
import layoutConfigJson from '../../../public/config/pageLayout.json';

/**
 * Main Page Layout Configuration
 * Loaded from public/config/pageLayout.json
 * Returns configuration as a function to avoid serialization issues
 * Defines the structure, order, and styling of all sections
 * Data-driven rendering with reusable components
 */

// Helper function to resolve dataSource references to actual data
function resolveDataSources(config: any): PageLayoutConfig {
  return {
    ...config,
    sections: config.sections.map((section: any) => {
      // Resolve data source references
      if (section.dataSource) {
        const dataSources: Record<string, any> = {
          projects: projectsData,
          experience: experienceData,
          skills: skillsData,
          education: educationData,
          achievements: [...achievementsData.awards, ...achievementsData.certifications],
        };
        
        return {
          ...section,
          data: dataSources[section.dataSource] || section.data,
        };
      }
      
      // Resolve header labels from contentLabels if needed
      if (section.header && !section.header.subtitle && section.id) {
        const sectionLabels = (contentLabels as any)[section.id];
        if (sectionLabels) {
          return {
            ...section,
            header: {
              subtitle: sectionLabels.subtitle || section.header.subtitle,
              title: sectionLabels.title || section.header.title,
              description: sectionLabels.description || section.header.description,
            },
          };
        }
      }
      
      return section;
    }),
  };
}

export function getPageLayoutConfig(): PageLayoutConfig {
  return resolveDataSources(layoutConfigJson);
}