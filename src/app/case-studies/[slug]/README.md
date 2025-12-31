# Case Study Detail Page - [slug]

## Purpose
This directory handles the dynamic case study detail page for individual projects. When a user navigates to `/case-studies/fwd-insurance-react-native`, this route renders the full case study with all content, images, and related projects.

## Directory Structure

```
[slug]/
├── page.tsx                    # Next.js server component - handles routing & data loading
├── CaseStudyDetailPage.tsx     # Client component - renders the case study UI
└── README.md                   # This file
```

## File Responsibilities

### `page.tsx` (Server Component)
- **Role**: Data fetching and server-side logic
- **Responsibilities**:
  - Receives dynamic `[slug]` parameter from URL
  - Loads case study data from `@/lib/data/caseStudies`
  - Loads related case studies
  - Handles 404 errors if slug not found
  - Passes pre-loaded data to client component via props
- **Key Pattern**: Server → Client data flow for optimal performance

### `CaseStudyDetailPage.tsx` (Client Component)
- **Role**: Interactive UI rendering and user interactions
- **Responsibilities**:
  - Receives pre-loaded data as props (no data loading)
  - Renders case study header, challenge, solution, results
  - Manages image carousel state and navigation
  - Handles smooth scroll to sections
  - Integrates with translation system for multi-language support
  - Displays related case studies as links
- **No Async Operations**: All data already provided by server component

## Data Flow

```
URL: /case-studies/[slug]
          ↓
    page.tsx (Server)
          ↓
  getCaseStudyBySlug() → CaseStudy data
  getRelatedCaseStudies() → Related projects
          ↓
  CaseStudyDetailPage (Client)
          ↓
    User interactions (image nav, smooth scroll, language switch)
```

## Key Features

- **Multi-language Support**: Translations via `useCaseStudiesTranslation` hook
- **Image Carousel**: Main image + thumbnails with navigation
- **Quick Navigation**: Links to jump to sections (Challenge, Results, Achievements, Tech Stack)
- **Related Projects**: Grid of 2-3 related case studies
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Environment-Aware Data URLs

Translation files are loaded from:
- **Development/Localhost**: `/data/caseStudiesTranslations.json`
- **Production**: `https://static.kuhandranchatbot.info/data/caseStudiesTranslations.json`

This is configured in `@/lib/config/dataConfig.ts`

## Adding a New Case Study

1. Add case study data to `@/lib/data/caseStudies.ts`
2. Include all required fields: title, description, client, duration, role, challenge, solution, results, techStack, keyAchievements, media.screenshots
3. Use a URL-friendly slug (e.g., `fwd-insurance-react-native`)
4. Route automatically becomes `/case-studies/your-slug`

## Related Files

- `@/lib/data/caseStudies.ts` - Data source and types
- `@/lib/config/dataConfig.ts` - Environment configuration
- `@/hooks/useCaseStudiesTranslation.ts` - Translation management
- `@/app/case-studies/page.tsx` - Case studies list page

## Comparison: List vs Detail Pages

| Aspect | `/case-studies` (page.tsx) | `/case-studies/[slug]` (page.tsx) |
|--------|---------------------------|-----------------------------------|
| **Purpose** | Display list of all case studies | Display single case study detail |
| **Data** | All case studies metadata | Full case study data |
| **Interactivity** | Links to individual studies | Image carousel, smooth scroll |
| **Route Type** | Static | Dynamic with `[slug]` parameter |
| **Server vs Client** | Likely static | Server loads data, client renders |
