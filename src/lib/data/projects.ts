/**
 * Projects Data Loader
 * Loads projects from JSON:
 * - Development: /data/projects.json (local)
 * - Production: https://static.kuhandranchatbot.info/data/projects.json (CDN)
 */

import React from 'react';
import { ProjectCardProps } from '@/lib/config/types';
import { getDataSourceUrl } from '@/lib/config/dataConfig';

const DATA_URL = getDataSourceUrl('projects.json');

// Empty array as ultimate fallback
const EMPTY_PROJECTS: ProjectCardProps[] = [];

const fetchProjects = async () => {
  try {
    console.log(`[Projects] Fetching from: ${DATA_URL}`);
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      console.warn(`[Projects] HTTP ${response.status}: ${DATA_URL}`);
      return EMPTY_PROJECTS;
    }
    const data = await response.json();
    console.log(`[Projects] ✓ Successfully loaded ${data.length} projects`);
    return data;
  } catch (error) {
    console.error(`[Projects] Error loading: ${error}`);
    return EMPTY_PROJECTS;
  }
};

export const projectsData: ProjectCardProps[] = [];

export const useProjects = () => {
  const [projects, setProjects] = React.useState<ProjectCardProps[]>(EMPTY_PROJECTS);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetchProjects()
      .then((data) => {
        setProjects(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setProjects(EMPTY_PROJECTS);
      })
      .finally(() => setLoading(false));
  }, []);

  return { projects, error, loading };
};