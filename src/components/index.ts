/**
 * CENTRALIZED COMPONENT EXPORTS
 * 
 * Import all components from this single file:
 * ✅ import { Button, Card, CaseStudiesHero } from '@/components'
 * 
 * DO NOT import from scattered locations like:
 * ❌ import { Button } from '@/components/elements'
 * ❌ import { CaseStudiesHero } from '@/app/case-studies/components'
 */

// Elements - Atomic/Primitive Components
export { Badge } from './elements/Badge';
export { Button } from './elements/Button';
export { Card } from './elements/Card';
export { EducationCard } from './elements/EducationCard';
export { FormElement } from './elements/FormElement';
export { HighlightItem } from './elements/HighlightItem';
export { ProjectCard } from './elements/ProjectCard';
export { SectionCard } from './elements/SectionCard';
export { SectionHeader } from './elements/SectionHeader';
export { SkillBar } from './elements/SkillBar';
export { StatCard } from './elements/StatCard';
export { TechTag } from './elements/TechTag';
export { TimelineItem } from './elements/TimelineItem';
export { ResumePDFViewer } from './elements/ResumePDFViewer';

// Sections - Full Page Sections
export { About } from './sections/About';
export { Achievements } from './sections/Achievements';
export { Chatbot } from './sections/Chatbot';
export { default as ChatProcess } from './sections/ChatProcess';
export { Contact } from './sections/Contact';
export { Education } from './sections/Education';
export { Experience } from './sections/Experience';
export { Hero } from './sections/Hero';
export { Projects } from './sections/Projects';
export { Skills } from './sections/Skills';

// Generic Detail Sections (Reusable for any portfolio type)
export { DetailHeader } from './sections/DetailHeader';
export { ResultsGrid } from './sections/ResultsGrid';
export { AchievementsList } from './sections/AchievementsList';
export { TechStackDisplay } from './sections/TechStackDisplay';
export { ChallengeSolution } from './sections/ChallengeSolution';
export { RelatedItems } from './sections/RelatedItems';
export { Breadcrumb, CaseStudyBreadcrumb } from './sections/Breadcrumb';
export { FooterCTA, CaseStudyFooterCTA } from './sections/FooterCTA';

// Generic List Sections (Reusable for any portfolio collection)
export { ItemsHero, CaseStudiesHero } from './sections/ItemsHero';
export { ItemsGrid, CaseStudiesGrid } from './sections/ItemsGrid';
export { ItemsLoading, CaseStudiesLoading } from './sections/ItemsLoading';
export { ItemsCTA, CaseStudiesCTA } from './sections/ItemsCTA';

// Renderers - Helper functions for composing sections
export { 
  renderCaseStudyDetail, 
  CaseStudyDetailSections 
} from './renderers/case-studies';

// Layout - Layout Components
export { Navbar } from './layout/Navbar';
export { Footer } from './layout/Footer';

// Analytics - Analytics & Consent Components
export { 
  AnalyticsConsentBanner,
  AnalyticsWrapper 
} from './analytics';

// Language - Language & Translation Components & Hooks
export { LanguageSwitcher } from './language';
export { useCaseStudiesTranslation, type Language } from './language';

// PWA - Progressive Web App (Service Worker, Caching, Offline Support)
// ℹ️  PWA components and utilities are in @/pwa folder
// Import from: import { ServiceWorkerManager, useOnlineStatus, ... } from '@/pwa'
