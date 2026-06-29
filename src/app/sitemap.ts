import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.kuhandranchatbot.info';

// Section anchors that should be discoverable as named destinations
const SECTION_ANCHORS = [
  { id: 'about',        priority: 0.9, freq: 'monthly'  as const },
  { id: 'experience',   priority: 0.9, freq: 'monthly'  as const },
  { id: 'skills',       priority: 0.8, freq: 'monthly'  as const },
  { id: 'projects',     priority: 0.8, freq: 'monthly'  as const },
  { id: 'achievements', priority: 0.8, freq: 'monthly'  as const },
  { id: 'contact',      priority: 0.7, freq: 'yearly'   as const },
];

// hreflang regions — matching layout.tsx alternates
const LANG_REGIONS = ['en-AU', 'en-GB', 'en-US', 'en-NZ', 'en-DE', 'en-NL', 'en-SG', 'en-MY', 'en-AE', 'en-CA'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    // ── Primary pages ────────────────────────────────────────────
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/case-studies`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // ── Section anchor URLs (helps crawlers map page structure) ──
    ...SECTION_ANCHORS.map(s => ({
      url: `${BASE_URL}/#${s.id}`,
      lastModified: now,
      changeFrequency: s.freq,
      priority: s.priority,
    })),

    // ── hreflang regional variants ───────────────────────────────
    ...LANG_REGIONS.map(lang => ({
      url: `${BASE_URL}/?hl=${lang.toLowerCase()}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),

    // ── Static assets crawlers should discover ───────────────────
    {
      url: 'https://static.kuhandranchatbot.info/public/resume/resume.pdf',
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];

  return entries;
}
