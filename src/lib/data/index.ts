/**
 * Data Loader Module
 * Loads all data from remote CDN endpoints
 * All data sources from: https://static.kuhandranchatbot.info/data/
 */

// Cache for fetched data
let projectsData: any = null;
let experienceData: any = null;
let skillsData: any = null;
let educationData: any = null;
let achievementsData: any = null;
let contentLabels: any = null;

const CDN_BASE_URL = 'https://static.kuhandranchatbot.info/data';

// Generic fetch function with caching and error handling
async function fetchDataFromCDN(filename: string, defaultValue: any = null) {
  try {
    const response = await fetch(`${CDN_BASE_URL}/${filename}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error);
    return defaultValue;
  }
}

// Dynamic imports of JSON data from remote CDN
export async function loadAllData() {
  try {
    const [projects, experience, skills, education, labels, achievements] = await Promise.all([
      fetchDataFromCDN('projects.json', []),
      fetchDataFromCDN('experience.json', []),
      fetchDataFromCDN('skills.json', {}),
      fetchDataFromCDN('education.json', []),
      fetchDataFromCDN('contentLabels.json', {}),
      fetchDataFromCDN('achievements.json', { awards: [], certifications: [] }),
    ]);

    projectsData = projects;
    experienceData = experience;
    skillsData = skills;
    educationData = education;
    contentLabels = labels;
    achievementsData = achievements;
  } catch (error) {
    console.error('Error loading data files:', error);
  }
}

// Getters for data (with fallback for synchronous usage)
export function getProjectsData() {
  return projectsData || [];
}

export function getExperienceData() {
  return experienceData || [];
}

export function getSkillsData() {
  return skillsData || {};
}

export function getEducationData() {
  return educationData || [];
}

export function getAchievementsData() {
  return achievementsData || { awards: [], certifications: [] };
}

export function getContentLabels() {
  return contentLabels || {};
}

// Export data directly for synchronous imports
export { projectsData, experienceData, skillsData, educationData, achievementsData, contentLabels };
