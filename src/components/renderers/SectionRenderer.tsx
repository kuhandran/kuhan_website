'use client';

import React, { Suspense, lazy } from 'react';
import { SectionConfig } from '@/lib/config/types';
import { SectionHeader } from '@/components/elements/SectionHeader';
import { BatchElementRenderer } from './ElementRenderer';

interface SectionRendererProps {
  config: SectionConfig;
  useLazyLoad?: boolean;
}

/**
 * Lazy load SectionHeader for better performance
 */
const LazySectionHeader = lazy(() => 
  Promise.resolve({ default: SectionHeader })
);

/**
 * Loading fallback for section header
 */
const SectionHeaderLoadingFallback: React.FC = () => (
  <div className="space-y-4 mb-16">
    <div className="animate-pulse bg-gray-200 rounded h-6 w-32" />
    <div className="animate-pulse bg-gray-200 rounded h-8 w-64" />
    <div className="animate-pulse bg-gray-200 rounded h-5 w-96" />
  </div>
);

/**
 * Convert data to element configs based on section type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getElementsFromData = (
  sectionType: string,
  data: any[],
): any[] => {
  return data.map((item, index) => {
    switch (sectionType) {
      case 'Projects':
        return {
          type: 'ProjectCard',
          props: {
            title: item.title,
            description: item.description,
            image: item.image,
            techStack: item.techStack,
            metrics: item.metrics,
            liveUrl: item.liveUrl,
            githubUrl: item.githubUrl,
          },
          key: `project-${index}`,
        };
      case 'Experience':
        return {
          type: 'TimelineItem',
          props: {
            title: item.title,
            company: item.company,
            duration: item.duration,
            location: item.location,
            description: item.description,
            techStack: item.techStack,
            logo: item.logo,
            isLeft: index % 2 === 0,
          },
          key: `experience-${index}`,
        };
      case 'Achievements':
        return {
          type: 'StatCard',
          props: {
            icon: item.icon,
            label: item.name || item.title,
            value: item.year || item.date,
          },
          key: `achievement-${index}`,
        };
      case 'Education':
        return {
          type: 'EducationCard',
          props: {
            education: item,
          },
          key: `education-${index}`,
        };
      default:
        return {
          type: 'Card',
          props: { children: JSON.stringify(item) },
          key: `item-${index}`,
        };
    }
  });
};

/**
 * Generic Section Renderer with Lazy Loading Support
 * Dynamically renders any section based on configuration
 * Supports different layouts: grid, list, flex, single
 * Can lazy load section headers for better initial load performance
 */
export const SectionRenderer: React.FC<SectionRendererProps> = ({ 
  config,
  useLazyLoad = false,
}) => {
  const {
    id,
    type,
    header,
    backgroundColor = 'bg-white',
    className = '',
    layout = 'grid',
    gridCols = 'md:grid-cols-2 lg:grid-cols-3',
    elements = [],
    data,
    elementRenderer,
    custom = {},
  } = config;

  /**
   * Safely ensure data is an array
   */
  const safeData = Array.isArray(data) ? data : [];

  /**
   * Convert data array to element configs
   */
  const renderedElements = elementRenderer
    ? safeData.map((item, index) => elementRenderer(item, index))
    : safeData.length > 0
      ? getElementsFromData(type, safeData)
      : elements;

  /**
   * Get container class based on layout type
   */
  const getLayoutClass = (): string => {
    const baseClass = 'container mx-auto px-4';
    switch (layout) {
      case 'grid':
        return `${baseClass} grid ${gridCols} gap-8 max-w-7xl`;
      case 'list':
        return `${baseClass} space-y-8 max-w-4xl`;
      case 'flex':
        return `${baseClass} flex flex-wrap gap-4 justify-center`;
      case 'single':
        return `${baseClass} max-w-4xl`;
      case 'custom':
        return baseClass;
      default:
        return baseClass;
    }
  };

  return (
    <section
      id={id}
      className={`py-20 ${backgroundColor} ${className}`}
      data-section-type={type}
    >
      {header && (
        <div className="container mx-auto px-4 mb-16">
          {useLazyLoad ? (
            <Suspense fallback={<SectionHeaderLoadingFallback />}>
              <LazySectionHeader
                subtitle={header.subtitle || ''}
                title={header.title || ''}
                description={header.description || ''}
              />
            </Suspense>
          ) : (
            <SectionHeader
              subtitle={header.subtitle || ''}
              title={header.title || ''}
              description={header.description || ''}
            />
          )}
        </div>
      )}

      <div className={getLayoutClass()}>
        <BatchElementRenderer 
          elements={renderedElements}
          useLazyLoad={useLazyLoad}
        />
      </div>

      {/* Custom content slot if needed */}
      {custom.children && <div>{custom.children}</div>}
    </section>
  );
};

/**
 * Batch Section Renderer
 * Renders multiple sections from configuration array
 */
interface BatchSectionRendererProps {
  sections: SectionConfig[];
  useLazyLoad?: boolean;
}

export const BatchSectionRenderer: React.FC<BatchSectionRendererProps> = ({
  sections,
  useLazyLoad = false,
}) => {
  return (
    <>
      {sections.map((section, index) => (
        <SectionRenderer 
          key={section.id || index} 
          config={section}
          useLazyLoad={useLazyLoad}
        />
      ))}
    </>
  );
};
