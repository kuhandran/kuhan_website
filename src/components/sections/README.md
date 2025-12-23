# src/components/sections/ - Page Sections

Full-featured page sections with business logic, state management, and data integration.

## 📁 Structure

```
sections/
├── About.tsx             # Personal introduction
├── Achievements.tsx      # Awards and certifications
├── Chatbot.tsx          # AI chatbot interface
├── chatbotHelpers.ts    # Message processing utilities
├── ChatbotState.ts      # State management for chatbot
├── ChatProcess.tsx      # Chatbot message processing
├── Contact.tsx          # Contact form with email
├── Education.tsx        # Education timeline
├── EmailCaptcha.tsx     # Email verification with CAPTCHA
├── Experience.tsx       # Work experience timeline
├── Hero.tsx            # Welcome/landing section
├── OtpEntry.tsx        # OTP input and validation
├── Projects.tsx        # Portfolio projects showcase
└── Skills.tsx          # Technical skills display
```

## 🎯 Overview

Section components are:
- **Full-featured modules** representing main page areas
- **Self-contained** with internal state and logic
- **Data-driven** pulling from `lib/data/`
- **Interactive** with user engagement features
- **Responsive** across all device sizes

## 📋 Component Reference

### Hero.tsx
Landing section with welcome message and introduction.

**Purpose:** First impression, call-to-action, visual appeal

**Features:**
- Large profile image or avatar
- Welcome message with name
- Brief tagline/headline
- Call-to-action buttons (View Projects, Contact Me)
- Animated background or pattern
- Responsive layout

**Structure:**
```typescript
export function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center">
      {/* Hero background/animation */}
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Text content */}
          <div>
            <h1>Welcome</h1>
            <p>Subtitle/tagline</p>
            <div className="flex gap-4">
              <Button>View Projects</Button>
              <Button variant="secondary">Contact Me</Button>
            </div>
          </div>
          {/* Profile image */}
          <div>
            <Image src="/profile.png" alt="Profile" />
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Key Data:**
- Name, title, summary
- Call-to-action links
- Profile image

### About.tsx
Personal background and introduction section.

**Purpose:** Build credibility, establish expertise

**Features:**
- Bio paragraph(s)
- Key highlights/skills preview
- Personality/values statement
- Links to full sections
- Timeline of milestones
- Experience highlights

**Structure:**
```typescript
export function About() {
  return (
    <section id="about" className="py-12 md:py-20">
      <SectionHeader title="About Me" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* Bio text */}
        </div>
        <div>
          {/* Stats or highlights */}
          <StatCard label="Years Experience" value={5} />
          <StatCard label="Projects Completed" value={25} />
          <StatCard label="Clients Satisfied" value={100} />
        </div>
      </div>
    </section>
  )
}
```

### Skills.tsx
Technical skills and proficiency showcase.

**Purpose:** Display technical expertise

**Features:**
- Skill categories (Frontend, Backend, Tools, etc.)
- Proficiency bars with percentages
- Technology tags/badges
- Interactive filtering (optional)
- Skill endorsements counter (if applicable)
- Responsive grid layout

**Structure:**
```typescript
import { SkillBar } from '../elements/SkillBar'
import { TechTag } from '../elements/TechTag'

