# src/components/layout/ - Layout Components

Page structure and persistent navigation components. Used across all pages.

## 📁 Components

| Component | Purpose | Location |
|-----------|---------|----------|
| Navbar.tsx | Navigation header | Top of page (sticky) |
| Footer.tsx | Page footer | Bottom of page |

## 🎯 Overview

Layout components define the overall page structure and navigation. They persist across navigation and are typically rendered in the root layout.

## 📝 Component Details

### Navbar.tsx
Primary navigation component for the application.

**Features:**
- Logo/site branding (clickable, scrolls to top)
- Navigation menu with links to main sections
- Theme toggle (dark/light mode)
- Mobile responsive with hamburger menu
- Smooth scroll to sections
- Active section highlighting
- Search functionality (optional)
- Sticky positioning

**Props:**
None - uses page context and global state

**Behavior:**

```typescript
interface NavLink {
  label: string
  href: string
  section?: string // For smooth scroll
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '#hero', section: 'hero' },
  { label: 'About', href: '#about', section: 'about' },
  { label: 'Skills', href: '#skills', section: 'skills' },
  { label: 'Experience', href: '#experience', section: 'experience' },
  { label: 'Education', href: '#education', section: 'education' },
  { label: 'Projects', href: '#projects', section: 'projects' },
  { label: 'Achievements', href: '#achievements', section: 'achievements' },
  { label: 'Contact', href: '#contact', section: 'contact' }
]
```

**Key Functions:**

```typescript
// Smooth scroll to section
const handleNavClick = (section: string) => {
  const element = document.getElementById(section)
  element?.scrollIntoView({ behavior: 'smooth' })
}

// Toggle theme
const toggleTheme = () => {
  // Switch between dark and light mode
  // Save preference to localStorage
}

// Handle mobile menu
const toggleMobileMenu = () => {
  // Show/hide mobile navigation
}
```

**Styling:**
- Responsive: Full nav on desktop, hamburger on mobile
- Theme-aware colors (dark/light mode)
- Smooth transitions
- Z-index 50 (sticky, but below modals)

**Mobile Responsive:**
- Desktop (lg): Full horizontal menu
- Tablet (md): Compact menu or hamburger
- Mobile (sm): Hamburger menu with dropdown/slide-out

**Example:**
```tsx
// Rendered in app/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
```

### Footer.tsx
Application footer with navigation and contact information.

**Features:**
- Copyright information with dynamic year
- Navigation links (same as navbar)
- Social media links
  - GitHub
  - LinkedIn
  - Twitter/X
  - Email
- Contact information
- Quick links section
- Responsive layout (single column on mobile, multi-column on desktop)

**Props:**
None - uses data from `lib/data/`

**Structure:**

```
┌─────────────────────────────────────┐
│ Quick Links | Social | Contact       │
├─────────────────────────────────────┤
│ © 2024 Your Name. All rights...      │
└─────────────────────────────────────┘
```

**Key Data:**

```typescript
// Social links
const socialLinks = [
  { icon: 'github', url: 'https://github.com/...' },
  { icon: 'linkedin', url: 'https://linkedin.com/in/...' },
  { icon: 'twitter', url: 'https://twitter.com/...' },
  { icon: 'email', url: 'mailto:email@example.com' }
]

// Quick links
const quickLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' }
]

// Contact info
const contactInfo = {
  email: 'email@example.com',
  phone: '+1 (123) 456-7890',
  location: 'City, Country'
}
```

**Styling:**
- Dark background (typically dark-900)
- Light text for contrast
- Social icons hover effects
- Responsive column layout
- Link underlines on hover

**Example:**
```tsx
// Rendered in app/layout.tsx after main content
<Footer />
```

## 🎨 Styling Approach

Both layout components use:
- **Tailwind CSS** for styling
- **CSS Variables** for theme colors
- **Next.js Link** for client-side navigation
- **Mobile-first responsive design**

### Theme Support

```typescript
// Dark mode example
<nav className="bg-slate-900 dark:bg-slate-950 text-white">
  {/* Navigation content */}
</nav>

// Light mode example
<nav className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
  {/* Navigation content */}
</nav>
```

## 🔄 Navigation Flow

