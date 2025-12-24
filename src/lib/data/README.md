# Data Modules (`src/lib/data`)

This directory contains TypeScript modules that manage application data loading and fallback values.

## Modules

### `index.ts`
**Purpose**: Central export point for all data modules.

**Exports**: Re-exports all data loading functions from individual modules for cleaner imports.

### `contentLabels.ts`
**Purpose**: Loads UI text and labels from the CDN. Provides fallback default labels if loading fails.

**Exports**:
- `getContentLabels()` - Async function to fetch labels from CDN
- Default fallback object with all required labels

**Structure**:
```typescript
{
  navbar: { home, about, skills, experience, projects, achievements, education, contact },
  hero: { greeting, title, subtitle, cta },
  about: { title, description },
  skills: { title, description },
  experience: { title, position, company, duration },
  projects: { title, viewProject, github },
  achievements: { title, awards, certifications },
  education: { title, degree, school },
  contact: { title, form, email, phone },
  chatbot: { toggleChat, placeholder, send }
}
```

### `skills.ts`
**Purpose**: Manages technical skills data with 4 categories.

**Data Structure**:
```typescript
[
  {
    category: string,        // e.g., "Frontend Development"
    skills: string[]         // e.g., ["React", "TypeScript", "Tailwind CSS"]
  }
]
```

**Categories**:
1. Frontend Development - React, TypeScript, Next.js, CSS, Tailwind
2. Backend & APIs - Node.js, Express, Python, databases
3. Data & Analytics - Data analysis, visualization, Power BI
4. Cloud & DevOps - AWS, Docker, CI/CD, cloud deployment

### `projects.ts`
**Purpose**: Portfolio projects showcase data with 6 featured projects.

**Data Structure**:
```typescript
{
  name: string,
  description: string,
  technologies: string[],
  role: string,
  impact: string,
  link?: string,
  github?: string
}
```

### `experience.ts`
**Purpose**: Work experience timeline data with 5 positions.

**Data Structure**:
```typescript
{
  position: string,
  company: string,
  startDate: string,
  endDate: string,
  description: string,
  achievements: string[],
  techStack: string[]
}
```

### `education.ts`
**Purpose**: Education background data with 4 degrees.

**Data Structure**:
```typescript
{
  degree: string,              // e.g., "MBA"
  institution: string,         // e.g., "Cardiff Metropolitan University"
  field: string,              // e.g., "Business Administration"
  graduationYear: number,
  gpa?: string,
  focusAreas?: string[]
}
```

### `achievements.ts`
**Purpose**: Awards and certifications data (3 awards + 3 certifications).

**Data Structure**:
```typescript
{
  type: 'award' | 'certification',
  title: string,
  issuer: string,
  date: string,
  description?: string,
  credentialUrl?: string
}
```

## Data Loading Pattern

Each module follows this pattern:

```typescript
import { getErrorMessageSync } from '@/lib/config/appConfig';

// Default fallback data
const DEFAULT_DATA = [ /* ... */ ];

// Async loader function
export async function get[Data]FromCdn() {
  try {
    // Fetch from CDN
    const response = await fetch(url);
    if (!response.ok) throw new Error('HTTP error');
    return await response.json();
  } catch (error) {
    // Log error and return fallback
    console.warn(getErrorMessageSync('data.loadingError'));
    return DEFAULT_DATA;
  }
}
```

## Sync vs Async Access

- **Async** (`get[Data]FromCdn()`): Fetch fresh data from CDN
- **Sync** (Direct export): Use fallback data immediately (for SSR/hydration)

## Fallback Data

Each module includes complete fallback data that:
- ✅ Matches production data exactly
- ✅ Ensures app works offline
- ✅ Provides immediate content for SSR
- ✅ Falls back when CDN is unavailable

## Adding New Data

1. Create new module following the pattern above
2. Export default fallback data
3. Export async loader function
4. Add error message to `errorMessages.json`
5. Export from `index.ts`

## Environment Variables

Data URLs are stored in `public/config/urlConfig.json` and loaded via `appConfig.ts`. No need to hardcode URLs in data modules.
