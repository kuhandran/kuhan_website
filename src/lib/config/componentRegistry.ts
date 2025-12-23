/**
 * Dynamic Component Registry System
 * 
 * Centralizes all component imports and lazy loading
 * Enables automatic code-splitting for better performance
 * Allows runtime component registration and dynamic loading
 */

import { lazy, ComponentType as ReactComponentType } from 'react';
import { ComponentType } from '@/lib/config/types';

// ============================================
// COMPONENT REGISTRY TYPE
// ============================================

export interface ComponentRegistry {
  immediate: Record<ComponentType, ReactComponentType<any>>;
  lazy: Record<ComponentType, React.LazyExoticComponent<ReactComponentType<any>>>;
  register: (type: ComponentType, component: ReactComponentType<any>, useLazy?: boolean) => void;
  get: (type: ComponentType, useLazy?: boolean) => ReactComponentType<any> | null;
}

// ============================================
// IMPORT ALL COMPONENTS
// ============================================

// Reusable Elements (Immediate)
import { ProjectCard } from '@/components/elements/ProjectCard';
import { TimelineItem } from '@/components/elements/TimelineItem';
import { SkillBar } from '@/components/elements/SkillBar';
import { Badge } from '@/components/elements/Badge';
import { StatCard } from '@/components/elements/StatCard';
import { Card } from '@/components/elements/Card';
import { TechTag } from '@/components/elements/TechTag';
import { EducationCard } from '@/components/elements/EducationCard';
import { FormElement, FormButton } from '@/components/elements/FormElement';

// ============================================
// LAZY LOADED SECTIONS
// ============================================

// These are lazy-loaded for better initial page performance
const LazyHero = lazy(() => import('@/components/sections/Hero').then(m => ({ default: m.Hero })));
const LazyAbout = lazy(() => import('@/components/sections/About').then(m => ({ default: m.About })));

// Below-the-fold sections: deferred until viewport intersection
const LazyContact = lazy(() => import('@/components/sections/Contact').then(m => ({ default: m.Contact })));
const LazyChatbot = lazy(() => import('@/components/sections/Chatbot').then(m => ({ default: m.Chatbot })));
const LazySkills = lazy(() => import('@/components/sections/Skills').then(m => ({ default: m.Skills })));
const LazyProjects = lazy(() => import('@/components/sections/Projects').then(m => ({ default: m.Projects })));
const LazyExperience = lazy(() => import('@/components/sections/Experience').then(m => ({ default: m.Experience })));

// Heavy components: only loaded when needed
const LazyEducation = lazy(() => 
  import('@/components/sections/Education').then(m => ({ default: m.Education }))
);
const LazyAchievements = lazy(() => 
  import('@/components/sections/Achievements').then(m => ({ default: m.Achievements }))
);

// ============================================
// CREATE COMPONENT REGISTRY
// ============================================

/**
 * Global Component Registry
 * Used for dynamic component resolution at runtime
 */
export const createComponentRegistry = (): ComponentRegistry => {
  const immediateComponents: Record<ComponentType, ReactComponentType<any>> = {
    ProjectCard,
    TimelineItem,
    SkillBar,
    Badge,
    StatCard,
    Card,
    TechTag,
    EducationCard,
    AchievementCard: Card,
    FormInput: FormElement,
    FormButton: FormButton,
    FormSelect: FormElement,
    FormCheckbox: FormElement,
    FormRadio: FormElement,
    FormTextarea: FormElement,
  };

  const lazyComponents: Record<ComponentType, React.LazyExoticComponent<ReactComponentType<any>>> = {
    ProjectCard: lazy(() => Promise.resolve({ default: ProjectCard })),
    TimelineItem: lazy(() => Promise.resolve({ default: TimelineItem })),
    SkillBar: lazy(() => Promise.resolve({ default: SkillBar })),
    Badge: lazy(() => Promise.resolve({ default: Badge })),
    StatCard: lazy(() => Promise.resolve({ default: StatCard })),
    Card: lazy(() => Promise.resolve({ default: Card })),
    TechTag: lazy(() => Promise.resolve({ default: TechTag })),
    EducationCard: lazy(() => Promise.resolve({ default: EducationCard })),
    AchievementCard: lazy(() => Promise.resolve({ default: Card })),
    FormInput: lazy(() => Promise.resolve({ default: FormElement })),
    FormButton: lazy(() => Promise.resolve({ default: FormButton })),
    FormSelect: lazy(() => Promise.resolve({ default: FormElement })),
    FormCheckbox: lazy(() => Promise.resolve({ default: FormElement })),
    FormRadio: lazy(() => Promise.resolve({ default: FormElement })),
    FormTextarea: lazy(() => Promise.resolve({ default: FormElement })),
  };

  return {
    immediate: immediateComponents,
    lazy: lazyComponents,
    
    /**
     * Register a new component dynamically
     */
    register: (type: ComponentType, component: ReactComponentType<any>, useLazy = false) => {
      if (useLazy) {
        lazyComponents[type] = lazy(() => Promise.resolve({ default: component }));
      } else {
        immediateComponents[type] = component;
      }
    },

    /**
     * Get a component by type
     */
    get: (type: ComponentType, useLazy = false) => {
      return useLazy ? lazyComponents[type] || null : immediateComponents[type] || null;
    },
  };
};

// ============================================
// SINGLETON REGISTRY INSTANCE
// ============================================

export const componentRegistry = createComponentRegistry();

/**
 * Section Component Registry
 * Maps section types to lazy-loaded section components
 */
export const sectionRegistry: Record<string, React.LazyExoticComponent<ReactComponentType<any>>> = {
  Hero: LazyHero,
  About: LazyAbout,
  Contact: LazyContact,
  Custom: LazyChatbot,
  Chatbot: LazyChatbot,
  Skills: LazySkills,
  Projects: LazyProjects,
  Experience: LazyExperience,
  Education: LazyEducation,
  Achievements: LazyAchievements,
};

/**
 * Get section component by type
 */
export const getSectionComponent = (type: string): React.LazyExoticComponent<ReactComponentType<any>> | null => {
  return sectionRegistry[type] || null;
};

/**
 * Get element component by type
 */
export const getElementComponent = (type: ComponentType, useLazy = false): ReactComponentType<any> | null => {
  return componentRegistry.get(type, useLazy);
};
