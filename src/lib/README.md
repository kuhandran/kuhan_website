# src/lib/ - Utilities and Data Layer

Shared utilities, configuration, and data sources.

## 📁 Structure

```
lib/
├── README.md (this file)
├── data/
│   ├── achievements.ts      # Awards and certifications
│   ├── education.ts         # Academic background
│   ├── experience.ts        # Work history
│   ├── projects.ts          # Portfolio projects
│   └── skills.ts            # Technical skills
└── email/
    └── templates.ts         # Email templates
```

## 🎯 Overview

The `lib` directory contains:
- **Data sources** - Static content used throughout the application
- **Email utilities** - Templates for transactional emails
- **Shared helpers** - Common utilities used by multiple components
- **Configuration** - App-wide settings and constants

## 📦 Data Layer (`lib/data/`)

All data used by section components is centralized here. This makes it easy to update content without touching components.

### achievements.ts
Awards, certifications, and professional recognition.

**Data Structure:**
```typescript
interface Achievement {
  id: string
  title: string
  issuer: string
  category: 'certification' | 'award' | 'publication' | 'recognition'
  date: string
  expiryDate?: string
  image?: string
  description?: string
  link?: string
  verified?: boolean
}

export const achievements: Achievement[] = [
  {
    id: 'aws-certified',
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    category: 'certification',
    date: '2023-05',
    expiryDate: '2025-05',
    link: 'https://aws.amazon.com/...',
    verified: true
  },
  // ... more achievements
]
```

**Usage:**
```typescript
import { achievements } from '@/lib/data/achievements'

// In Achievements.tsx
const displayAchievements = achievements.filter(a => !a.expiryDate || new Date(a.expiryDate) > new Date())
```

### education.ts
Academic background and educational timeline.

**Data Structure:**
```typescript
interface Education {
  id: string
  degree: string
  field: string
  institution: string
  startDate: string
  endDate: string
  gpa?: number
  honors?: string[]
  highlights?: string[]
  courses?: string[]
}

export const education: Education[] = [
  {
    id: 'bs-cs',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    institution: 'State University',
    startDate: '2020-09',
    endDate: '2024-05',
    gpa: 3.8,
    honors: ['Dean\'s List', 'President\'s Scholarship'],
    highlights: [
      'Graduated with Honors',
      'President of Computer Science Club'
    ],
    courses: [
      'Data Structures',
      'Algorithms',
      'Web Development',
      'Machine Learning'
    ]
  },
  // ... more education
]
```

**Usage:**
```typescript
import { education } from '@/lib/data/education'

// In Education.tsx
const sortedEducation = education.sort((a, b) => 
  new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
)
```

### experience.ts
Professional work history and career timeline.

**Data Structure:**
```typescript
interface Experience {
  id: string
  jobTitle: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  current?: boolean
  description: string
  achievements: string[]
  technologies: string[]
  type?: 'full-time' | 'part-time' | 'contract' | 'freelance'
}

export const experience: Experience[] = [
  {
    id: 'senior-dev',
    jobTitle: 'Senior Software Engineer',
    company: 'Tech Company Inc.',
    location: 'San Francisco, CA',
    startDate: '2023-01',
    current: true,
    description: 'Led frontend development team in building scalable web applications',
    achievements: [
      'Improved application performance by 40%',
      'Mentored 3 junior developers',
      'Architected new component library reducing code duplication by 30%'
    ],
    technologies: ['React', 'TypeScript', 'Next.js', 'PostgreSQL'],
    type: 'full-time'
  },
  // ... more experience
]
```

**Usage:**
```typescript
import { experience } from '@/lib/data/experience'

// In Experience.tsx
const sortedExperience = experience.sort((a, b) => 
  new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
)

// Get current position
const currentJob = experience.find(e => e.current)
```

### projects.ts
Portfolio projects and case studies.

**Data Structure:**
```typescript
interface Project {
  id: string
  title: string
  description: string
  shortDescription?: string
  image: string
  images?: string[]
  technologies: string[]
  categories: string[]
  featured: boolean
  status: 'completed' | 'in-progress' | 'planned'
  startDate: string
  endDate?: string
  links: {
    github?: string
    live?: string
    demo?: string
    article?: string
  }
  metrics?: {
    label: string
    value: string | number
  }[]
  team?: string[]
}

export const projects: Project[] = [
  {
    id: 'portfolio-site',
    title: 'Personal Portfolio Website',
    shortDescription: 'Full-stack portfolio built with Next.js',
    description: 'A comprehensive personal portfolio website showcasing projects, skills, and experience. Features include dark mode, responsive design, contact form with email verification, and an AI chatbot.',
    image: '/images/portfolio.png',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    categories: ['Full Stack', 'Frontend', 'Portfolio'],
    featured: true,
    status: 'completed',
    startDate: '2024-01',
    endDate: '2024-03',
    links: {
      github: 'https://github.com/...',
      live: 'https://example.com',
      demo: 'https://example.com'
    },
    metrics: [
      { label: 'Lighthouse Score', value: '98' },
      { label: 'Performance', value: '99%' },
      { label: 'Users', value: '500+' }
    ]
  },
  // ... more projects
]
```

**Usage:**
```typescript
import { projects } from '@/lib/data/projects'

// In Projects.tsx
const featuredProjects = projects.filter(p => p.featured)
const completedProjects = projects.filter(p => p.status === 'completed')

// Get projects by technology
const reactProjects = projects.filter(p => 
  p.technologies.includes('React')
)
```

### skills.ts
Technical skills and proficiency levels.

