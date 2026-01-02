import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { PageRenderer } from '../components/renderers/PageRenderer';
import { getPageLayoutConfig } from '@/lib/config/pageLayout';
import { initializeContentLabels } from '@/lib/data/contentLabels';
import { PageLayoutConfig } from '@/lib/config/types';

/**
 * Home Page - Server-Side Rendered
 * Fetches all data on server from static API
 * Sends fully rendered HTML to client (no loading state)
 * Client only handles interactivity (language switching, form submission, etc.)
 * 
 * Benefits:
 * - Faster First Contentful Paint (FCP)
 * - Better SEO (full HTML available)
 * - No waterfall requests (parallel server fetches)
 * - Progressive enhancement (works without JS)
 */
export default async function Home() {
  try {
    // Initialize content labels and fetch page layout in parallel on server
    // This happens before HTML is sent to client
    const [_, pageLayoutConfig] = await Promise.all([
      initializeContentLabels(),
      getPageLayoutConfig(),
    ]);

    // If no config, show error state
    if (!pageLayoutConfig || !pageLayoutConfig.sections || pageLayoutConfig.sections.length === 0) {
      return (
        <main>
          <Navbar />
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Page Configuration Not Found</h1>
              <p className="text-slate-600">The page layout could not be loaded from the API.</p>
            </div>
          </div>
          <Footer />
        </main>
      );
    }

    // Render complete page on server
    return (
      <main>
        <Navbar />
        <PageRenderer config={pageLayoutConfig} />
        <Footer />
      </main>
    );
  } catch (error) {
    console.error('[Page] Error rendering home page:', error);
    
    // Error fallback
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Error Loading Page</h1>
            <p className="text-slate-600">Please try refreshing the page.</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }
}