### Desktop Flow
```
┌─ Navbar (sticky at top)
│  ├─ Logo (click to home)
│  ├─ Nav Links (Home, About, Skills, etc.)
│  ├─ Theme Toggle
│  └─ Search (optional)
│
├─ Main Content
│  ├─ Hero Section (#hero)
│  ├─ About Section (#about)
│  ├─ Skills Section (#skills)
│  └─ ... (other sections)
│
└─ Footer (sticky at bottom)
   ├─ Quick Links
   ├─ Social Media
   └─ Copyright
```

### Mobile Flow
```
┌─ Navbar (sticky at top)
│  ├─ Logo (click to home)
│  ├─ Hamburger Menu
│  └─ Theme Toggle
│
├─ Mobile Menu (when opened)
│  └─ Nav Links (vertical stack)
│
├─ Main Content (full width)
│
└─ Footer (full width)
   └─ Stacked layout
```

## 🔗 Navigation Integration

### Smooth Scrolling

```typescript
// In Navbar.tsx
const handleNavClick = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// In sections
<section id="about" className="py-12">
  <SectionHeader title="About Me" />
  {/* Section content */}
</section>
```

### Active Section Highlighting

```typescript
// Track scroll position
useEffect(() => {
  const handleScroll = () => {
    const sections = ['hero', 'about', 'skills', 'experience', 'education', 'projects', 'achievements', 'contact']
    const scrollPosition = window.scrollY + 100 // Navbar height

    for (const sectionId of sections) {
      const section = document.getElementById(sectionId)
      if (section) {
        const { offsetTop, offsetHeight } = section
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(sectionId)
          break
        }
      }
    }
  }

  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

// Highlight active link
<a
  href={`#${sectionId}`}
  className={cn(
    'transition-colors',
    activeSection === sectionId ? 'text-blue-500' : 'text-slate-600'
  )}
>
  {label}
</a>
```

## 🌓 Theme Toggle

### Implementation

```typescript
// In Navbar.tsx
const [isDark, setIsDark] = useState(false)

useEffect(() => {
  // Load theme preference from localStorage
  const savedTheme = localStorage.getItem('theme') || 'light'
  setIsDark(savedTheme === 'dark')
  document.documentElement.classList.toggle('dark', savedTheme === 'dark')
}, [])

const toggleTheme = () => {
  const newTheme = isDark ? 'light' : 'dark'
  setIsDark(!isDark)
  localStorage.setItem('theme', newTheme)
  document.documentElement.classList.toggle('dark', newTheme === 'dark')
}
```

### Theme Colors

```css
/* app/critical.css */
:root {
  --primary-color: #3b82f6; /* Blue */
  --secondary-color: #6b7280; /* Gray */
  --accent-color: #8b5cf6; /* Purple */
  --background-light: #ffffff;
  --background-dark: #1f2937;
  --text-light: #111827;
  --text-dark: #f9fafb;
}

.dark {
  --background-light: #1f2937;
  --text-light: #f9fafb;
}
```

## 📱 Responsive Breakpoints

### Tailwind Breakpoints Used

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Small phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktops |
| `xl` | 1280px | Large desktops |
| `2xl` | 1536px | Ultra-wide |

### Layout Adaptations

```typescript
// Navbar adjustments
<div className="hidden md:flex">
  {/* Desktop menu */}
</div>
<div className="md:hidden">
  {/* Mobile hamburger */}
</div>

// Footer adjustments
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Stacked on mobile, 3 columns on desktop */}
</div>
```

## ♿ Accessibility

### Navbar A11y
- Semantic `<nav>` element
- ARIA labels for hamburger menu: `aria-label="Navigation menu"`
- Keyboard navigation (Tab to navigate links)
- Screen reader support for active section
- High contrast for theme toggle

### Footer A11y
- Semantic `<footer>` element
- ARIA labels for social links
- Landmark region for screen readers
- Keyboard accessible links

## 🚀 Performance Optimization

### Code Splitting
- Lazy load mobile menu component
- Load theme toggle on demand

### Image Optimization
- SVG icons for navbar/footer (no image download)
- Optimized social media icons

### CSS
- Critical CSS in `app/critical.css` (navbar/footer base styles)
- Tailwind for component styling (tree-shaken)

## 🔗 Related Documentation

- [Components Overview: components/README.md](../README.md) - Component system
- [Atomic Elements: components/elements/README.md](../elements/README.md) - Small reusable components
- [Sections: components/sections/README.md](../sections/README.md) - Page sections
- [App Layer: src/app/README.md](../../app/README.md) - Page structure
