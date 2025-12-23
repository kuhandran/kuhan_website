# src/components/elements/ - Atomic Components

Smallest, reusable building blocks of the component system. Presentational components with no business logic.

## 📁 Components

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| Badge.tsx | Semantic label | `variant`, `className` |
| Button.tsx | Interactive button | `onClick`, `variant`, `disabled` |
| Card.tsx | Container with styling | `className` |
| ProjectCard.tsx | Project showcase | `title`, `description`, `technologies` |
| SectionHeader.tsx | Section title | `title`, `description` |
| SkillBar.tsx | Proficiency indicator | `skill`, `proficiency` |
| StatCard.tsx | Metric display | `label`, `value`, `icon` |
| TechTag.tsx | Technology badge | `className` |
| TimelineItem.tsx | Timeline entry | `date`, `title`, `description` |

## 🎯 Philosophy

Each component:
- Has **single responsibility**
- Accepts **props for customization**
- Uses **Tailwind CSS** for styling
- Contains **no state or business logic**
- Is **fully reusable** across the application

## 📝 Component Reference

### Badge.tsx
Semantic label/tag component.

```typescript
interface BadgeProps {
  children: ReactNode
  variant?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
  className?: string
}
```

**Example:**
```tsx
<Badge variant="blue">React</Badge>
<Badge variant="green">Next.js</Badge>
```

### Button.tsx
Standard clickable button with variants.

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  className?: string
}
```

**Example:**
```tsx
<Button onClick={handleClick}>Click Me</Button>
<Button variant="secondary">Secondary Action</Button>
<Button disabled>Disabled</Button>
```

### Card.tsx
Container component with box styling.

```typescript
interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}
```

**Example:**
```tsx
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

<Card hover className="cursor-pointer">
  Interactive card
</Card>
```

### ProjectCard.tsx
Specialized card for project showcase.

```typescript
interface ProjectCardProps {
  title: string
  description: string
  image: string
  technologies: string[]
  links?: {
    github?: string
    demo?: string
    live?: string
  }
  featured?: boolean
  className?: string
}
```

**Example:**
```tsx
<ProjectCard
  title="Portfolio Website"
  description="Personal portfolio built with Next.js and React"
  image="/images/portfolio.png"
  technologies={['Next.js', 'React', 'TypeScript', 'Tailwind CSS']}
  links={{
    github: 'https://github.com/username/portfolio',
    demo: 'https://portfolio.com'
  }}
/>
```

### SectionHeader.tsx
Section title with optional description and decorative elements.

```typescript
interface SectionHeaderProps {
  title: string
  description?: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  className?: string
}
```

**Example:**
```tsx
<SectionHeader
  title="My Skills"
  description="Technologies I work with daily"
  align="center"
/>
```

### SkillBar.tsx
Horizontal bar showing skill proficiency level.

```typescript
interface SkillBarProps {
  skill: string
  proficiency: number // 0-100
  icon?: string | ReactNode
  showPercentage?: boolean
  className?: string
}
```

**Example:**
```tsx
<SkillBar skill="JavaScript" proficiency={95} />
<SkillBar skill="Python" proficiency={80} showPercentage />
```

### StatCard.tsx
Card displaying a single statistic or metric.

```typescript
interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  unit?: string
  trend?: 'up' | 'down'
  className?: string
}
```

**Example:**
```tsx
<StatCard label="Projects Completed" value={25} />
<StatCard label="Years Experience" value={5} unit="+" />
<StatCard label="Happy Clients" value={100} icon={<SmileIcon />} />
```

### TechTag.tsx
Small badge for displaying technology/tool names.

```typescript
interface TechTagProps {
  children: string
  className?: string
  icon?: ReactNode
  variant?: 'default' | 'outline' | 'filled'
}
```

**Example:**
```tsx
<TechTag>React</TechTag>
<TechTag variant="outline">TypeScript</TechTag>
<div className="flex gap-2">
  <TechTag>Next.js</TechTag>
  <TechTag>Node.js</TechTag>
  <TechTag>PostgreSQL</TechTag>
