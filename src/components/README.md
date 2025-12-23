# src/components/ - Component System

Reusable React components organized by layer and function.

## 📁 Structure

```
components/
├── README.md                 # This file
├── AnalyticsWrapper.tsx      # Analytics tracking wrapper
├── elements/                 # Atomic/primitive components
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── ProjectCard.tsx
│   ├── SectionHeader.tsx
│   ├── SkillBar.tsx
│   ├── StatCard.tsx
│   ├── TechTag.tsx
│   └── TimelineItem.tsx
├── layout/                   # Layout structure components
│   ├── Footer.tsx
│   └── Navbar.tsx
└── sections/                 # Feature/page sections
    ├── About.tsx
    ├── Achievements.tsx
    ├── Chatbot.tsx
    ├── chatbotHelpers.ts
    ├── ChatbotState.ts
    ├── ChatProcess.tsx
    ├── Contact.tsx
    ├── Education.tsx
    ├── EmailCaptcha.tsx
    ├── Experience.tsx
    ├── Hero.tsx
    ├── OtpEntry.tsx
    ├── Projects.tsx
    └── Skills.tsx
```

## 🏗️ Component Layers

### Atomic Components (`elements/`)
Smallest, reusable building blocks. No business logic, purely presentational.

**Pattern:**
- **Props:** appearance, positioning, behavior
- **State:** none (usually)
- **Styling:** Tailwind CSS
- **Usage:** Building blocks for larger components

**Examples:**
```typescript
// Badge.tsx - Styled label
<Badge variant="blue">Next.js</Badge>

// Button.tsx - Clickable action
<Button onClick={handleClick}>Click Me</Button>

// Card.tsx - Container with styling
<Card>Content</Card>

// SkillBar.tsx - Progress bar
<SkillBar skill="JavaScript" proficiency={85} />
```

### Layout Components (`layout/`)
Page structure and navigation. Persistent across pages.

**Files:**
- **Navbar.tsx** - Navigation bar with menu, theme toggle, mobile responsive
- **Footer.tsx** - Footer with links, copyright, social media

**Features:**
- Mobile responsive (hamburger menu for Navbar)
- Dark/light theme support
- Sticky positioning
- Social links integration

### Section Components (`sections/`)
Full feature modules representing main page sections. Contain business logic and manage data.

**Major Sections:**
1. **Hero.tsx** - Welcome section with profile
2. **About.tsx** - Bio and introduction
3. **Skills.tsx** - Tech stack display
4. **Experience.tsx** - Work history timeline
5. **Education.tsx** - Academic background
6. **Projects.tsx** - Portfolio projects showcase
7. **Achievements.tsx** - Awards and certifications
8. **Contact.tsx** - Contact form section
9. **Chatbot.tsx** - AI chatbot interface

**Supporting Files:**
- **chatbotHelpers.ts** - Utilities for chatbot message processing
- **ChatbotState.ts** - State management for chatbot
- **ChatProcess.tsx** - Chatbot message processing logic
- **EmailCaptcha.tsx** - Email verification with CAPTCHA
- **OtpEntry.tsx** - OTP input component

## 📦 Component Details

### Atomic Components

#### Badge.tsx
Semantic label component.

**Props:**
- `children: ReactNode` - Label text
- `variant?: string` - Style variant (blue, green, etc.)
- `className?: string` - Additional styling

**Usage:**
```typescript
<Badge variant="blue">React</Badge>
<Badge variant="green">Next.js</Badge>
```

#### Button.tsx
Standard interactive button.

**Props:**
- `onClick?: () => void` - Click handler
- `children: ReactNode` - Button text
- `variant?: 'primary' | 'secondary'` - Style variant
- `disabled?: boolean` - Disabled state
- `className?: string` - Additional styling

**Usage:**
```typescript
<Button onClick={handleSubmit}>Submit</Button>
<Button variant="secondary" disabled>Disabled</Button>
```

#### Card.tsx
Container with styled border and shadow.

