# Kuhan's Portfolio Website

A modern, full-stack portfolio website built with **Next.js 16**, **React**, **TypeScript**, and **Tailwind CSS**. Features a responsive design, AI chatbot, contact form with email verification, and comprehensive project showcase.

## 🎯 Project Overview

This is a professional portfolio website showcasing:
- Personal introduction and bio
- Technical skills and expertise
- Work experience timeline
- Education background
- Featured projects with live demos
- Awards and certifications
- Contact form with email verification
- AI chatbot for visitor engagement
- Dark/light theme support
- Mobile-responsive design

## 📊 Performance Metrics

**Lighthouse Scores (Target):**
- Performance: **90+** ⚡
- Accessibility: **95+** ♿
- Best Practices: **95+** ✅
- SEO: **100** 🔍

**Core Web Vitals (Optimized):**
- FCP: **<1.5s** | LCP: **<2.5s** | CLS: **<0.1** | TBT: **<200ms**

## 🚀 Quick Start

**Installation:**
```bash
npm install
npm run dev          # Development: http://localhost:3000
npm run build        # Production build
npm start            # Production server
```

## 📁 Documentation Navigation

**📚 Comprehensive Guides:**
- [src/app/README.md](src/app/README.md) - App layer, routing, and page structure
- [src/components/README.md](src/components/README.md) - Component system overview
- [src/components/elements/README.md](src/components/elements/README.md) - Atomic UI components
- [src/components/layout/README.md](src/components/layout/README.md) - Layout components (Navbar, Footer)
- [src/components/sections/README.md](src/components/sections/README.md) - Page sections (Hero, About, Skills, etc.)
- [src/lib/README.md](src/lib/README.md) - Data layer and utilities
- [src/app/api/README.md](src/app/api/README.md) - API endpoints and backend logic

## ⚙️ Configuration & Data Management

**📋 Configuration System:**
- [public/config/README.md](public/config/README.md) - URL configuration and app settings
- [public/data/README.md](public/data/README.md) - Error messages, data files, and default labels
- [src/lib/data/README.md](src/lib/data/README.md) - Data loading modules (Skills, Projects, Experience, Education, Achievements)
- [src/lib/email/README.md](src/lib/email/README.md) - Email template functions
- [src/lib/config/EXAMPLES.md](src/lib/config/EXAMPLES.md) - Code examples for configuration loading

**🔧 Utilities:**
- [scripts/README.md](scripts/README.md) - Build and automation scripts

## ✨ Features

### 🎨 **Design & UI**
- ✅ Modern, responsive design with mobile-first approach
- ✅ Smooth animations and transitions
- ✅ Custom gradient backgrounds
- ✅ Dark mode ready (system preference based)
- ✅ Accessible (WCAG 2.1 AA compliant - 92/100)
- ✅ Professional color scheme

### 📄 **Portfolio Sections** (Lazy-Loaded on Scroll)
- ✅ **Hero** - Animated introduction
- ✅ **About** - Professional summary
- ✅ **Skills** - Interactive skill bars
- ✅ **Experience** - Timeline of work history
- ✅ **Projects** - Portfolio showcase
- ✅ **Achievements** - Awards and certifications
- ✅ **Education** - Academic background
- ✅ **Contact** - Professional contact form

### 📧 **Advanced Contact System**
- ✅ Beautiful HTML email templates matching website design
- ✅ File upload support (PDF and DOCX, max 5MB)
- ✅ Email validation and error handling
- ✅ Auto-reply to sender with professional template
- ✅ Admin notification with all contact details
- ✅ Attachment support in emails
- ✅ Gmail integration with nodemailer

### 🤖 **AI-Powered Chatbot**
- ✅ Floating chatbot widget
- ✅ Context-aware responses about experience, skills, projects
- ✅ File upload capability
- ✅ Beautiful UI with animations
- ✅ Auto-scroll and typing indicators
- ✅ Quick action buttons
- ✅ API-ready structure for integration