**Data Structure:**
```typescript
interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'tools' | 'design' | 'other'
  proficiency: number // 0-100
  yearsExperience?: number
  endorsements?: number
  keywords?: string[]
}

export const skills: Skill[] = [
  // Frontend
  {
    id: 'react',
    name: 'React',
    category: 'frontend',
    proficiency: 95,
    yearsExperience: 5,
    keywords: ['Hooks', 'Context API', 'Performance Optimization']
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'frontend',
    proficiency: 90,
    yearsExperience: 4,
    keywords: ['Type Safety', 'Interfaces', 'Generics']
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'frontend',
    proficiency: 85,
    yearsExperience: 3,
    keywords: ['Server Components', 'API Routes', 'Static Generation']
  },
  // Backend
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'backend',
    proficiency: 85,
    yearsExperience: 4
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'backend',
    proficiency: 80,
    yearsExperience: 3
  },
  // Tools
  {
    id: 'git',
    name: 'Git',
    category: 'tools',
    proficiency: 95,
    yearsExperience: 6
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'tools',
    proficiency: 80,
    yearsExperience: 2
  },
  // ... more skills
]
```

**Usage:**
```typescript
import { skills } from '@/lib/data/skills'

// In Skills.tsx
const frontendSkills = skills.filter(s => s.category === 'frontend')
const backendSkills = skills.filter(s => s.category === 'backend')
const toolSkills = skills.filter(s => s.category === 'tools')

// Sort by proficiency
const topSkills = skills.sort((a, b) => b.proficiency - a.proficiency).slice(0, 5)
```

## 📧 Email Layer (`lib/email/`)

### templates.ts
Email templates for transactional emails.

**Features:**
- Contact form confirmation email
- OTP email template
- Welcome email
- Newsletter template
- HTML and text versions

**Data Structure:**
```typescript
interface EmailTemplate {
  name: string
  subject: string
  html: string
  text: string
}

export const emailTemplates = {
  // Contact form confirmation
  contactConfirmation: {
    name: 'contactConfirmation',
    subject: 'We received your message',
    html: '<html>...</html>',
    text: 'Text version...'
  },
  
  // OTP email
  otpEmail: {
    name: 'otpEmail',
    subject: 'Your verification code',
    html: '<html>...</html>',
    text: 'Text version...'
  },
  
  // Welcome email
  welcome: {
    name: 'welcome',
    subject: 'Welcome!',
    html: '<html>...</html>',
    text: 'Text version...'
  }
}

// Helper function to render templates with variables
export function renderTemplate(
  templateName: string,
  variables: Record<string, string>
): { subject: string; html: string; text: string }
```

**Usage:**
```typescript
import { emailTemplates, renderTemplate } from '@/lib/email/templates'

// In Contact form API endpoint
const template = renderTemplate('contactConfirmation', {
  name: 'John Doe',
  email: 'john@example.com'
})

// Send email with template
await sendEmail({
  to: 'john@example.com',
  subject: template.subject,
  html: template.html,
  text: template.text
})
```

## 🛠️ Utility Functions

### Data Helpers

```typescript
// In lib/data/ or separate lib/utils/

// Format date
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Calculate years of experience
export function getYearsExperience(startDate: string, endDate?: string): number {
  const end = endDate ? new Date(endDate) : new Date()
  const start = new Date(startDate)
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365))
}

// Sort by date
export function sortByDate<T extends { date: string }>(
  items: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.date).getTime()
    const bTime = new Date(b.date).getTime()
    return order === 'desc' ? bTime - aTime : aTime - bTime
  })
}
```

## 📊 Data Update Workflow

### Adding New Achievement
```typescript
// lib/data/achievements.ts
export const achievements: Achievement[] = [
  // Existing achievements...
  {
    id: 'new-achievement',
    title: 'New Achievement Title',
    issuer: 'Issuing Organization',
    category: 'certification',
    date: '2024-06',
    link: 'https://...'
  }
]
```

### Adding New Project
```typescript
// lib/data/projects.ts
export const projects: Project[] = [
  // Existing projects...
  {
    id: 'new-project',
    title: 'New Project Title',
    description: 'Project description',
    image: '/images/project.png',
    technologies: ['Tech1', 'Tech2'],
    categories: ['Category'],
    featured: false,
    status: 'completed',
    startDate: '2024-01',
    endDate: '2024-03',
    links: {
      github: 'https://github.com/...',
      live: 'https://...'
    }
  }
]
```

## 🔍 Type Definitions

All data types are defined at the top of each data file for TypeScript support.

Benefits:
- **Type safety** - Catch errors at compile time
- **IntelliSense** - Better IDE autocomplete
- **Documentation** - Self-documenting code
- **Consistency** - Enforced data structure

## 📱 Responsive Data

Data layer is independent of presentation. Same data can be displayed:
- As timeline on desktop
- As cards on tablet
- As list on mobile

## 🔗 Data Usage Pattern

```typescript
// 1. Import data
import { projects } from '@/lib/data/projects'

// 2. Filter/sort as needed
const filteredProjects = projects
  .filter(p => p.featured)
  .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

// 3. Map to components
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {filteredProjects.map(project => (
    <ProjectCard key={project.id} {...project} />
  ))}
</div>
```

## 🎨 Static Site Generation

All data is static, enabling:
- **Fast builds** - No runtime data fetching
- **Optimal SEO** - Content available at build time
- **Performance** - No API latency
- **Reliability** - No external dependencies

## 📚 Related Documentation

- [Parent: README.md](../../README.md) - Project overview
- [Components: components/README.md](../components/README.md) - Using data in components
- [Sections: components/sections/README.md](../components/sections/README.md) - Data integration examples
