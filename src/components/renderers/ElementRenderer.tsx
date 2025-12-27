'use client';

import React, { Suspense, lazy } from 'react';
import { ElementConfig, ComponentType } from '@/lib/config/types';
import { getErrorMessageSync } from '@/lib/config/appConfig';

// Import all reusable elements
import { ProjectCard } from '@/components/elements/ProjectCard';
import { TimelineItem } from '@/components/elements/TimelineItem';
import { SkillBar } from '@/components/elements/SkillBar';
import { Badge } from '@/components/elements/Badge';
import { StatCard } from '@/components/elements/StatCard';
import { Card } from '@/components/elements/Card';
import { TechTag } from '@/components/elements/TechTag';
import { EducationCard } from '@/components/elements/EducationCard';
import { FormElement, FormButton } from '@/components/elements/FormElement';

/**
 * Lazy load components for better performance
 * Components are code-split and loaded on demand
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lazyComponentMap: Record<string, React.LazyExoticComponent<any>> = {
  ProjectCard: lazy(() => Promise.resolve({ default: ProjectCard })),
  TimelineItem: lazy(() => Promise.resolve({ default: TimelineItem })),
  SkillBar: lazy(() => Promise.resolve({ default: SkillBar })),
  Badge: lazy(() => Promise.resolve({ default: Badge })),
  StatCard: lazy(() => Promise.resolve({ default: StatCard })),
  Card: lazy(() => Promise.resolve({ default: Card })),
  TechTag: lazy(() => Promise.resolve({ default: TechTag })),
  EducationCard: lazy(() => Promise.resolve({ default: EducationCard })),
};

/**
 * Synchronous component map for immediate rendering
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: Record<ComponentType, any> = {
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

/**
 * Loading fallback component
 */
const ElementLoadingFallback: React.FC = () => (
  <div className="animate-pulse bg-gray-200 rounded h-12 w-full" />
);

interface ElementRendererProps {
  config: ElementConfig;
  useLazyLoad?: boolean;
  suspenseFallback?: React.ReactNode;
}

/**
 * Generic Element Renderer with Lazy Loading Support
 * Dynamically renders any component based on configuration
 * Supports both immediate and lazy-loaded rendering
 */
export const ElementRenderer: React.FC<ElementRendererProps> = ({ 
  config, 
  useLazyLoad = false,
  suspenseFallback = <ElementLoadingFallback />,
}) => {
  const { type, props, key } = config;

  const Component = componentMap[type as ComponentType];

  if (!Component) {
    console.warn(getErrorMessageSync('warnings.componentNotFound', `Component type \"${type}\" not found in componentMap`));
    return null;
  }

  const element = <Component key={key} {...props} />;

  // Use lazy loading for non-critical elements
  if (useLazyLoad && lazyComponentMap[type]) {
    const LazyComponent = lazyComponentMap[type];
    return (
      <Suspense fallback={suspenseFallback}>
        <LazyComponent key={key} {...props} />
      </Suspense>
    );
  }

  return element;
};

/**
 * Batch Element Renderer
 * Renders multiple elements from configuration array
 */
interface BatchElementRendererProps {
  elements: ElementConfig[];
  containerClassName?: string;
  useLazyLoad?: boolean;
  suspenseFallback?: React.ReactNode;
}

export const BatchElementRenderer: React.FC<BatchElementRendererProps> = ({
  elements,
  containerClassName = 'grid gap-8',
  useLazyLoad = false,
  suspenseFallback = <ElementLoadingFallback />,
}) => {
  return (
    <div className={containerClassName}>
      {elements.map((element, index) => (
        <ElementRenderer 
          key={element.key || index} 
          config={element}
          useLazyLoad={useLazyLoad}
          suspenseFallback={suspenseFallback}
        />
      ))}
    </div>
  );
};
