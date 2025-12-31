'use client';

import React from 'react';
import { CaseStudy } from '@/lib/data/caseStudies';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CaseStudyDetailSections } from '@/components/renderers/case-studies';
import { RelatedItems } from '@/components/sections/RelatedItems';
import { CaseStudyBreadcrumb } from '@/components/sections/Breadcrumb';
import { CaseStudyFooterCTA } from '@/components/sections/FooterCTA';

interface CaseStudyDetailPageProps {
  initialCaseStudy: CaseStudy;
  initialRelatedStudies: CaseStudy[];
  slug: string;
}

export default function CaseStudyDetailPage({
  initialCaseStudy,
  initialRelatedStudies,
}: CaseStudyDetailPageProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!initialCaseStudy) {
    return null;
  }

  return (
    <main>
      <Navbar />
      <CaseStudyBreadcrumb />
      <CaseStudyDetailSections caseStudy={initialCaseStudy} onScrollToSection={scrollToSection} />
      <RelatedItems
        title="Related Case Studies"
        items={initialRelatedStudies}
        itemType="caseStudy"
      />
      <CaseStudyFooterCTA />
      <Footer />
    </main>
  );
}