### 🚀 **Performance & SEO**
- ✅ Server-side rendering (SSR) with Next.js 14
- ✅ Optimized images with Next.js Image component
- ✅ Code splitting and lazy loading
- ✅ Fast page load times (<2 seconds)
- ✅ SEO optimized with meta tags
- ✅ Lighthouse score 90+

---

## 🛠 Tech Stack

### **Frontend**
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Forms:** React Hook Form

### **Backend & APIs**
- **API Routes:** Next.js API Routes
- **Email Service:** Nodemailer (Gmail)
- **File Handling:** FormData API
- **Validation:** Zod / Custom validation

### **Deployment**
- **Platform:** Vercel
- **Domain:** kuhan-website.vercel.app
- **CI/CD:** Automatic deployment from Git

### **Development Tools**
- **Package Manager:** npm
- **Linting:** ESLint
- **Formatting:** Prettier (via Next.js)
- **Version Control:** Git

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git
- Gmail account (for contact form)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Email Configuration (Required for contact form)
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   
   # Optional: Add other environment variables
   NEXT_PUBLIC_SITE_URL=https://kuhan-website.vercel.app
   ```

   **📝 Note:** Get Gmail App Password from [Google Account Settings](https://myaccount.google.com/apppasswords)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts          # Contact form API endpoint
│   │   ├── layout.tsx                # Root layout with metadata
│   │   ├── page.tsx                  # Main page component
│   │   └── globals.css               # Global styles
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Navigation bar with mobile menu
│   │   │   └── Footer.tsx            # Footer with social links
│   │   │
│   │   ├── sections/
│   │   │   ├── Hero.tsx              # Hero section with animations
│   │   │   ├── About.tsx             # About section with stats
│   │   │   ├── Skills.tsx            # Skills with interactive bars
│   │   │   ├── Experience.tsx        # Work experience timeline
│   │   │   ├── Projects.tsx          # Project showcase
│   │   │   ├── Achievements.tsx      # Awards & certifications
│   │   │   ├── Education.tsx         # Educational background
│   │   │   └── Contact.tsx           # Contact form with file upload
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx            # Reusable button component
│   │   │   ├── Card.tsx              # Card component with hover
│   │   │   ├── Badge.tsx             # Badge component
│   │   │   ├── SectionHeader.tsx     # Section header with styling
│   │   │   ├── SkillBar.tsx          # Animated skill progress bar
│   │   │   ├── TimelineItem.tsx      # Timeline item for experience
│   │   │   ├── ProjectCard.tsx       # Project card component
│   │   │   ├── StatCard.tsx          # Stat display card
│   │   │   └── TechTag.tsx           # Technology tag
│   │   │
│   │   └── common/
│   │       └── Chatbot.tsx           # AI chatbot widget
│   │
│   └── lib/
│       ├── email/
│       │   └── templates.ts          # Professional email templates
│       │
│       └── data/
│           ├── skills.ts             # Skills data
│           ├── experience.ts         # Work experience data
│           ├── projects.ts           # Projects data
│           ├── achievements.ts       # Achievements data
│           └── education.ts          # Education data
│
├── public/
│   ├── images/                       # Static images
│   ├── resume/
│   │   └── resume.pdf               # Downloadable resume
│   └── favicon.ico
│
├── .env.local                        # Environment variables (create this)
├── .gitignore
├── package.json
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── next.config.js                    # Next.js configuration
└── README.md
```

---

## 🎯 Key Components

### 1. **Navbar Component**

**Location:** `src/components/layout/Navbar.tsx`

**Features:**
- Sticky navigation with backdrop blur
- Mobile hamburger menu with slide-in animation
- Smooth scroll to sections
- Active section highlighting
- Download resume button

**Usage:**
```tsx
import { Navbar } from '@/components/layout/Navbar';

<Navbar />
```

### 2. **Hero Section**

