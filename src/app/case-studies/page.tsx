'use client';

import React, { useEffect, useState } from 'react';
import { getAllCaseStudies, CaseStudy } from '@/lib/data/caseStudies';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  ItemsHero, 
  ItemsLoading, 
  ItemsGrid, 
  ItemsCTA 
} from '@/components/sections';
import { useCaseStudiesTranslation } from '@/components/language';
import { useRouter } from 'next/navigation';

export default function CaseStudiesPage() {
  const { isLoading: isTranslationsLoading } = useCaseStudiesTranslation();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const studies = await getAllCaseStudies();
        setCaseStudies(studies);
      } catch (error) {
        console.error('Error loading case studies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Show loading state
  if (isLoading || isTranslationsLoading) {
    return (
      <>
        <Navbar />
        <ItemsLoading count={6} />
        <Footer />
      </>
    );
  }

  // Main content
  return (
    <>
      <Navbar />
      <ItemsHero 
        title="Case Studies" 
        subtitle="Our Work"
        description="Explore our successful projects and see how we help businesses achieve their goals."
      />
      <ItemsGrid 
        items={caseStudies} 
        onItemClick={(slug) => router.push(`/case-studies/${slug}`)}
      />
      <ItemsCTA 
        title="Have a project in mind?"
        description="Let's work together to bring your ideas to life."
        buttonText="Start a Project"
        buttonHref="/#contact"
      />
      <Footer />
    </>
  );
}
