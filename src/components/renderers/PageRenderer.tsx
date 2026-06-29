'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { PageLayoutConfig, SectionConfig } from '@/lib/config/types';
import { SectionRenderer } from './SectionRenderer';
import { CustomSectionRenderer } from './CustomSectionRenderer';

const LazySiteTechStack = dynamic(
  () => import('@/components/sections/SiteTechStack').then(m => ({ default: m.SiteTechStack })),
  {
    ssr: false,
    loading: () => <div className="w-full h-64 bg-slate-950 animate-pulse" />,
  }
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
      nodes.push(<LazySiteTechStack key="site-tech-stack" />);
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