**Props:**
- `children: ReactNode` - Card content
- `className?: string` - Additional styling

**Usage:**
```typescript
<Card>
  <h3>Title</h3>
  <p>Content</p>
</Card>
```

#### ProjectCard.tsx
Specialized card for displaying project showcase.

**Props:**
- `title: string` - Project name
- `description: string` - Project overview
- `image: string` - Project image
- `technologies: string[]` - Tech stack
- `links: { github?: string, demo?: string }` - Project links

**Usage:**
```typescript
<ProjectCard
  title="Portfolio Site"
  description="Personal portfolio website"
  image="/project.png"
  technologies={['Next.js', 'React', 'TypeScript']}
  links={{ github: 'https://github.com/...', demo: 'https://...' }}
/>
```

#### SectionHeader.tsx
Section title with optional description.

**Props:**
- `title: string` - Section title
- `description?: string` - Optional subtitle
- `className?: string` - Additional styling

**Usage:**
```typescript
<SectionHeader
  title="Skills"
  description="Technologies and tools I use"
/>
```

#### SkillBar.tsx
Progress bar for skill proficiency levels.

**Props:**
- `skill: string` - Skill name
- `proficiency: number` - 0-100 percentage
- `className?: string` - Additional styling

**Usage:**
```typescript
<SkillBar skill="JavaScript" proficiency={90} />
```

#### StatCard.tsx
Card displaying a statistic or metric.

**Props:**
- `label: string` - Stat name
- `value: string | number` - Stat value
- `icon?: ReactNode` - Optional icon
- `className?: string` - Additional styling

**Usage:**
```typescript
<StatCard label="Projects Completed" value={25} />
```

#### TechTag.tsx
Small badge for technology labels.

**Props:**
- `children: string` - Technology name
- `className?: string` - Additional styling

**Usage:**
```typescript
<TechTag>React</TechTag>
<TechTag>TypeScript</TechTag>
```

#### TimelineItem.tsx
Single item in a timeline (experience/education).

**Props:**
- `date: string` - Date range (e.g., "2020 - 2022")
- `title: string` - Item title
- `description: string` - Item description
- `details?: string[]` - Array of detail points
- `className?: string` - Additional styling

**Usage:**
```typescript
<TimelineItem
  date="2020 - 2024"
  title="Bachelor of Science in Computer Science"
  description="University Name"
  details={['GPA: 3.8', 'Dean\'s List']}
/>
```

### Layout Components

#### Navbar.tsx
Application navigation bar.

**Features:**
- Logo/site name
- Navigation menu (Home, About, Skills, etc.)
- Theme toggle (dark/light)
- Mobile responsive with hamburger menu
- Smooth scroll to sections
- Active section highlighting

**Props:**
- None (uses page context)

**Key Functions:**
- `handleNavClick(sectionId)` - Smooth scroll to section
- `toggleTheme()` - Switch dark/light mode

#### Footer.tsx
Application footer.

**Features:**
- Copyright year
- Navigation links
- Social media links (GitHub, LinkedIn, Twitter, etc.)
- Contact information

**Props:**
- None (uses data from lib/data)

### Section Components

#### Hero.tsx
Welcome section with profile image and introduction.

**Features:**
- Large profile image
- Welcome message
- Call-to-action buttons (View Projects, Contact)
- Background animation
- Responsive layout

#### About.tsx
Personal bio and introduction section.

**Features:**
- About text content
- Key highlights
- Skills preview
- Link to full skills section

#### Skills.tsx
Technical skills and proficiencies.

**Features:**
- Skill categories (Frontend, Backend, Tools, etc.)
- Skill bars with proficiency levels
- Tech tags cloud
- Interactive hover effects

#### Experience.tsx
Work experience timeline.

**Features:**
- Timeline layout
- Job title, company, date
- Job description
- Key achievements
- Technologies used

#### Education.tsx
Academic background section.