</div>
```

### TimelineItem.tsx
Single entry in a timeline (for experience/education/milestones).

```typescript
interface TimelineItemProps {
  date: string | { start: string; end: string }
  title: string
  subtitle?: string
  description: string
  details?: string[]
  icon?: ReactNode
  position?: 'left' | 'right'
  isLast?: boolean
  className?: string
}
```

**Example:**
```tsx
<TimelineItem
  date="2020 - 2024"
  title="Bachelor of Science in Computer Science"
  subtitle="State University"
  description="Completed comprehensive computer science degree"
  details={['GPA: 3.8', 'Dean\'s List', 'President\'s Scholarship']}
/>

<TimelineItem
  date={{ start: 'Jan 2023', end: 'Present' }}
  title="Senior Software Engineer"
  subtitle="Tech Company Inc."
  description="Leading frontend development team"
/>
```

## 🎨 Styling Pattern

All components use Tailwind CSS. Standard pattern:

```typescript
// components/elements/ComponentName.tsx
export function ComponentName({ className, ...props }: Props) {
  return (
    <div className={cn(
      // Base styles
      'flex items-center justify-center p-4',
      // Hover/interactive states
      'hover:bg-opacity-90 transition-colors',
      // User overrides
      className
    )}>
      {/* Component JSX */}
    </div>
  )
}
```

Use the `cn()` utility (from clsx/classnames) to merge Tailwind classes safely.

## 🔄 Composition Examples

Combine atomic components to build larger structures:

```typescript
// Create a feature card
<Card>
  <SectionHeader title="Feature Title" />
  <div className="space-y-2">
    <TechTag>React</TechTag>
    <TechTag>TypeScript</TechTag>
  </div>
  <Button onClick={handleClick}>Learn More</Button>
</Card>

// Create a stats section
<div className="grid grid-cols-3 gap-4">
  <StatCard label="Projects" value={25} />
  <StatCard label="Years" value={5} />
  <StatCard label="Clients" value={50} />
</div>

// Create a project showcase
<div className="grid grid-cols-2 gap-6">
  <ProjectCard {...project1} />
  <ProjectCard {...project2} />
  <ProjectCard {...project3} />
  <ProjectCard {...project4} />
</div>
```

## 🚀 Usage Tips

### Props Passing
```typescript
// Good: Props drilling
<Button onClick={handleClick} className="mt-4">
  Click Me
</Button>

// Also good: Spread props
const buttonProps = { onClick: handleClick, className: 'mt-4' }
<Button {...buttonProps}>Click Me</Button>
```

### Conditional Styling
```typescript
<Card className={selected ? 'ring-2 ring-blue-500' : ''}>
  Content
</Card>

// Better with helper
<Card className={cn(
  selected && 'ring-2 ring-blue-500'
)}>
  Content
</Card>
```

### Responsive Design
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <ProjectCard {...project1} />
  <ProjectCard {...project2} />
  <ProjectCard {...project3} />
</div>
```

## 📦 Exporting Components

Create an `index.ts` for easy imports:

```typescript
// components/elements/index.ts
export { Badge } from './Badge'
export { Button } from './Button'
export { Card } from './Card'
export { ProjectCard } from './ProjectCard'
export { SectionHeader } from './SectionHeader'
export { SkillBar } from './SkillBar'
export { StatCard } from './StatCard'
export { TechTag } from './TechTag'
export { TimelineItem } from './TimelineItem'
```

Then import easily:
```typescript
import { Button, Card, Badge } from '@/components/elements'
```

## ✅ Testing Atomic Components

Each component should have unit tests:

```typescript
// Button.test.tsx
describe('Button', () => {
  it('renders with correct label', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('calls onClick handler', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('respects disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByText('Disabled')).toBeDisabled()
  })
})
```

## 🔗 Related Documentation

- [Components Overview: components/README.md](../README.md) - Component system guide
- [Layout Components: components/layout/README.md](../layout/README.md)
- [Section Components: components/sections/README.md](../sections/README.md)
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [TypeScript](https://www.typescriptlang.org/) - Type system
