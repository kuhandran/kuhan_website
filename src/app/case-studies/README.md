# Case Studies Section

## Purpose
This directory contains the case studies feature of the portfolio - showcasing detailed project work, results, and technical achievements.

## Directory Structure

```
case-studies/
├── page.tsx              # List view - displays all case studies
├── [slug]/               # Dynamic detail pages
│   ├── page.tsx          # Detail page - renders individual case study
│   ├── CaseStudyDetailPage.tsx  # Client component for detail UI
│   └── README.md         # Documentation for [slug] structure
└── README.md             # This file
```

## Two Different page.tsx Files - What's the Difference?

This might look confusing, but it's a standard Next.js pattern for routing.

### `case-studies/page.tsx` (List Page)
- **URL**: `/case-studies`
- **Purpose**: Display a grid/list of all available case studies
- **Data**: Loads all case studies summary
- **User Interaction**: Click on a case study to view details

### `case-studies/[slug]/page.tsx` (Detail Page)
- **URL**: `/case-studies/fwd-insurance-react-native` (dynamic)
- **Purpose**: Display full details of a single case study
- **Data**: Loads complete case study data including challenge, solution, results, images
- **User Interaction**: View carousel, scroll sections, switch languages

## Next.js File-Based Routing Explanation

In Next.js, files named `page.tsx` automatically become route handlers based on their location:

```
src/app/
├── case-studies/
│   └── page.tsx         → Route: /case-studies
│
└── case-studies/[slug]/
    └── page.tsx         → Route: /case-studies/:slug (dynamic)
```

The `[slug]` syntax creates a dynamic route parameter that can be any value. This is how `/case-studies/fwd-insurance-react-native` works - the `fwd-insurance-react-native` part is the `slug` parameter.

## Why This Structure?

| Aspect | Benefit |
|--------|---------|
| **Separate Routes** | Each page has its own URL and purpose |
| **Data Separation** | List shows summaries, detail shows full content |
| **Performance** | Each page loads only what it needs |
| **Organization** | Logical folder structure mirrors URL structure |
| **Next.js Standard** | This is the recommended pattern in Next.js documentation |

## Adding a New Case Study

1. Go to `@/lib/data/caseStudies.ts`
2. Add new case study object with all required fields
3. Use URL-friendly slug: `your-project-name`
4. Automatically accessible at `/case-studies/your-project-name`

Example:
```typescript
{
  slug: "my-awesome-project",
  title: "My Awesome Project",
  // ... other fields
}
```

Then visit: `http://localhost:3000/case-studies/my-awesome-project`

## Related Files

- `@/lib/data/caseStudies.ts` - Case study data and types
- `@/lib/config/dataConfig.ts` - Environment configuration
- `@/hooks/useCaseStudiesTranslation.ts` - Multi-language support

## Key Features

- ✅ Multi-language support (EN, ES, FR, DE)
- ✅ Image carousel with thumbnails
- ✅ Smooth scroll to sections
- ✅ Related case studies recommendations
- ✅ Responsive mobile design
- ✅ Environment-aware data loading (local dev, CDN production)