export function Skills() {
  const skillCategories = {
    frontend: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    backend: ['Node.js', 'PostgreSQL', 'Express.js', 'GraphQL'],
    tools: ['Git', 'Docker', 'CI/CD', 'VS Code']
  }

  return (
    <section id="skills" className="py-12">
      <SectionHeader title="Skills" />
      <div className="space-y-8">
        {Object.entries(skillCategories).map(([category, skills]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-4">{category}</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map(skill => (
                <TechTag key={skill}>{skill}</TechTag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

**Data Structure:**
```typescript
// From lib/data/skills.ts
interface Skill {
  name: string
  proficiency: number // 0-100
  category: string
  years?: number
}
```

### Experience.tsx
Work history and professional timeline.

**Purpose:** Demonstrate professional growth and track record

**Features:**
- Timeline layout (vertical/horizontal)
- Job title, company, duration
- Job description and key responsibilities
- Technologies/tools used
- Achievement highlights
- Chronological or reverse-chronological order

**Structure:**
```typescript
import { TimelineItem } from '../elements/TimelineItem'

export function Experience() {
  const experiences = getExperiences() // From lib/data

  return (
    <section id="experience" className="py-12">
      <SectionHeader title="Experience" />
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <TimelineItem
            key={index}
            date={`${exp.startDate} - ${exp.endDate}`}
            title={exp.jobTitle}
            subtitle={exp.company}
            description={exp.description}
            details={exp.achievements}
          />
        ))}
      </div>
    </section>
  )
}
```

**Data Structure:**
```typescript
interface Experience {
  jobTitle: string
  company: string
  startDate: string
  endDate: string
  description: string
  achievements: string[]
  technologies?: string[]
}
```

### Education.tsx
Academic background and credentials.

**Purpose:** Establish educational foundation

**Features:**
- Education timeline
- Degree, institution, graduation date
- GPA and honors (if applicable)
- Relevant coursework or highlights
- Certifications and awards

**Structure:**
```typescript
import { TimelineItem } from '../elements/TimelineItem'

export function Education() {
  const education = getEducation() // From lib/data

  return (
    <section id="education" className="py-12">
      <SectionHeader title="Education" />
      <div className="space-y-8">
        {education.map((edu, index) => (
          <TimelineItem
            key={index}
            date={`${edu.graduationYear}`}
            title={edu.degree}
            subtitle={edu.institution}
            description={edu.field}
            details={edu.highlights}
          />
        ))}
      </div>
    </section>
  )
}
```

### Projects.tsx
Portfolio projects showcase.

**Purpose:** Demonstrate practical skills through examples

**Features:**
- Project cards with images
- Project title and description
- Technology stack
- Live demo and GitHub links
- Filtering by category or technology
- Featured/pinned projects
- Responsive grid layout

**Structure:**
```typescript
import { ProjectCard } from '../elements/ProjectCard'

export function Projects() {
  const projects = getProjects() // From lib/data
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => p.categories.includes(filter))

  return (
    <section id="projects" className="py-12">
      <SectionHeader title="Projects" />
      
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Badge
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-blue-500' : ''}
        >
          All
        </Badge>
        {['Frontend', 'Backend', 'Full Stack'].map(cat => (
          <Badge key={cat} onClick={() => setFilter(cat)}>
            {cat}
          </Badge>
        ))}
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(project => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            image={project.image}
            technologies={project.technologies}
            links={project.links}
            featured={project.featured}
          />
        ))}
      </div>
    </section>
  )
}
```

**Data Structure:**
```typescript
interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  categories: string[]
  featured: boolean
  links: {
    github?: string
    demo?: string
    article?: string
  }
}
```

### Achievements.tsx
Awards, certifications, and recognition.

**Purpose:** Highlight recognition and credentials

**Features:**
- Achievement cards
- Certificate images
- Issuing organization
- Issue and expiry dates
- Verification links
- Categories (Certifications, Awards, Publications, etc.)

**Structure:**
```typescript
import { Card } from '../elements/Card'
import { Badge } from '../elements/Badge'

export function Achievements() {
  const achievements = getAchievements() // From lib/data

  return (
    <section id="achievements" className="py-12">
      <SectionHeader title="Achievements" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map(achievement => (
          <Card key={achievement.id}>
            {achievement.image && (
              <Image
                src={achievement.image}
                alt={achievement.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <div className="p-4">
              <Badge variant="blue">{achievement.category}</Badge>
              <h3 className="text-lg font-semibold mt-2">
                {achievement.title}
              </h3>
              <p className="text-gray-600">{achievement.issuer}</p>
              <p className="text-sm text-gray-500">{achievement.date}</p>
              {achievement.link && (
                <a href={achievement.link} className="text-blue-500 hover:underline">
                  View Certificate →
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
```

### Contact.tsx
Contact form and communication section.

**Purpose:** Enable user contact

**Features:**
- Contact form (name, email, message)
- Form validation
- Email verification with CAPTCHA
- OTP validation for email confirmation
- Success/error messages
- Accessibility compliance
- Alternative contact methods (email, phone, social)

**Structure:**
```typescript
import { EmailCaptcha } from './EmailCaptcha'
import { OtpEntry } from './OtpEntry'

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setShowCaptcha(true)
  }

  const handleCaptchaSuccess = async () => {
    setShowCaptcha(false)
    setShowOtp(true)
  }

  const handleOtpSuccess = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(formData)
      })
      // Handle response
    } finally {
      setLoading(false)
      setShowOtp(false)
    }
  }

  return (
    <section id="contact" className="py-12">
      <SectionHeader title="Get In Touch" />
      
      {showCaptcha && (
        <EmailCaptcha
          email={formData.email}
          onSuccess={handleCaptchaSuccess}
        />
      )}

      {showOtp && (
        <OtpEntry onSuccess={handleOtpSuccess} />
      )}

      {!showCaptcha && !showOtp && (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <textarea
            placeholder="Your Message"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      )}
    </section>
  )
}
```

### Chatbot.tsx
AI chatbot interface for user interaction.

**Purpose:** Provide interactive assistance and engagement

**Features:**
- Message display with history
- User input field
- Auto-scrolling to latest message
- Loading indicators
- Error handling
- Typing indicators
- Chat persistence (localStorage)
- Floating button toggle

**Structure:**
```typescript
import { ChatProcess } from './ChatProcess'
import { useChatbotState } from './ChatbotState'

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    setMessages(prev => [...prev, { text: input, sender: 'user' }])
    setInput('')
    setLoading(true)

    try {
      // Process message
      const response = await ChatProcess(input)
      setMessages(prev => [...prev, { text: response, sender: 'bot' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 rounded-full bg-blue-500 text-white p-4 shadow-lg"
        aria-label="Open chatbot"
      >
        💬
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-96 bg-white rounded-lg shadow-xl flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-500">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-3 py-2"
            />
            <Button onClick={handleSend} disabled={loading}>
              Send
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
```

### Supporting Components

#### EmailCaptcha.tsx
Email verification with CAPTCHA challenge.

**Props:**
```typescript
interface EmailCaptchaProps {
  email: string
  onSuccess: () => void
  onError?: (error: Error) => void
}
```

**Features:**
- reCAPTCHA integration
- Sends OTP to email
- Verification display
- Error handling

#### OtpEntry.tsx
One-Time Password input and verification.

**Props:**
```typescript
interface OtpEntryProps {
  onSuccess: () => void
  onError?: (error: Error) => void
  email?: string
}
```

**Features:**
- 6-digit OTP input
- Auto-focus between fields
- Resend OTP option
- Verification timeout
- Error messages

#### ChatProcess.tsx
Message processing and response generation.

**Functions:**
```typescript
export async function ChatProcess(userMessage: string): Promise<string> {
  // Process message
  // Generate response
  // Return to chatbot
}
```

#### chatbotHelpers.ts
Utility functions for chatbot operations.

```typescript
export function parseUserIntent(message: string): Intent
export function generateResponse(intent: Intent): string
export function saveConversation(messages: Message[]): void
export function loadConversation(): Message[]
```

#### ChatbotState.ts
State management for chatbot using Context API or Zustand.

```typescript
export interface ChatbotState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  addMessage: (message: Message) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useChatbotState = create<ChatbotState>(...)
```

## 🎨 Styling Pattern

All sections follow consistent styling:

```typescript
<section id="section-name" className="py-12 md:py-20">
  {/* Header */}
  <SectionHeader title="Section Title" description="Optional description" />
  
  {/* Content container */}
  <div className="container max-w-6xl mx-auto px-4">
    {/* Content grid or layout */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Individual items */}
    </div>
  </div>
</section>
```

## 🔄 Data Integration

All sections import from `lib/data/`:

```typescript
import { experiences } from '@/lib/data/experience'
import { projects } from '@/lib/data/projects'
import { skills } from '@/lib/data/skills'
import { education } from '@/lib/data/education'
import { achievements } from '@/lib/data/achievements'
```

## 📱 Responsive Design

All sections are mobile-first:
- Single column on mobile (sm)
- 2 columns on tablet (md)
- 3+ columns on desktop (lg)

## 🚀 Adding a New Section

1. Create new file: `NewSection.tsx`
2. Import elements and data
3. Build component structure
4. Add to `app/page.tsx`
5. Add navigation link in `Navbar.tsx`

```typescript
// components/sections/NewSection.tsx
import { SectionHeader } from '../elements/SectionHeader'
import { Card } from '../elements/Card'

export function NewSection() {
  return (
    <section id="new-section" className="py-12 md:py-20">
      <SectionHeader title="New Section" />
      <div className="container">
        {/* Section content */}
      </div>
    </section>
  )
}
```

## 🔗 Related Documentation

- [Components Overview: components/README.md](../README.md)
- [Atomic Elements: components/elements/README.md](../elements/README.md)
- [Layout: components/layout/README.md](../layout/README.md)
- [Data Layer: lib/README.md](../../lib/README.md)
- [App Layer: app/README.md](../../app/README.md)
