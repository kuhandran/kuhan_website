import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import './critical.css';
import './globals.css';

// Lazy load Analytics - deferred until after initial render
const AnalyticsWrapper = dynamic(
  () => import('../components/AnalyticsWrapper'),
  { loading: () => null }
);

// Lazy load Analytics Consent Banner
const AnalyticsConsentBanner = dynamic(
  () => import('../components/AnalyticsConsentBanner').then(mod => ({ default: mod.AnalyticsConsentBanner })),
  { loading: () => null }
);

export const metadata: Metadata = {
  title: 'Kuhandran SamudraPandiyan | Technical Delivery Manager | FWD Malaysia | Maybank | TDM Malaysia',
  description: 'Technical Delivery Manager & Full-Stack Engineer with 8+ years experience at FWD Insurance Malaysia, Maybank, and leading tech companies. Expertise in React Native, React.js, Power BI, microservices, and enterprise banking solutions. INTI International University & UOW Malaysia alumnus.',
  keywords: 'Kuhandran SamudraPandiyan, Technical Delivery Manager, TDM Malaysia, Full-Stack Engineer, React Native developer, React.js expert, Power BI specialist, Data Visualization, FWD Insurance, FWD Malaysia, FWD Technology and Innovation Malaysia Sdn. Bhd, Maybank, Maybank Tech, Maybank Shared Services, Banking solutions, Enterprise applications, Software Engineer Malaysia, INTI International University, INTI Alumni, UOW Malaysia, UOW Australia, Kuala Lumpur, Microservices architecture, Project Management, Cross-functional Teams, Agile methodologies',
  authors: [{ name: 'Kuhandran SamudraPandiyan', url: 'https://www.kuhandranchatbot.info' }],
  openGraph: {
    title: 'Kuhandran SamudraPandiyan | Technical Delivery Manager & Full-Stack Engineer',
    description: 'Technical Delivery Manager & Full-Stack Engineer with 8+ years experience in enterprise applications, React Native, and banking solutions.',
    type: 'website',
    url: 'https://www.kuhandranchatbot.info',
    siteName: 'Kuhandran SamudraPandiyan',
    locale: 'en_MY',
    images: [
      {
        url: 'https://static.kuhandranchatbot.info/image/profile.webp',
        width: 400,
        height: 400,
        alt: 'Kuhandran SamudraPandiyan Profile',
        type: 'image/webp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kuhandran SamudraPandiyan | Technical Delivery Manager',
    description: 'Full-Stack Engineer & Technical Leader | 8+ years in enterprise applications',
    images: ['https://static.kuhandranchatbot.info/image/profile.webp'],
    creator: '@kuhan_samudra',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: 'https://www.kuhandranchatbot.info',
  },
  referrer: 'strict-origin-when-cross-origin',
  category: 'technology',
  metadataBase: new URL('https://www.kuhandranchatbot.info'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.svg', type: 'image/svg+xml' }
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Kuhandran SamudraPandiyan',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* DNS Prefetch and Preconnect for external services */}
        <link rel="dns-prefetch" href="https://static.kuhandranchatbot.info" />
        <link rel="preconnect" href="https://static.kuhandranchatbot.info" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://resume-chatbot-services-v2-0.onrender.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api-gateway-715i.onrender.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api-gateway-9unh.onrender.com" crossOrigin="anonymous" />
        
        {/* Favicon and Web App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Mobile Web App Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Kuhandran" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Security and trust meta tags for Zscaler and SEO */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://static.kuhandranchatbot.info https://resume-chatbot-services-v2-0.onrender.com https://www.google.com https://www.gstatic.com https://api-gateway-715i.onrender.com https://api-gateway-9unh.onrender.com https://ipapi.co; frame-src 'self' https://static.kuhandranchatbot.info https://www.google.com https://www.gstatic.com;" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, noimageindex:off, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="Kuhandran SamudraPandiyan" />
        <meta name="category" content="technology" />
        <meta name="application-name" content="Kuhandran SamudraPandiyan Portfolio" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="canonical" href="https://www.kuhandranchatbot.info" />
        
        {/* JSON-LD Schema for better search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Kuhandran SamudraPandiyan",
              "url": "https://www.kuhandranchatbot.info",
              "image": "https://static.kuhandranchatbot.info/image/profile.webp",
              "jobTitle": "Technical Delivery Manager",
              "worksFor": [
                {
                  "@type": "Organization",
                  "name": "FWD Insurance",
                  "url": "https://www.fwd.com",
                  "alternateName": ["FWD Malaysia", "FWD Technology and Innovation Malaysia Sdn. Bhd"]
                },
                {
                  "@type": "Organization",
                  "name": "Maybank",
                  "url": "https://www.maybank.com",
                  "alternateName": ["Maybank Tech", "Maybank Shared Services"]
                }
              ],
              "sameAs": [
                "https://www.linkedin.com/in/kuhandran-samudrapandiyan/",
                "https://instagram.com/kuhan_samudra"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Kuala Lumpur",
                "addressRegion": "Malaysia",
                "addressCountry": "MY"
              },
              "alumniOf": [
                {
                  "@type": "Organization",
                  "name": "INTI International University",
                  "url": "https://www.newinti.edu.my",
                  "alternateName": ["INTI Alumni", "INTI International"]
                },
                {
                  "@type": "Organization",
                  "name": "University of Wollongong Malaysia",
                  "url": "https://www.uow.edu.au",
                  "alternateName": ["UOW Malaysia", "UOW Australia"]
                }
              ],
              "description": "Technical Delivery Manager and Full-Stack Engineer with 8+ years of experience in enterprise applications, React Native development, and banking/insurance solutions. Experienced with Maybank, FWD Insurance Malaysia, and other leading technology companies.",
              "knowsAbout": [
                "React Native",
                "React.js",
                "Power BI",
                "Data Visualization",
                "Full-Stack Development",
                "Microservices",
                "Enterprise Applications",
                "Banking Solutions",
                "Project Management",
                "Agile Methodologies",
                "Cross-functional Teams",
                "RESTful APIs",
                "Spring Boot",
                "TypeScript"
              ]
            })
          }}
        />
        <link rel="sitemap" href="https://www.kuhandranchatbot.info/sitemap.xml" />
      </head>
      <body>
        {children}
        <AnalyticsWrapper />
        <AnalyticsConsentBanner />
      </body>
    </html>
  );
}