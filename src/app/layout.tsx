import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { LanguageProvider } from "@/lib/hooks/useLanguageHook";
import { ReadingProgress } from "@/components/elements/ReadingProgress";
import { GA4Provider } from "@/components/analytics/GA4Provider";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";
import { getManifestUrl, DEFAULT_LANGUAGE } from "@/lib/config/domains";
import { ServiceWorkerManager } from "@/pwa";
import "@/styles/critical.css";
import "@/styles/globals.css";

// Lazy load Cloudflare Web Analytics beacon — deferred until after initial render
const AnalyticsWrapper = dynamic(
  () => import("../components/analytics/AnalyticsWrapper"),
  { loading: () => null },
);

// Lazy load consent banner — shown only when no prior choice is stored
const AnalyticsConsentBanner = dynamic(
  () =>
    import("../components/analytics/AnalyticsConsentBanner").then((m) => ({
      default: m.AnalyticsConsentBanner,
    })),
  { loading: () => null },
);

export const metadata: Metadata = {
  title:
    "Kuhandran SamudraPandiyan | Technical Delivery Manager & Full-Stack Engineer",
  description:
    "Technical Delivery Manager and Full-Stack Engineer with 8+ years delivering enterprise-grade software. Expertise in React, Power BI, microservices, and data visualization for banking and insurance clients.",
  keywords:
    "Kuhandran SamudraPandiyan, Technical Delivery Manager, TDM Malaysia, Full-Stack Engineer, React Native developer, React.js expert, Power BI specialist, Data Visualization, FWD Insurance, FWD Malaysia, FWD Technology and Innovation Malaysia Sdn. Bhd, Maybank, Maybank Tech, Maybank Shared Services, Banking solutions, Enterprise applications, Software Engineer Malaysia, INTI International University, INTI Alumni, UOW Malaysia, UOW Australia, Kuala Lumpur, Microservices architecture, Project Management, Cross-functional Teams, Agile methodologies",
  authors: [
    {
      name: "Kuhandran SamudraPandiyan",
      url: "https://www.kuhandranchatbot.info",
    },
  ],
  openGraph: {
    title:
      "Kuhandran SamudraPandiyan | Technical Delivery Manager & Full-Stack Engineer",
    description:
      "Technical Delivery Manager & Full-Stack Engineer with 8+ years experience in enterprise applications, React Native, and banking solutions.",
    type: "website",
    url: "https://www.kuhandranchatbot.info",
    siteName: "Kuhandran SamudraPandiyan",
    locale: "en_MY",
    images: [
      {
        url: "/image/profile.png",
        width: 400,
        height: 400,
        alt: "Kuhandran SamudraPandiyan Profile",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kuhandran SamudraPandiyan | Technical Delivery Manager",
    description:
      "Full-Stack Engineer & Technical Leader | 8+ years in enterprise applications",
    images: ["/image/profile.png"],
    creator: "@kuhan_samudra",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://www.kuhandranchatbot.info",
  },
  referrer: "strict-origin-when-cross-origin",
  category: "technology",
  metadataBase: new URL("https://www.kuhandranchatbot.info"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/files/apple-touch-icon.svg", type: "image/svg+xml" }],
  },
  manifest: getManifestUrl(DEFAULT_LANGUAGE),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kuhandran SamudraPandiyan",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* DNS Prefetch and Preconnect for external services */}
        <link rel="dns-prefetch" href="https://static.kuhandranchatbot.info" />
        <link
          rel="preconnect"
          href="https://static.kuhandranchatbot.info"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://auth-services.kuhandranchatbot.info"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://resume-chatbot-services-v2-0.onrender.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://api-gateway-715i.onrender.com"
          crossOrigin="anonymous"
        />
        {/* Favicon and Web App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link
          rel="apple-touch-icon"
          href="/files/apple-touch-icon.svg"
          type="image/svg+xml"
        />
        <link rel="manifest" href={getManifestUrl(DEFAULT_LANGUAGE)} />

        {/* Mobile Web App Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Kuhandran" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Security meta tags */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="googlebot"
          content="index, follow, noimageindex:off, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta name="author" content="Kuhandran SamudraPandiyan" />
        <meta name="category" content="technology" />
        <meta
          name="application-name"
          content="Kuhandran SamudraPandiyan Portfolio"
        />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="canonical" href="https://www.kuhandranchatbot.info" />

        {/* hreflang — language + country signals for Google multi-region indexing */}
        {[
          { lang: "en-MY", href: "https://www.kuhandranchatbot.info/en" },
          { lang: "en-SG", href: "https://www.kuhandranchatbot.info/en" },
          { lang: "en-GB", href: "https://www.kuhandranchatbot.info/en" },
          { lang: "en-AU", href: "https://www.kuhandranchatbot.info/en" },
          { lang: "en-AE", href: "https://www.kuhandranchatbot.info/en" },
          { lang: "en-US", href: "https://www.kuhandranchatbot.info/en" },
          { lang: "en-CA", href: "https://www.kuhandranchatbot.info/en" },
          { lang: "x-default", href: "https://www.kuhandranchatbot.info" },
        ].map(({ lang, href }) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={href} />
        ))}

        {/* JSON-LD Schema — enhanced with availableIn for international SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Kuhandran SamudraPandiyan",
              url: "https://www.kuhandranchatbot.info",
              image: "https://www.kuhandranchatbot.info/image/profile.png",
              jobTitle: "Technical Delivery Manager",
              description:
                "Technical Delivery Manager and Full-Stack Engineer with 8+ years in enterprise applications, React Native, and banking/insurance solutions. Open to opportunities in Malaysia, Singapore, UK, Australia, Gulf, Europe, and remote roles globally.",
              nationality: { "@type": "Country", name: "Sri Lanka" },
              worksFor: {
                "@type": "Organization",
                name: "FWD Insurance",
                url: "https://www.fwd.com",
                alternateName: ["FWD Malaysia", "FWD Technology and Innovation Malaysia Sdn. Bhd"],
              },
              availableIn: [
                { "@type": "Country", name: "Malaysia" },
                { "@type": "Country", name: "Singapore" },
                { "@type": "Country", name: "United Kingdom" },
                { "@type": "Country", name: "Australia" },
                { "@type": "Country", name: "United Arab Emirates" },
                { "@type": "Country", name: "Germany" },
                { "@type": "Country", name: "Canada" },
                { "@type": "Country", name: "United States" },
              ],
              hasOccupation: {
                "@type": "Occupation",
                name: "Technical Delivery Manager",
                occupationLocation: [
                  { "@type": "Country", name: "Malaysia" },
                  { "@type": "Country", name: "Singapore" },
                  { "@type": "Country", name: "United Kingdom" },
                ],
                skills: "React Native, React.js, Spring Boot, Power BI, TypeScript, Agile, Project Management",
              },
              alumniOf: [
                {
                  "@type": "CollegeOrUniversity",
                  name: "Cardiff Metropolitan University",
                  url: "https://www.cardiffmet.ac.uk",
                  alternateName: ["Cardiff Met", "UWIC"],
                },
                {
                  "@type": "CollegeOrUniversity",
                  name: "University of Wollongong Malaysia",
                  url: "https://www.uow.edu.au",
                  alternateName: ["UOW Malaysia", "UOW Australia"],
                },
                {
                  "@type": "CollegeOrUniversity",
                  name: "INTI International University",
                  url: "https://www.newinti.edu.my",
                },
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Kuala Lumpur",
                addressRegion: "Wilayah Persekutuan",
                addressCountry: "MY",
              },
              sameAs: [
                "https://www.linkedin.com/in/kuhandran-samudrapandiyan/",
                "https://github.com/kuhandran",
                "https://instagram.com/kuhan_samudra",
              ],
              knowsAbout: [
                "React Native", "React.js", "TypeScript", "Spring Boot",
                "Power BI", "Data Visualization", "Full-Stack Development",
                "Microservices", "Enterprise Applications", "Banking Technology",
                "Insurance Technology", "Project Management", "Agile Methodologies",
                "Cross-functional Teams", "RESTful APIs", "AWS",
              ],
            }),
          }}
        />
      </head>
      <body>
        <GA4Provider />
        <VisitorTracker />
        <ReadingProgress />
        <LanguageProvider>{children}</LanguageProvider>
        <ServiceWorkerManager />
        <AnalyticsWrapper />
        <AnalyticsConsentBanner />
      </body>
    </html>
  );
}