**Features:**
- Education timeline
- Degree, school, graduation date
- GPA and honors (if applicable)
- Relevant coursework or highlights

#### Projects.tsx
Portfolio projects showcase.

**Features:**
- Project cards with images
- Project descriptions
- Technology stacks
- Demo and GitHub links
- Filtering by category (optional)

#### Achievements.tsx
Awards, certifications, and recognition.

**Features:**
- Achievement cards
- Certificate images
- Issuance date
- Issuing organization

#### Contact.tsx
Contact form section.

**Features:**
- Email input
- Name input
- Message textarea
- Submit button
- Email verification with CAPTCHA
- OTP validation for email confirmation

**Child Components:**
- `EmailCaptcha.tsx` - CAPTCHA verification
- `OtpEntry.tsx` - OTP input dialog

#### Chatbot.tsx
AI chatbot interface.

**Features:**
- Message list with history
- Input field for user messages
- Auto-scroll to latest message
- Loading indicators
- Error handling
- Chat persistence (localStorage)

**Child Components:**
- `ChatProcess.tsx` - Message processing logic
- Related utils: `chatbotHelpers.ts`, `ChatbotState.ts`

### AnalyticsWrapper.tsx
Higher-order component for tracking page views and user interactions.

**Features:**
- Google Analytics integration
- Event tracking
- Page view logging

**Usage:**
```typescript
<AnalyticsWrapper>
  <YourComponent />
</AnalyticsWrapper>
```

## 🎨 Styling Approach

### Tailwind CSS
All components use Tailwind CSS utility classes:
```typescript
<div className="flex items-center justify-center p-4 rounded-lg shadow-md">
  {/* Content */}
</div>
```

### CSS Variables
For theming, use CSS variables defined in `app/critical.css`:
```typescript
<div className="bg-primary text-secondary">
  {/* Theme-aware styling */}
</div>
```

### Custom CSS
Minimal custom CSS in component files - prefer Tailwind composition.

## 📋 Component Naming Conventions

- **PascalCase** for component files: `Button.tsx`, `ProjectCard.tsx`
- **camelCase** for helper files: `chatbotHelpers.ts`
- **descriptive names** reflecting component purpose

## 🔄 Data Flow

### Props Drilling
- Pass data down through component hierarchy
- Use React Context for deeply nested components (e.g., chatbot state)

### State Management
- Local state (useState) for UI state
- Custom hooks for reusable logic
- Context API for global chatbot state

### External Data
- Fetch from `lib/data/` files (static data)
- API calls in section components with error handling

## 📚 Best Practices

### Reusability
- Keep components small and focused
- Accept props for customization
- Avoid hard-coded values

### Performance
- Memoize expensive computations
- Lazy load heavy components
- Use React.memo for expensive renders

### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance

### Testing
- Test atomic components independently
- Test sections with mock data
- Use snapshot tests for visual regression

## 🚀 Adding New Components

### Atomic Component
```typescript
// components/elements/NewComponent.tsx
import React from 'react'

interface NewComponentProps {
  // Define props
}

export function NewComponent({ ...props }: NewComponentProps) {
  return (
    <div className="...">
      {/* Component JSX */}
    </div>
  )
}
```

### Section Component
```typescript
// components/sections/NewSection.tsx
import { SectionHeader } from '../elements/SectionHeader'

export function NewSection() {
  return (
    <section id="new-section" className="py-12">
      <SectionHeader title="New Section" />
      {/* Section content */}
    </section>
  )
}
```

### Update Layout
Add new section import to `app/page.tsx`:
```typescript
import { NewSection } from '@/components/sections/NewSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <NewSection />
      {/* Other sections */}
      <Footer />
    </>
  )
}
```

## 🔗 Related Documentation

- [Parent: README.md](../../README.md) - Project overview
- [App Layer: app/README.md](../app/README.md) - Page structure
- [Data Layer: lib/README.md](../lib/README.md) - Data sources
- [Styling: Tailwind CSS](https://tailwindcss.com/docs)
