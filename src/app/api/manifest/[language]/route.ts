import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/config/domains';

/**
 * Dynamic Web App Manifest Route
 * Generates language-specific manifest.json
 * 
 * Usage: GET /api/manifest/{language}
 * Example: GET /api/manifest/en
 *          → returns manifest.json with language-specific content
 */

interface ManifestConfig {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  scope: string;
  display: string;
  background_color: string;
  theme_color: string;
  orientation: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }>;
  screenshots?: Array<{
    src: string;
    sizes: string;
    type: string;
  }>;
  categories: string[];
  shortcuts?: Array<{
    name: string;
    short_name: string;
    description: string;
    url: string;
    icons: Array<{
      src: string;
      sizes: string;
      type: string;
    }>;
  }>;
}

// Language-specific manifest content
const MANIFEST_TEMPLATES: Record<string, Partial<ManifestConfig>> = {
  en: {
    name: 'Kuhandran Samudrapandiyan - Portfolio',
    short_name: 'Kuhandran',
    description: 'Full-stack developer and technical leader showcasing portfolio projects',
  },
  es: {
    name: 'Kuhandran Samudrapandiyan - Portafolio',
    short_name: 'Kuhandran',
    description: 'Desarrollador full-stack y líder técnico mostrando proyectos',
  },
  fr: {
    name: 'Kuhandran Samudrapandiyan - Portefeuille',
    short_name: 'Kuhandran',
    description: 'Développeur full-stack et leader technique présentant des projets',
  },
  de: {
    name: 'Kuhandran Samudrapandiyan - Portfolio',
    short_name: 'Kuhandran',
    description: 'Full-Stack-Entwickler und technischer Leiter mit Projektportfolio',
  },
  hi: {
    name: 'कुहंद्रन समुद्रपंडियन - पोर्टफोलियो',
    short_name: 'कुहंद्रन',
    description: 'फुल-स्टैक डेवलपर और तकनीकी नेता पोर्टफोलियो प्रदर्शन',
  },
  ta: {
    name: 'குஹந்திரன் சமுத்திரபண்டியன் - போர்ட்ஃபோலியோ',
    short_name: 'குஹந்திரன்',
    description: 'முழு அடுக்கு மேம்பாட்டாளர் மற்றும் தொழில்நுட்ப தலைவர்',
  },
  'ar-AE': {
    name: 'كوهاندران ساموذرابانديان - المحفظة',
    short_name: 'كوهاندران',
    description: 'مطور كامل المكدس وقائد تقني يعرض المشاريع',
  },
  id: {
    name: 'Kuhandran Samudrapandiyan - Portofolio',
    short_name: 'Kuhandran',
    description: 'Pengembang full-stack dan pemimpin teknis menampilkan proyek',
  },
  my: {
    name: 'Kuhandran Samudrapandiyan - Portfolio',
    short_name: 'Kuhandran',
    description: 'Full-stack အကျီခြင်း တည်ဆောက်သူ',
  },
  si: {
    name: 'Kuhandran Samudrapandiyan - පෝර්ට්ෆෝලියෝ',
    short_name: 'Kuhandran',
    description: 'සම්පූර්ණ ස්ටැක ඩිවෙලපර් සහ තාක්‍ෂණික නායක',
  },
  th: {
    name: 'Kuhandran Samudrapandiyan - พอร์ตโฟลิโอ',
    short_name: 'Kuhandran',
    description: 'นักพัฒนาแบบเต็มสแต็กและผู้นำทางเทคนิค',
  },
};

// Base manifest configuration (applies to all languages)
function getBaseManifest(language: string): ManifestConfig {
  // Validate language is in supported list
  const validLanguages = SUPPORTED_LANGUAGES as readonly string[];
  const normalizedLanguage = validLanguages.includes(language)
    ? language
    : DEFAULT_LANGUAGE;

  const template = MANIFEST_TEMPLATES[normalizedLanguage] || MANIFEST_TEMPLATES[DEFAULT_LANGUAGE];

  return {
    name: template.name || 'Kuhandran - Portfolio',
    short_name: template.short_name || 'Kuhandran',
    description:
      template.description ||
      'Full-stack developer and technical leader portfolio',
    start_url: `/?lang=${normalizedLanguage}`,
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/image/profile.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/image/profile.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['productivity', 'portfolio'],
    shortcuts: [
      {
        name: 'View Projects',
        short_name: 'Projects',
        description: 'View portfolio projects',
        url: `/?lang=${normalizedLanguage}#projects`,
        icons: [
          {
            src: '/logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
      {
        name: 'Contact',
        short_name: 'Contact',
        description: 'Send me a message',
        url: `/?lang=${normalizedLanguage}#contact`,
        icons: [
          {
            src: '/logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
    ],
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ language: string }> }
) {
  try {
    let language: string;
    try {
      ({ language } = await params);
    } catch (paramError) {
      console.error('[Manifest] GET: Failed to parse params', paramError);
      return NextResponse.json(
        { error: 'Failed to parse request parameters' },
        { status: 400 }
      );
    }

    // Validate language parameter
    if (!language || typeof language !== 'string') {
      console.error('[Manifest] GET: Missing or invalid language parameter');
      return NextResponse.json(
        { error: 'Missing or invalid language parameter' },
        { status: 400 }
      );
    }

    // Validate language is supported
    const validLanguages = SUPPORTED_LANGUAGES as readonly string[];
    if (!validLanguages.includes(language)) {
      console.warn('[Manifest] GET: Unsupported language requested', { language });
      // Don't fail - just return manifest for DEFAULT_LANGUAGE
    }

    console.log('[Manifest] GET: Generating manifest', { language });

    const manifest = getBaseManifest(language);

    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('[Manifest] GET: Unexpected error', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: 'Failed to generate manifest' },
      { status: 500 }
    );
  }
}
