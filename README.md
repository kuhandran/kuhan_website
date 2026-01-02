# Kuhan's Portfolio Website

A modern, full-stack portfolio website built with **Next.js 16**, **React**, **TypeScript**, and **Tailwind CSS**. Features responsive design, AI chatbot, contact form with email verification, visitor analytics, and comprehensive project showcase.

## 🎯 Project Overview

Professional portfolio showcasing:
- Personal introduction and bio
- Technical skills and expertise
- Work experience timeline
- Education background
- Featured projects with live demos
- Awards and certifications
- Contact form with email verification
- AI chatbot for visitor engagement
- Visitor analytics (Location, Language, Browser)
- Dark/light theme support
- Mobile-responsive design

---

## 📚 Documentation

**All comprehensive documentation is in the [`docs/`](./docs/) folder.**

Start here: **[docs/INDEX.md](./docs/INDEX.md)** - Complete navigation guide

### Quick Links to Key Documentation:

| Topic | Document |
|-------|----------|
| 🏗️ **Architecture** | [docs/01-ARCHITECTURE.md](./docs/01-ARCHITECTURE.md) |
| 🔧 **Configuration** | [docs/02-CONFIGURATION.md](./docs/02-CONFIGURATION.md) |
| 🌍 **Languages** | [docs/03-LANGUAGE-SYSTEM.md](./docs/03-LANGUAGE-SYSTEM.md) |
| 📡 **API & Data** | [docs/04-API-DATA.md](./docs/04-API-DATA.md) |
| 🖼️ **Images & Media** | [docs/05-IMAGES-MEDIA.md](./docs/05-IMAGES-MEDIA.md) |
| ⚡ **Performance** | [docs/06-PERFORMANCE.md](./docs/06-PERFORMANCE.md) |
| 🔄 **State Management** | [docs/07-STATE-MANAGEMENT.md](./docs/07-STATE-MANAGEMENT.md) |
| ✅ **Setup & Deploy** | [docs/08-SETUP-DEPLOYMENT.md](./docs/08-SETUP-DEPLOYMENT.md) |
| 📋 **Implementation** | [docs/09-IMPLEMENTATION.md](./docs/09-IMPLEMENTATION.md) |
| 🎨 **Code Standards** | [docs/10-CODE-STANDARDS.md](./docs/10-CODE-STANDARDS.md) |
| 🔍 **Reference** | [docs/11-REFERENCE.md](./docs/11-REFERENCE.md) |
| 💻 **Code Examples** | [docs/CONFIGURATION_EXAMPLES.ts](./docs/CONFIGURATION_EXAMPLES.ts) |

### Code Documentation:

- [src/app/README.md](src/app/README.md) - App layer & routing
- [src/components/README.md](src/components/README.md) - Component system
- [src/lib/README.md](src/lib/README.md) - Utilities & hooks
- [src/pwa/README.md](src/pwa/README.md) - PWA & Service Worker
- [scripts/README.md](scripts/README.md) - Automation scripts

### Scripts & Tools:

- [scripts/optimize-logo.js](scripts/optimize-logo.js) - Logo optimization utility
- [docs/LOGO_OPTIMIZATION.md](docs/LOGO_OPTIMIZATION.md) - Logo implementation guide
- [docs/LOGO_QUICK_START.md](docs/LOGO_QUICK_START.md) - Logo quick reference

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Gmail account (for contact form)

### Installation

```bash
# Clone repository
git clone <repo-url>
cd kuhan_website

# Install dependencies
npm install

# Create environment file
cat > .env.local << EOF
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
NEXT_PUBLIC_SITE_URL=https://kuhan-website.vercel.app
EOF

# Start development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in browser.

### Build & Production

```bash
npm run build       # Production build
npm start           # Production server
```

---

## 📊 Performance Metrics

| Metric | Target |
|--------|--------|
| Performance | 90+ |
| Accessibility | 95+ |
| Best Practices | 95+ |
| SEO | 100 |

**Core Web Vitals:** FCP <1.5s | LCP <2.5s | CLS <0.1 | TBT <200ms

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 16
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Forms:** React Hook Form

### Backend & APIs
- **API Routes:** Next.js API Routes
- **Email:** Nodemailer (Gmail)
- **Analytics:** IP Geolocation (ipapi.co)
- **Validation:** Zod / Custom

### Deployment
- **Platform:** Vercel
- **Domain:** kuhan-website.vercel.app
- **CI/CD:** Auto-deploy from Git

---

## ✨ Key Features

### 🎨 Design & UI
- Modern responsive design
- Smooth animations
- Dark/light themes
- WCAG 2.1 AA compliant
- Mobile-first approach

### 📄 Portfolio Sections
- **Hero** - Animated introduction
- **About** - Professional summary
- **Skills** - Interactive skill bars
- **Experience** - Work timeline
- **Projects** - Portfolio showcase
- **Achievements** - Awards & certifications
- **Education** - Background
- **Contact** - Form with file upload

### 📧 Advanced Contact
- HTML email templates
- File upload (PDF/DOCX, 5MB max)
- Email validation
- Auto-reply system
- Gmail integration

### 🤖 AI Chatbot
- Floating widget
- Context-aware responses
- Typing indicators
- Quick actions
- API-ready

### 📊 Visitor Analytics
- **Location tracking** - City, country, coordinates
- **Language detection** - Browser preference
- **Browser intelligence** - Name, version, OS
- **GDPR/CCPA compliant** - Privacy-first
- **No personal data** - Fully anonymized

### 🚀 Performance & SEO
- Server-side rendering (SSR)
- Image optimization
- Code splitting
- Lazy loading
- SEO optimized
- Lighthouse 90+

---

## 📁 Project Structure

```
src/
├── app/                 (Next.js App Router)
├── components/          (React Components)
├── lib/                 (Utilities & Hooks)
└── pwa/                 (Progressive Web App)