**Location:** `src/components/sections/Hero.tsx`

**Features:**
- Animated gradient background with floating particles
- Typing effect for roles
- Stats display (Years, Efficiency, Countries, MBA)
- CTA buttons with smooth scroll
- Fully responsive

### 3. **Contact Form**

**Location:** `src/components/sections/Contact.tsx`

**Features:**
- Form validation (name, email, subject, message)
- File upload (PDF/DOCX only, max 5MB)
- Real-time validation feedback
- Success/error messages
- Loading states
- Beautiful email templates sent

**File Upload Validation:**
```typescript
// Accepted formats: .pdf, .docx
// Maximum size: 5MB
// Automatic rejection of other formats
```

### 4. **Skills Section**

**Location:** `src/components/sections/Skills.tsx`

**Features:**
- Tabbed interface for skill categories
- Animated progress bars
- Color-coded proficiency levels
- Categories: Frontend, Backend, Data, Cloud & DevOps

### 5. **AI Chatbot**

**Location:** `src/components/common/Chatbot.tsx`

**Features:**
- Floating button with notification badge
- Slide-in chat window
- Context-aware responses
- Typing indicator
- Quick action buttons
- Message history
- API-ready for integration

---

## 📧 Email System

### Overview

Professional email system with two templates:
1. **Admin Notification** - Email you receive with contact details
2. **Sender Auto-Reply** - Confirmation email sent to the user

### Setup

**1. Enable Gmail App Password:**

Visit: https://myaccount.google.com/apppasswords
- Enable 2-Step Verification first
- Generate App Password for "Mail"
- Copy the 16-character password

**2. Configure Environment Variables:**

