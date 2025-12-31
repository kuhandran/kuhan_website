import React from 'react';
import { getCaseStudyBySlug, getRelatedCaseStudies, CaseStudy } from '@/lib/data/caseStudies';
import CaseStudyDetailPage from './CaseStudyDetailPage';
import { notFound } from 'next/navigation';

interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  
  // Load data on the server
  const caseStudy = await getCaseStudyBySlug(slug);
  if (!caseStudy) {
    notFound();
  }
  
  const relatedStudies = await getRelatedCaseStudies(slug);

  // Pass data to client component
  return <CaseStudyDetailPage initialCaseStudy={caseStudy} initialRelatedStudies={relatedStudies} slug={slug} />;
}
