/**
 * Case Studies Data
 * Detailed case study information with metrics, outcomes, and internal navigation
 */

export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  client: string;
  duration: string;
  role: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
  }[];
  techStack: string[];
  keyAchievements: string[];
  relatedProjects: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'fwd-insurance-react-native',
    title: 'FWD Insurance React Native App',
    subtitle: 'Enterprise Insurance Platform Transformation',
    description: 'Enterprise insurance platform with DMS, OWB, and UnderWrite Me modules for streamlined operations and enhanced user experience.',
    image: 'https://static.kuhandranchatbot.info/image/Project1.png',
    client: 'FWD Insurance',
    duration: '12 months',
    role: 'Full Stack Developer & Technical Lead',
    challenge: 'The insurance agents required a unified mobile platform to manage policies, underwriting, and claims. Legacy systems were fragmented, leading to inefficient workflows and reduced agent productivity.',
    solution: 'Developed a cross-platform React Native application with offline-first capabilities, real-time synchronization, and comprehensive DMS (Document Management System) integration. Implemented Redux for state management and TypeScript for type safety.',
    results: [
      { metric: 'Efficiency Improvement', value: '15%' },
      { metric: 'Agent Adoption', value: '98%' },
      { metric: 'Support Tickets', value: '-40%' },
      { metric: 'Processing Time', value: '-30%' }
    ],
    techStack: ['React Native', 'TypeScript', 'Redux', 'RESTful APIs', 'Firebase', 'SQLite'],
    keyAchievements: [
      'Implemented offline-first architecture for seamless operation without internet',
      'Reduced policy processing time by 30% through automated workflows',
      'Achieved 98% agent adoption within 3 months',
      'Reduced support tickets by 40% with intuitive UI design',
      'Enabled real-time data synchronization across all platforms'
    ],
    relatedProjects: ['banking-api-integration', 'maybank-digital-banking'],
    liveUrl: 'https://www.fwd.com/en/the-fwd-difference/doing-more-with-digital-technology/'
  },
  {
    slug: 'maybank-digital-banking',
    title: 'Maybank Digital Banking Platform',
    subtitle: 'Customer-Centric Banking Experience',
    description: 'Modern single-page application for digital banking services with optimized performance and seamless user experience.',
    image: 'https://static.kuhandranchatbot.info/image/Project2.png',
    client: 'Maybank Malaysia',
    duration: '8 months',
    role: 'Senior React Developer',
    challenge: 'Existing banking platform suffered from slow load times (4+ seconds), poor mobile responsiveness, and fragmented user experience across devices. Millions of daily users demanded better performance and usability.',
    solution: 'Rebuilt the banking platform using modern React architecture with advanced performance optimization. Implemented lazy loading, code splitting, and service workers. Redesigned UI with mobile-first approach using Tailwind CSS.',
    results: [
      { metric: 'Load Speed Improvement', value: '15%' },
      { metric: 'Mobile Satisfaction', value: '+45%' },
      { metric: 'Daily Users', value: '2.5M+' },
      { metric: 'Page Performance Score', value: '95+' }
    ],
    techStack: ['React.js', 'Redux', 'React Hooks', 'Axios', 'Tailwind CSS', 'Service Workers'],
    keyAchievements: [
      'Reduced initial load time from 4.2s to 3.5s using code splitting and lazy loading',
      'Improved mobile user satisfaction scores by 45%',
      'Increased Lighthouse performance score from 75 to 95+',
      'Handled 2.5M+ daily active users with 99.9% uptime',
      'Implemented seamless bill payment and fund transfer features'
    ],
    relatedProjects: ['banking-api-integration', 'power-bi-analytics'],
    liveUrl: 'https://www.maybank2u.com.my/'
  },
  {
    slug: 'banking-api-integration',
    title: 'Banking API Integration Platform',
    subtitle: 'Seamless Insurance-Banking Partnership',
    description: 'RESTful API development for insurance product integration, enabling seamless renewals and purchases through banking partners.',
    image: 'https://static.kuhandranchatbot.info/image/Project3.png',
    client: 'Multiple Banking Partners',
    duration: '6 months',
    role: 'Backend Architect & API Developer',
    challenge: 'Insurance products needed to be integrated into banking platforms with different technical requirements. Required a scalable, secure, and flexible API gateway to support multiple banking partners.',
    solution: 'Designed and implemented a microservices-based API layer using Spring Boot. Created standardized REST endpoints for policy renewals, new purchases, claims submission, and customer service integrations. Implemented OAuth 2.0 for security and rate limiting for stability.',
    results: [
      { metric: 'API Latency', value: '<200ms' },
      { metric: 'Integration Partners', value: '5+' },
      { metric: 'API Uptime', value: '99.95%' },
      { metric: 'Daily Transactions', value: '100k+' }
    ],
    techStack: ['Spring Boot', 'Java', 'RESTful APIs', 'Microservices', 'PostgreSQL', 'Docker', 'Kubernetes'],
    keyAchievements: [
      'Designed microservices architecture supporting 5+ banking partners',
      'Achieved sub-200ms API response times with optimized database queries',
      'Implemented comprehensive API documentation with OpenAPI/Swagger',
      'Processed 100k+ transactions daily with 99.95% uptime',
      'Secured APIs with OAuth 2.0 and rate limiting',
      'Enabled partners to integrate insurance products in 48 hours'
    ],
    relatedProjects: ['fwd-insurance-react-native', 'maybank-digital-banking']
  },
  {
    slug: 'power-bi-analytics',
    title: 'Power BI Analytics Dashboard',
    subtitle: 'Data-Driven Business Intelligence',
    description: 'Comprehensive data visualization solution providing actionable business insights and real-time analytics for decision-making.',
    image: 'https://static.kuhandranchatbot.info/image/Project4.png',
    client: 'Enterprise Client',
    duration: '4 months',
    role: 'Data Analytics & BI Developer',
    challenge: 'Stakeholders struggled to extract actionable insights from disparate data sources across multiple systems. Reports were static, delayed, and difficult to customize.',
    solution: 'Created a comprehensive Power BI dashboard ecosystem connecting SQL databases, Excel data, and APIs. Implemented dynamic DAX measures for real-time KPI tracking. Designed interactive visualizations for different user roles with row-level security.',
    results: [
      { metric: 'Report Generation Time', value: '-80%' },
      { metric: 'Data Freshness', value: 'Real-time' },
      { metric: 'Decision Cycle', value: '-50%' },
      { metric: 'User Adoption', value: '95%' }
    ],
    techStack: ['Power BI', 'DAX', 'SQL', 'Data Visualization', 'Excel', 'M Language'],
    keyAchievements: [
      'Reduced report generation time from hours to minutes',
      'Implemented real-time data refresh every 15 minutes',
      'Created 12+ interactive dashboards for different departments',
      'Achieved 95% user adoption through intuitive design',
      'Enabled 50% faster business decision-making',
      'Implemented row-level security for sensitive data'
    ],
    relatedProjects: ['maybank-digital-banking', 'banking-api-integration']
  }
];

export const getCaseStudyBySlug = (slug: string): CaseStudy | undefined => {
  return caseStudies.find(study => study.slug === slug);
};

export const getRelatedCaseStudies = (slug: string, limit: number = 3): CaseStudy[] => {
  const currentStudy = getCaseStudyBySlug(slug);
  if (!currentStudy) return [];
  
  return caseStudies
    .filter(study => 
      study.slug !== slug && 
      currentStudy.relatedProjects.includes(study.slug)
    )
    .slice(0, limit);
};
