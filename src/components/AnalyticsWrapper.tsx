"use client";

import { Analytics } from '@vercel/analytics/react';
import { useVisitorAnalytics } from '@/lib/hooks/useVisitorAnalytics';

export default function AnalyticsWrapper() {
  // Track visitor analytics (location, language, browser)
  useVisitorAnalytics();

  return <Analytics />;
}