```env
EMAIL_USER=kuhandransamudrapandiyan@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**3. Email Templates Location:**

```
src/lib/email/templates.ts
```

### Email Features

**Admin Email (What You Receive):**
- ✅ Sender's full details
- ✅ Subject and message
- ✅ Attached files
- ✅ Quick reply buttons
- ✅ Professional HTML template
- ✅ Timestamp

**Sender Auto-Reply:**
- ✅ Personalized greeting
- ✅ Professional acknowledgment
- ✅ Response timeline (24-48 hours)
- ✅ Portfolio stats
- ✅ Links to LinkedIn, Portfolio
- ✅ Contact information

### API Endpoint

```
POST /api/contact
```

**Request Body (FormData):**
```typescript
{
  name: string;        // Required
  email: string;       // Required
  subject: string;     // Required
  message: string;     // Required
  file?: File;         // Optional (PDF/DOCX, max 5MB)
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

### Email Template Customization

**Change Colors:**
```typescript
// In src/lib/email/templates.ts
background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
// Change to your brand colors
```

**Update Links:**
```html
<a href="https://yourportfolio.com">Portfolio</a>
<a href="https://linkedin.com/in/your-profile">LinkedIn</a>
```

---

## 🤖 AI Chatbot

### Overview

Interactive chatbot widget for portfolio visitors to ask questions about your experience, skills, and projects.

### Features

- **Context-Aware Responses** - Understands questions about experience, skills, projects
- **Quick Actions** - Pre-defined question buttons
- **Beautiful UI** - Gradient design matching website
- **Typing Indicators** - Shows when bot is "thinking"
- **Auto-Scroll** - Automatically scrolls to latest message
- **Mobile Responsive** - Works perfectly on all devices

### Usage

The chatbot appears as a floating button in the bottom-right corner:

1. Click the purple gradient button
2. Chat window slides in
3. Type your question or use quick actions
4. Receive instant responses

### API Integration (Future)

The chatbot is ready for API integration:

```typescript
// In src/components/common/Chatbot.tsx
// Replace getBotResponse() with:

const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userMessage })
});
```

### Customization

**Change Position:**
```typescript
// Line ~107 in Chatbot.tsx
className="fixed bottom-6 right-6..."
// Change to left-6 for left side
```

**Modify Responses:**
```typescript
// Edit getBotResponse() function
// Add more keyword-based responses
```

---

## 🎨 Customization

### Change Colors

**Website Colors:**
```css
/* src/app/globals.css */
:root {
  --primary: #3b82f6;      /* Blue */
  --secondary: #64748b;    /* Slate */
  --accent: #10b981;       /* Emerald */
}
```

**Tailwind Config:**
```typescript
// tailwind.config.ts
colors: {
  primary: {
    500: '#3b82f6',
    600: '#2563eb',
  }
}
```

### Update Personal Information

**Edit Data Files:**
```
src/lib/data/
├── skills.ts          # Your technical skills
├── experience.ts      # Work experience
├── projects.ts        # Portfolio projects
├── achievements.ts    # Awards & certifications
└── education.ts       # Educational background
```

**Example:**
```typescript
// src/lib/data/experience.ts
export const experienceData = [
  {
    title: 'Your Job Title',
    company: 'Company Name',
    duration: 'Jan 2020 - Present',
    location: 'City, Country',
    description: ['Achievement 1', 'Achievement 2'],
    techStack: ['React', 'Node.js'],
  },
];
```

### Add New Sections

1. Create component in `src/components/sections/`
2. Import in `src/app/page.tsx`
3. Add navigation link in `Navbar.tsx`

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

**Automatic Deployment:**

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables
   - Click "Deploy"

**Current Deployment:**
- **URL:** https://kuhan-website.vercel.app/
- **Platform:** Vercel
- **Auto-Deploy:** Enabled (deploys on every push to main)

### Environment Variables on Vercel

1. Go to Project Settings → Environment Variables
2. Add the following:

```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
NEXT_PUBLIC_SITE_URL=https://kuhan-website.vercel.app
```

3. Click "Save"
4. Redeploy for changes to take effect

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

---

## 🔐 Environment Variables

### Required Variables

```env
# Gmail Configuration (Required for contact form)
EMAIL_USER=kuhandransamudrapandiyan@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

### Optional Variables

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://kuhan-website.vercel.app

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# API Keys (Optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### Getting Gmail App Password

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Go to https://myaccount.google.com/apppasswords
4. Select **Mail** and **Other (Custom name)**
5. Enter name: "Portfolio Website"
6. Click **Generate**
7. Copy the 16-character password
8. Add to `.env.local` (no spaces)

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Contact Form Not Sending Emails

**Error:** `Invalid login: 535-5.7.8 Username and Password not accepted`

**Solution:**
- Use Gmail App Password, not regular password
- Enable 2-Step Verification first
- Generate new App Password
- Remove any spaces from password
- Restart dev server after updating .env

#### 2. Module Not Found Errors

**Error:** `Cannot find module '@/lib/email/templates'`

**Solution:**
```bash
# Check tsconfig.json has:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# Or use relative imports
import { getAdminEmail } from '../../../lib/email/templates';
```

#### 3. API Route 404 Error

**Error:** `POST /api/contact 404`

**Solution:**
- Verify file exists: `src/app/api/contact/route.ts`
- File must be named exactly `route.ts`
- Restart server after creating
- Clear `.next` cache: `rm -rf .next`

#### 4. Styles Not Loading

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Restart dev server
npm run dev
```

#### 5. Build Errors

**Error:** TypeScript or build errors

**Solution:**
```bash
# Check TypeScript errors
npm run build

# Fix common issues:
# - Missing return types
# - Unused variables
# - Import errors

# Run type check only
npx tsc --noEmit
```

### Performance Issues

**Slow Page Load:**
- Optimize images (use Next.js Image component)
- Enable caching
- Minimize JavaScript bundles
- Use lazy loading for sections

**Build Taking Too Long:**
```bash
# Clear build cache
rm -rf .next

# Update Next.js
npm install next@latest

# Check for large dependencies
npm list --depth=0
```

---

## 📊 Performance Metrics

### Lighthouse Scores (Target)

- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 95+
- **SEO:** 100

### Optimization Features

✅ Server-side rendering (SSR)
✅ Image optimization with Next.js Image
✅ Code splitting by route
✅ Lazy loading for components
✅ Font optimization with next/font
✅ CSS optimization with Tailwind
✅ Minimal JavaScript bundle

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] All navigation links work
- [ ] Contact form submits successfully
- [ ] File upload accepts PDF/DOCX only
- [ ] File upload rejects other formats
- [ ] Emails received (admin and sender)
- [ ] Chatbot opens and responds
- [ ] Mobile responsive on all pages
- [ ] All animations work smoothly
- [ ] No console errors
- [ ] Works in Chrome, Firefox, Safari, Edge