docs/                    (Comprehensive Documentation)
public/                  (Static Files)
scripts/                 (Automation Scripts)
```

**For detailed structure, see [docs/01-ARCHITECTURE.md](./docs/01-ARCHITECTURE.md)**

---

## 🔐 Environment Variables

### Required
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Optional
```env
NEXT_PUBLIC_SITE_URL=https://kuhan-website.vercel.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Note:** Get Gmail App Password from [Google Account Settings](https://myaccount.google.com/apppasswords)

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Import repository
4. Add environment variables
5. Deploy!

**Current:** https://kuhan-website.vercel.app/

---

## 🧪 Testing

```bash
npm run build      # Type checking
npm run lint       # Linting
npm run dev        # Development
```

### Manual Checklist
- [ ] Navigation works
- [ ] Contact form submits
- [ ] File upload validates
- [ ] Emails send
- [ ] Chatbot responds
- [ ] Analytics tracks
- [ ] Mobile responsive
- [ ] No console errors
- [ ] PWA installable
- [ ] Works offline

---

## 📝 Content Management

### Update Data
- Skills: `src/lib/data/skills.ts`
- Experience: `src/lib/data/experience.ts`
- Projects: `src/lib/data/projects.ts`
- Education: `src/lib/data/education.ts`
- Achievements: `src/lib/data/achievements.ts`

### Update Contact Info
- Contact form: `src/components/sections/Contact.tsx`
- Footer: `src/components/layout/Footer.tsx`
- Email: `src/lib/email/templates.ts`

### Update Resume
Replace: `public/resume/resume.pdf`

---

## 🐛 Troubleshooting

### Contact Form Not Sending
- Use Gmail App Password (not regular password)
- Enable 2-Step Verification
- Check `.env.local` has no spaces
- Restart dev server

### Module Not Found
- Check `tsconfig.json` paths
- Clear `.next` cache: `rm -rf .next`
- Reinstall: `npm install`

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Analytics Not Tracking
- Check consent banner appears
- Accept analytics from banner
- Check Network tab for POST requests
- Verify `/api/analytics/visitor` endpoint

---

## 🔒 Security

✅ Environment variables in `.gitignore`
✅ Gmail App Password used
✅ File upload validation
✅ Email validation
✅ Input sanitization
✅ HTTPS enforced
✅ No sensitive client data
✅ Analytics consent required

---

## 📞 Contact & Support

**Developer:** Kuhandran SamudraPandiyan

**Email:** kuhandransamudrapandiyan@gmail.com  
**Phone:** +60 14 933 7280  
**LinkedIn:** [linkedin.com/in/kuhandran-samudrapandiyan](https://linkedin.com/in/kuhandran-samudrapandiyan)  
**Website:** [kuhan-website.vercel.app](https://kuhan-website.vercel.app/)

---

## 📄 License

MIT License - Feel free to use this portfolio template for your own projects!

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

- [ ] Blog section
- [ ] Real AI API integration
- [ ] Testimonials
- [ ] Dark mode toggle
- [ ] Advanced analytics dashboard
- [ ] CMS integration
- [ ] Newsletter subscription

---

## 🎉 Summary

**Fast Setup:**
1. Clone & install: `git clone <url> && npm install`
2. Create `.env.local` with Gmail credentials
3. Start dev: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

**For everything else:**
👉 See [**docs/INDEX.md**](./docs/INDEX.md)

---

**Built with ❤️ by Kuhandran SamudraPandiyan**

**Live:** [https://kuhan-website.vercel.app/](https://kuhan-website.vercel.app/)  
**Last Updated:** January 2026
