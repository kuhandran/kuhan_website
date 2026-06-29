'use client';

import React, { Suspense, lazy } from 'react';
import { PageLayoutConfig, SectionConfig } from '@/lib/config/types';
import { SectionRenderer } from './SectionRenderer';
import { CustomSectionRenderer } from './CustomSectionRenderer';

const LazySiteTechStack = lazy(() =>
  import('@/components/sections/SiteTechStack').then(m => ({ default: m.SiteTechStack }))
);

interface PageRendererProps {
  config: PageLayoutConfig;
}

export const PageRenderer: React.FC<PageRendererProps> = ({ config }) => {
  let techStackInserted = false;

  const renderSection = (section: SectionConfig, index: number) => {
    const isContact = section.type?.toLowerCase() === 'contact' || section.id?.toLowerCase() === 'contact';
    const nodes: React.ReactNode[] = [];

    // Inject SiteTechStack once, immediately before the Contact section
    if (isContact && !techStackInserted) {
      techStackInserted = true;
      nodes.push(
        <Suspense key="site-tech-stack" fallback={<div className="w-full h-64 bg-slate-950 animate-pulse" />}>
          <LazySiteTechStack />
        </Suspense>
      );
    }

    if (section.custom?.renderAsCustom) {
      nodes.push(<CustomSectionRenderer key={section.id || index} config={section} />);
    } else {
      nodes.push(<SectionRenderer key={section.id || index} config={section} />);
    }

    return nodes;
  };

  return (
    <>
      {config.sections.map((section, index) => renderSection(section, index))}
    </>
  );
};