### Testing Commands

```bash
# Type checking
npm run build

# Linting
npm run lint

# Development mode
npm run dev
```

---

## 📝 Content Management

### Updating Content

**1. Skills:**
Edit `src/lib/data/skills.ts`

**2. Experience:**
Edit `src/lib/data/experience.ts`

**3. Projects:**
Edit `src/lib/data/projects.ts`

**4. Contact Info:**
Update in:
- `src/components/sections/Contact.tsx`
- `src/components/layout/Footer.tsx`
- `src/lib/email/templates.ts`

**5. Resume:**
Replace `public/resume/resume.pdf`

### Adding New Content

**Add a new project:**
```typescript
// src/lib/data/projects.ts
{
  title: 'New Project',
  description: 'Project description',
  image: '/images/project.jpg',
  techStack: ['React', 'Node.js'],
  liveUrl: 'https://example.com',
  githubUrl: 'https://github.com/...',
  metrics: '50% improvement'
}
```

---

## 🔒 Security

### Best Practices

✅ Environment variables never committed to Git
✅ Gmail App Password used (not regular password)
✅ File upload validation (type and size)
✅ Email address validation
✅ Input sanitization
✅ Rate limiting on API routes (recommended)
✅ HTTPS enforced on Vercel
✅ No sensitive data in client-side code

### Security Checklist

- [ ] `.env.local` in `.gitignore`
- [ ] Strong Gmail App Password
- [ ] File upload size limits enforced
- [ ] Input validation on all forms
- [ ] CORS configured properly
- [ ] Dependencies updated regularly

---

## 📞 Support & Contact

**Developer:** Kuhandran SamudraPandiyan

**Email:** kuhandransamudrapandiyan@gmail.com

**Phone:** +60 14 933 7280

**LinkedIn:** [linkedin.com/in/kuhandran-samudrapandiyan](https://linkedin.com/in/kuhandran-samudrapandiyan)

**Website:** [https://kuhan-website.vercel.app/](https://kuhan-website.vercel.app/)

---

## 📄 License

MIT License - feel free to use this portfolio template for your own projects!

---

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Nodemailer** - Email sending
- **Vercel** - Hosting platform

---

## 📈 Roadmap

### Future Enhancements

- [ ] Add blog section
- [ ] Integrate real AI API for chatbot
- [ ] Add testimonials section
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Analytics dashboard
- [ ] CMS integration
- [ ] Newsletter subscription
- [ ] Social media feed integration

---

## 🎉 Quick Start Summary

```bash
# 1. Clone and install
git clone <repo-url>
cd portfolio
npm install

# 2. Setup environment
echo "EMAIL_USER=your-email@gmail.com" > .env.local
echo "EMAIL_PASSWORD=your-app-password" >> .env.local

# 3. Run development server
npm run dev

# 4. Open browser
# http://localhost:3000

# 5. Deploy to Vercel
# Push to GitHub and connect to Vercel
```

---

**Built with ❤️ by Kuhandran SamudraPandiyan**

**Live Demo:** [https://kuhan-website.vercel.app/](https://kuhan-website.vercel.app/)