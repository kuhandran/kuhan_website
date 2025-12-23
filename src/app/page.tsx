import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { PageRenderer } from '../components/renderers/PageRenderer';
import { getPageLayoutConfig } from '@/lib/config/pageLayout';

/**
 * Home Page
 * JSON-driven layout that renders sections based on configuration
 * Easily reorder, add, or modify sections by editing getPageLayoutConfig
 */
export default function Home() {
  const pageLayoutConfig = getPageLayoutConfig();
  
  return (
    <main>
      <Navbar />
      <PageRenderer config={pageLayoutConfig} />
      <Footer />
    </main>
  );
}