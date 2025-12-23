'use client';

import React from 'react';
import { PageLayoutConfig, SectionConfig } from '@/lib/config/types';
import { SectionRenderer } from './SectionRenderer';
import { CustomSectionRenderer } from './CustomSectionRenderer';

interface PageRendererProps {
  config: PageLayoutConfig;
}

/**
 * Main Page Renderer
 * Routes sections to appropriate renderer based on whether they're custom or JSON-driven
 */
export const PageRenderer: React.FC<PageRendererProps> = ({ config }) => {
  const renderSection = (section: SectionConfig, index: number) => {
    // Check if section should be rendered as custom
    if (section.custom?.renderAsCustom) {
      return <CustomSectionRenderer key={section.id || index} config={section} />;
    }

    // Render as JSON-driven section
    return <SectionRenderer key={section.id || index} config={section} />;
  };

  return (
    <>
      {config.sections.map((section, index) => renderSection(section, index))}
    </>
  );
};
