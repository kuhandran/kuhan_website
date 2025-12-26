import { useEffect } from 'react';
import { collectVisitorAnalytics, sendVisitorAnalytics } from '@/lib/analytics/visitorAnalytics';

/**
 * Hook to collect and send visitor analytics
 * Only works if user has accepted analytics consent
 */
export function useVisitorAnalytics() {
  useEffect(() => {
    // Check for analytics consent
    const hasConsent = document.cookie
      .split('; ')
      .find((row) => row.startsWith('analytics-consent='))
      ?.split('=')[1] === 'true';

    if (!hasConsent) {
      console.log('Analytics: User consent not provided');
      return;
    }

    // Collect and send analytics
    const trackVisitor = async () => {
      try {
        const visitorData = await collectVisitorAnalytics();
        await sendVisitorAnalytics(visitorData);
        console.log('✅ Analytics tracked:', visitorData);
      } catch (error) {
        console.error('Analytics error:', error);
      }
    };

    // Delay tracking slightly to not impact page load
    const timer = setTimeout(trackVisitor, 1000);

    return () => clearTimeout(timer);
  }, []);
}
