'use client';

import React, { Suspense } from 'react';
import { SectionConfig } from '@/lib/config/types';
import { sectionRegistry } from '@/lib/config/componentRegistry';
import { getErrorMessageSync } from '@/lib/config/appConfig';

/**
 * Loading fallback component
 */
const SectionLoadingFallback: React.FC = () => (
  <div className="w-full h-64 bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse rounded-lg" />
);

/**
 * Error boundary for section loading
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SectionErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(getErrorMessageSync('errors.sectionRendering', 'Section rendering error:'), error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-semibold">Failed to load section</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

/**
 * Props for custom section renderer
 */
interface CustomSectionRendererProps {
  config: SectionConfig;
  useLazyLoad?: boolean;
}

/**
 * Custom Section Renderer with Dynamic Lazy Loading
 * 
 * Renders complex sections (Hero, About, Contact, Chatbot, etc.)
 * Uses lazy loading for better initial performance
 * Supports error boundaries for graceful error handling
 * 
 * Features:
 * - Dynamic component resolution based on section type
 * - Lazy loading with Suspense
 * - Error boundary for safe rendering
 * - Customizable loading states
 * - Below-the-fold sections deferred until viewport intersection
 */
export const CustomSectionRenderer: React.FC<CustomSectionRendererProps> = ({
  config,
  useLazyLoad = true,
}) => {
  const { id, type } = config;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  // Intersection Observer for below-the-fold sections
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '50px' } // Start loading 50px before entering viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // List of sections that should be deferred until visible (below-the-fold)
  // Only Hero, About, and Skills initially - others load on demand to eliminate CLS
  const deferredSections = ['skills', 'projects', 'experience', 'achievements', 'education', 'contact', 'chatbot'];
  const shouldDefer = deferredSections.includes(type.toLowerCase());

  // If section should be deferred and not yet visible, show placeholder
  if (shouldDefer && !isVisible) {
    return <div ref={containerRef} className="w-full h-32" />;
  }

  // Get the component from registry
  const SectionComponent = sectionRegistry[type];

  if (!SectionComponent) {
    console.warn(getErrorMessageSync('warnings.sectionNotFound', `Section type \"${type}\" not found in section registry`));
    return null;
  }

  // If lazy loading is enabled, wrap with Suspense
  if (useLazyLoad) {
    return (
      <div ref={containerRef}>
        <SectionErrorBoundary>
          <Suspense fallback={<SectionLoadingFallback />}>
            <SectionComponent />
          </Suspense>
        </SectionErrorBoundary>
      </div>
    );
  }

  // Immediate rendering without lazy loading
  return (
    <div ref={containerRef}>
      <SectionErrorBoundary>
        <SectionComponent />
      </SectionErrorBoundary>
    </div>
  );
};

/**
 * Batch Custom Section Renderer
 * Renders multiple custom sections with optional lazy loading
 */
interface BatchCustomSectionRendererProps {
  configs: SectionConfig[];
  useLazyLoad?: boolean;
}

export const BatchCustomSectionRenderer: React.FC<BatchCustomSectionRendererProps> = ({
  configs,
  useLazyLoad = true,
}) => {
  return (
    <>
      {configs.map((config, index) => (
        <CustomSectionRenderer
          key={config.id || index}
          config={config}
          useLazyLoad={useLazyLoad}
        />
      ))}
    </>
  );
};
