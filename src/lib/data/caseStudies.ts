/**
 * Case Studies Data Module
 * Loads case study data from public JSON file with fallback support
 * Supports environment-aware data sources (local JSON or CDN)
 */

import { getDataSourceUrl } from '../config/loaders';

/**
 * Case Study Type Definition
 */
export interface CaseStudy {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  image: string;
  clientLogo?: string;
  category?: string;
  technologies?: string[];
  techStack?: string[];
  challenge: string;
  solution: string;
  solutionDetails?: {
    architecture?: string;
    frontend?: string;
    backend?: string;
    synchronization?: string;
    security?: string;
  };
  results?: {
    metric: string;
    value: string | number;
    description?: string;
  }[];
  achievements?: string[];
  keyAchievements?: string[];
  timeline?: string;
  duration?: string;
  featured?: boolean;
  client?: string;
  location?: string;
  role?: string;
  roleDescription?: string;
  team?: {
    size: number;
    roles?: string[];
    collaborators?: string[];
  };
  teamSize?: number;
  brief?: string;
  challenges?: string[];
  lessons?: string[];
  relatedProjects?: string[];
  liveUrl?: string;
  githubUrl?: string | null;
  caseStudyUrl?: string;
  testimonial?: {
    quote: string;
    author: string;
    title: string;
  };
  metrics?: {
    userSatisfaction?: number;
    performanceScore?: number;
    uptime?: string;
    dailyActiveUsers?: string;
  };
}

/**
 * Fallback case studies in case JSON fetch fails
 * These are used as emergency backup data
 */
export const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'fwd-claims-portal',
    title: 'FWD Claims Portal',
    description: 'Built automated claims processing system for insurance company',
    image: '/images/case-studies/fwd.jpg',
    category: 'Web Application',
    technologies: ['React', 'Node.js', 'MongoDB', 'Docker'],
    challenge: 'Process high volume of insurance claims with minimal manual intervention',
    solution: 'Built intelligent form system with validation and automated routing',
    results: [
      { metric: 'Processing Time', value: '80% faster' },
      { metric: 'Error Rate', value: '90% reduction' },
      { metric: 'User Satisfaction', value: '4.8/5.0' },
    ],
    achievements: [
      'Automated 95% of claim processing',
      'Reduced processing time from days to hours',
      'Improved customer satisfaction scores',
    ],
    featured: true,
    timeline: '6 months',
    client: 'FWD Insurance',
  },
];

let cachedCaseStudies: CaseStudy[] | null = null;

/**
 * Fetches case studies from public JSON file
 * Supports both direct array format and nested { caseStudies: [...] } format
 * Uses environment-aware URLs (local or CDN)
 *
 * @returns Promise<CaseStudy[]> - Array of case studies
 */
async function fetchCaseStudiesFromJSON(): Promise<CaseStudy[]> {
  try {
    const url = getDataSourceUrl('caseStudies');

    const response = await fetch(url, {
      cache: 'force-cache',
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle both formats: direct array or nested object
    const caseStudies = Array.isArray(data) ? data : data.caseStudies || [];

    if (!Array.isArray(caseStudies)) {
      throw new Error('Invalid JSON structure: expected array or { caseStudies: [...] }');
    }

    return caseStudies;
  } catch {
    // Fallback to hardcoded case studies on any error
    return DEFAULT_CASE_STUDIES;
  }
}

/**
 * Loads case studies with caching
 * First call fetches from JSON, subsequent calls return cached data
 *
 * @returns Promise<CaseStudy[]> - Cached or fetched case studies
 */
export async function loadCaseStudies(): Promise<CaseStudy[]> {
  if (cachedCaseStudies !== null) {
    return cachedCaseStudies;
  }

  cachedCaseStudies = await fetchCaseStudiesFromJSON();
  return cachedCaseStudies;
}

/**
 * Gets a single case study by slug
 *
 * @param slug - The case study slug
 * @returns Promise<CaseStudy | null> - The case study or null if not found
 */
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const caseStudies = await loadCaseStudies();
  const study = caseStudies.find((cs) => cs.slug === slug);

  if (!study) {
    return null;
  }

  return study;
}

/**
 * Gets all case studies
 *
 * @returns Promise<CaseStudy[]> - All case studies
 */
export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  return await loadCaseStudies();
}

/**
 * Gets featured case studies
 *
 * @returns Promise<CaseStudy[]> - Featured case studies only
 */
export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  const caseStudies = await loadCaseStudies();
  return caseStudies.filter((cs) => cs.featured === true);
}

/**
 * Gets related case studies (same category, excluding current)
 *
 * @param currentSlug - The current case study slug to exclude
 * @param limit - Maximum number of related studies to return
 * @returns Promise<CaseStudy[]> - Related case studies
 */
export async function getRelatedCaseStudies(
  currentSlug: string,
  limit: number = 3
): Promise<CaseStudy[]> {
  const allStudies = await loadCaseStudies();
  const currentStudy = allStudies.find((cs) => cs.slug === currentSlug);

  if (!currentStudy) {
    return allStudies.slice(0, limit);
  }

  return allStudies
    .filter((cs) => cs.category === currentStudy.category && cs.slug !== currentSlug)
    .slice(0, limit);
}

/**
 * Case studies data export (maintains backward compatibility)
 */
export const caseStudies = DEFAULT_CASE_STUDIES;
