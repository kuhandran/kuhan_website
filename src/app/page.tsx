'use client';

import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { PageRenderer } from '../components/renderers/PageRenderer';
import { getPageLayoutConfig } from '@/lib/config/pageLayout';
import { initializeContentLabels } from '@/lib/data/contentLabels';
import { fetchPageLayout } from '@/lib/config/configLoader';
import { useEffect, useState } from 'react';

/**
 * Home Page
 * JSON-driven layout that renders sections based on configuration
 * Easily reorder, add, or modify sections by editing getPageLayoutConfig
 */
export default function Home() {
  const [pageLayoutConfig, setPageLayoutConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Initialize content labels and page layout from CDN on page load
        await Promise.all([initializeContentLabels(), fetchPageLayout()]);
        const config = await getPageLayoutConfig();
        setPageLayoutConfig(config);
      } catch (error) {
        console.error('Error loading page data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  if (isLoading || !pageLayoutConfig) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Loading...</h1>
            <p className="text-slate-600">Please wait while we load your content.</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <PageRenderer config={pageLayoutConfig} />
      <Footer />
    </main>
  );
}