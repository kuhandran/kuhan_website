/**
 * Data Loader Module
 * Loads all data from JSON files in the public/data folder
 * This allows easy migration to backend services later
 */

// These will be populated from JSON imports
let projectsData: any = null;
let experienceData: any = null;
let skillsData: any = null;
let educationData: any = null;
let achievementsData: any = null;
let contentLabels: any = null;

// Dynamic imports of JSON data
export async function loadAllData() {
  try {
    const [projects, experience, skills, education, achievements, labels] = await Promise.all([
      import('../../../public/data/projects.json'),
      import('../../../public/data/experience.json'),
      import('../../../public/data/skills.json'),
      import('../../../public/data/education.json'),
      import('../../../public/data/achievements.json'),
      import('../../../public/data/contentLabels.json'),
    ]);

    projectsData = projects.default;
    experienceData = experience.default;
    skillsData = skills.default;
    educationData = education.default;
    achievementsData = achievements.default;
    contentLabels = labels.default;
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
