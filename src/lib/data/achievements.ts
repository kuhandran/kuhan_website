/**
 * Achievements Data
 * Uses fetchCollectionData — reads from local public/collections/en/data/achievements.json
 * on the server side, and falls back to CDN on the client.
 */

import { fetchCollectionData } from '@/lib/api/fetchers';
import { DEFAULT_LANGUAGE, SupportedLanguage } from '@/lib/config/domains';

export interface Award {
  name: string;
  organization: string;
  year: string;
  icon: string;
  description: string;
}

export interface Certification {
  name: string;
  provider: string;
  year: string;
  icon: string;
  credentialUrl: string;
}

export interface AchievementsData {
  awards: Award[];
  certifications: Certification[];
}

const FALLBACK: AchievementsData = {
  awards: [
    {
      name: 'ACS Skills Assessment',
      organization: 'Australian Computer Society (ACS)',
      year: '2024',
      icon: '🇦🇺',
      description:
        'Positively assessed by the ACS — qualifies for Australian skilled migration visa subclasses 189, 190 and 491.',
    },
    {
      name: 'Technical Delivery Excellence',
      organization: 'FWD Technology and Innovation Malaysia Sdn. Bhd',
      year: '2023',
      icon: '🏆',
      description:
        'Recognised for outstanding technical leadership delivering enterprise insurance platform features for millions of FWD customers.',
    },
    {
      name: 'Digital Transformation Champion',
      organization: 'Maybank Shared Services',
      year: '2021',
      icon: '🎯',
      description:
        'Awarded for leading banking workflow modernisation and high-impact Power BI dashboards for Maybank Malaysia.',
    },
    {
      name: 'Best Innovation Project',
      organization: 'INTI International University',
      year: '2016',
      icon: '⭐',
      description:
        'Best project recognition for an automated academic scheduling system during undergraduate studies.',
    },
  ],
  certifications: [
    {
      name: 'Master of Business Administration (MBA)',
      provider: 'Cardiff Metropolitan University, Wales, UK',
      year: '2022',
      icon: '🎓',
      credentialUrl: 'https://www.cardiffmet.ac.uk',
    },
    {
      name: 'Bachelor of Computer Science',
      provider: 'University of Wollongong (UOW) — Australian University',
      year: '2017',
      icon: '🎓',
      credentialUrl: 'https://www.uow.edu.au',
    },
    {
      name: 'IELTS — English Proficiency (Band 6.0+)',
      provider: 'British Council / IDP',
      year: '2024',
      icon: '🌐',
      credentialUrl: 'https://www.ielts.org',
    },
    {
      name: 'React & React Native Developer',
      provider: 'Meta / Coursera',
      year: '2023',
      icon: '⚛️',
      credentialUrl: 'https://www.coursera.org',
    },
    {
      name: 'Microsoft Power BI Data Analyst',
      provider: 'Microsoft',
      year: '2022',
      icon: '📊',
      credentialUrl: 'https://learn.microsoft.com/en-us/certifications/power-bi-data-analyst-associate/',
    },
    {
      name: 'AWS Cloud Practitioner',
      provider: 'Amazon Web Services',
      year: '2023',
      icon: '☁️',
      credentialUrl: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
    },
    {
      name: 'Agile Project Management (PMI-ACP)',
      provider: 'Project Management Institute',
      year: '2021',
      icon: '🏃',
      credentialUrl: 'https://www.pmi.org/certifications/agile-acp',
    },
    {
      name: 'Oracle Certified Associate — Java SE 8',
      provider: 'Oracle University',
      year: '2019',
      icon: '☕',
      credentialUrl: 'https://www.oracle.com/certification/',
    },
  ],
};

export async function fetchAchievementsData(
  language: SupportedLanguage = DEFAULT_LANGUAGE
): Promise<AchievementsData> {
  try {
    const raw = await fetchCollectionData<Record<string, unknown>>('achievements', language);
    const data = raw as unknown as AchievementsData;

    const awards = Array.isArray(data.awards) ? data.awards : [];
    const certifications = Array.isArray(data.certifications) ? data.certifications : [];

    return {
      awards:         awards.length         > 0 ? awards         : FALLBACK.awards,
      certifications: certifications.length  > 0 ? certifications : FALLBACK.certifications,
    };
  } catch {
    return FALLBACK;
  }
}
