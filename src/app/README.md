# src/app/ - Application Layer

App Router configuration, layout, and page structure for Next.js 16.

## 📁 Structure

```
app/
├── layout.tsx          # Root layout wrapper
├── page.tsx            # Home page (main entry)
├── globals.css         # Global utility styles
├── critical.css        # Critical CSS for above-fold
├── animations.css      # Deferred animation styles
└── api/
    └── contact/        # Contact form API
        └── route.ts    # POST endpoint
```

## 🔧 Files

### `layout.tsx`
Root layout component wrapping entire application.

**Features:**
- Meta tags (title, description, OG, Twitter)
- Google Analytics integration
- DNS prefetch & preconnect for APIs
- Critical image preload
- Suspense boundaries for sections
- Mobile viewport configuration

**Key Props:**
- Children components (pages)

### `page.tsx`
Home page - main entry point for application.

**Structure:**
```typescript
export default function Home() {
  return (
    <>
      <Navbar />
      <PageRenderer config={...} />
      <Footer />
      <ChatbotButton />
    </>
  )
}
```

**Content Flow:**
1. Navbar (always visible)
2. Hero section (no preload delay)
3. About section (lazy-loaded)
4. Skills, Projects, Experience, etc. (lazy-loaded on scroll)
5. Contact form
6. Chatbot floating button

### `critical.css`
Critical CSS for above-fold content.

**Includes:**
- CSS variables (colors, fonts)
- Theme configuration (@theme)
- HTML/body base styles
- Selection & focus styles
- Motion preferences (prefers-reduced-motion)

**Performance Note:** Loaded immediately (inline in HTML head)

### `globals.css`
Global utility styles and imports.

**Includes:**
- Tailwind CSS base import
- Global animations import
- Utility classes
- Typography defaults

**Performance Note:** Can be deferred if not critical

### `animations.css`
Keyframe animations and animation utilities.

**Animations:**
- fade-in / fade-out
- slide-up / slide-down
- pulse animations
- bounce animations
- scale transitions

**Performance Note:** Deferred loading via Intersection Observer

### `api/contact/route.ts`
Contact form API endpoint.

**Endpoint:** `POST /api/contact`

**Request Body:**
```typescript
{
  name: string,
  email: string,
  message: string,
  phoneNumber?: string
}
```

**Response:**
```typescript
{
  success: boolean,
  message: string
}
```

## 🚀 Development

### Add New Route
```typescript
// app/new-route/page.tsx
export default function NewPage() {
  return <div>New Page</div>
}
```

### Add New API Endpoint
```typescript
// app/api/new-endpoint/route.ts
export async function POST(req: Request) {
  const data = await req.json()
  // Process and respond
  return Response.json({ success: true })
}
```

### Update Meta Tags
Edit `layout.tsx` metadata:
```typescript
const metadata: Metadata = {
  title: 'New Title',
  description: 'New description',
  // Add OG, Twitter, etc.
}
```

## 🎯 Performance Optimization

### Critical Path
1. Parse HTML
2. Load critical.css (inline)
3. Load layout.tsx
4. Render Hero + About
5. Load other sections on demand

### CSS Loading
- **critical.css**: Inline (0ms blocking)
- **globals.css**: Preload, non-critical
- **animations.css**: Lazy-loaded via Intersection Observer

### Image Loading
- Profile image: `fetchPriority="high"` in layout
- Section images: `loading="lazy"`
- Picture tags with WebP + PNG fallback

## 🔍 SEO

### Meta Configuration
- Canonical URL
- Open Graph tags
- Twitter Card tags
- Schema markup ready
- Mobile viewport

### Robots & Crawling
- Robots.txt configured
- Sitemap.xml available
- hreflang tags for multilingual support

## 🛠️ Configuration

### Environment Variables
None required for app layer (check .env.local)

### TypeScript
All files use strict TypeScript mode

### Styling Approach
- Tailwind CSS for components
- CSS variables for theming
- Minimal custom CSS

## 📚 Related Documentation

- [Parent: README.md](../../README.md) - Project overview
- [Components: components/README.md](../components/README.md) - Component system
- [API: components/api/README.md](../components/api/README.md) - API endpoints
