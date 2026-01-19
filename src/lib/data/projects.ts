/**
 * Projects Data Loader
 * Loads projects from JSON:
 * - Development: /data/projects.json (local)
 * - Production: https://static.kuhandranchatbot.info/data/projects.json (CDN)
 */

import React from 'react';
import { ProjectCardProps } from '@/lib/config/types';
import { fetchProjects as fetchProjectsAPI } from '@/lib/api/apiClient';
import { SupportedLanguage, DEFAULT_LANGUAGE } from '@/lib/config/domains';
import { useLanguage } from '@/lib/hooks/useLanguageHook';

// Empty array as ultimate fallback
const EMPTY_PROJECTS: ProjectCardProps[] = [];

export const projectsData: ProjectCardProps[] = [];

export const useProjects = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = React.useState<ProjectCardProps[]>(EMPTY_PROJECTS);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        console.log(`[Projects] Loading projects for language: ${language}`);
        const data = await fetchProjectsAPI(language as SupportedLanguage);
        const projectItems = Array.isArray(data) ? (data as ProjectCardProps[]) : EMPTY_PROJECTS;
        setProjects(projectItems);
        setError(null);
      } catch (err) {
        console.error(`[Projects] Failed to load projects for language ${language}:`, err);
        setError(err instanceof Error ? err.message : 'Failed to load projects');
        setProjects(EMPTY_PROJECTS);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [language]); // Re-fetch when language changes

  return { projects, error, loading };
};