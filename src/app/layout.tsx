import type { Metadata } from "next";
import type { Viewport } from "next";
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
    "Kuhandran SamudraPandiyan | Technical Delivery Manager — ACS Assessed | Available Australia, UK, USA, Europe & NZ",
  description:
    "Kuhandran SamudraPandiyan — Technical Delivery Manager & Full-Stack Engineer with 8+ years at FWD Insurance and Maybank. ACS skills-assessed, IELTS certified, UOW graduate, Cardiff Met MBA. Zero visa risk for Australian banks, UK, USA, Europe and New Zealand employers. Expert in React, React Native, Power BI, Spring Boot, and Agile delivery.",
  keywords: [
    // Name variations
    "Kuhandran SamudraPandiyan",
    "Kuhandran Samudra Pandiyan",
    "Kuhan SamudraPandiyan",
    "Kuhan Samudra",
    // Job titles
    "Technical Delivery Manager",
    "TDM Malaysia",
    "Full Stack Engineer",
    "Full Stack Developer Malaysia",
    "Software Engineer Malaysia",
    "Senior Software Engineer Kuala Lumpur",
    "Engineering Manager Malaysia",
    "Tech Lead Malaysia",
    "Solution Architect Malaysia",
    // Skills — frontend
    "React.js developer",
    "React Native developer",
    "TypeScript developer",
    "JavaScript developer",
    "Next.js developer",
    "Frontend engineer Malaysia",
    // Skills — backend
    "Spring Boot developer",
    "Java developer",
    "Microservices architecture",
    "RESTful API development",
    "Node.js developer",
    // Skills — data & BI
    "Power BI specialist",
    "Power BI developer Malaysia",
    "Data Visualization expert",
    "Business Intelligence Malaysia",
    "Dashboard developer",
    // Skills — cloud & devops
    "AWS engineer",
    "Cloud engineer Malaysia",
    "CI/CD pipelines",
    "DevOps engineer",
    // Domain expertise
    "Banking technology Malaysia",
    "Insurance technology Malaysia",
    "Fintech Malaysia",
    "Enterprise application development",
    "Digital transformation Malaysia",
    // Employers
    "FWD Insurance developer",
    "FWD Malaysia",
    "FWD Technology and Innovation Malaysia Sdn. Bhd",
    "Maybank developer",
    "Maybank Tech",
    "Maybank Shared Services",
    // Project delivery
    "Agile delivery manager",
    "Scrum master Malaysia",
    "Project management IT",
    "Cross-functional team lead",
    "Product delivery Malaysia",
    // Education
    "INTI International University alumni",
    "University of Wollongong Malaysia",
    "UOW Malaysia alumni",
    "Cardiff Metropolitan University",
    // Visa & migration credentials — the key differentiators
    "ACS assessed software engineer",
    "ACS skills assessment Australia",
    "Australian Computer Society assessed",
    "skilled migrant Australia technology",
    "189 visa eligible developer",
    "190 visa eligible software engineer",
    "491 visa eligible tech professional",
    "IELTS certified software engineer",
    "IELTS 6 band engineer",
    "English proficiency certified developer",
    "visa ready software engineer Australia",
    "low risk international hire Australia",
    "no sponsorship risk developer Australia",
    // Australian market — banks & employers
    "software engineer Australia",
    "developer Sydney",
    "developer Melbourne",
    "developer Brisbane",
    "Full Stack Engineer Australia",
    "Technical Delivery Manager Australia",
    "React developer Australia",
    "Power BI developer Australia",
    "banking technology Australia",
    "Commonwealth Bank developer",
    "CBA tech engineer",
    "ANZ bank software engineer",
    "Westpac developer",
    "NAB technology engineer",
    "Macquarie bank developer",
    "Bank of Queensland engineer",
    "fintech Australia",
    "enterprise software Australia",
    // UK market — banks & employers
    "software engineer United Kingdom",
    "developer London",
    "Barclays developer",
    "HSBC software engineer",
    "Lloyds Banking Group engineer",
    "NatWest developer",
    "Standard Chartered engineer",
    "UK banking technology",
    "React developer London",
    "Full Stack Engineer UK",
    // USA market
    "software engineer USA",
    "developer New York",
    "JPMorgan Chase developer",
    "Bank of America engineer",
    "Citibank software engineer",
    "Wells Fargo developer",
    "Goldman Sachs engineer",
    "fintech USA",
    "React developer United States",
    // Europe market
    "software engineer Europe",
    "developer Germany",
    "developer Netherlands",
    "Deutsche Bank developer",
    "ING bank engineer",
    "BNP Paribas developer",
    "EU Blue Card eligible engineer",
    "fintech Europe",
    // New Zealand market
    "software engineer New Zealand",
    "developer Auckland",
    "developer Wellington",
    "ANZ New Zealand developer",
    "ASB Bank engineer",
    "BNZ software engineer",
    "Westpac NZ developer",
    "Kiwibank engineer",
    "NZ skilled migrant tech",
    // Education — Australian & UK university signals
    "University of Wollongong graduate",
    "UOW graduate Australia",
    "UOW alumni software engineer",
    "Australian university degree developer",
    "Cardiff Metropolitan University MBA",
    "Cardiff Met MBA graduate",
    "MBA software engineer",
    "Masters degree tech professional",
    // General locations & markets
    "Kuala Lumpur software engineer",
    "KL tech professional",
    "Malaysia Singapore tech talent",
    "Remote software engineer Asia",
    "Open to relocation Australia",
    "Open to relocation UK",
    "Open to relocation USA",
    "Open to relocation New Zealand",
    "Open to relocation Europe",
    // Site infrastructure — signals technical depth to recruiters
    "AWS Amplify developer",
    "Cloudflare Workers developer",
    "Cloudflare R2 developer",
    "Cloudflare KV developer",
    "Cloudflare Analytics",
    "Claude LLM integration",
    "Anthropic Claude developer",
    "Google Analytics 4 developer",
    "AI chatbot portfolio",
    "edge computing engineer",
    "serverless developer",
    "Next.js AWS Amplify deployment",
    // Portfolio & hire intent
    "hire React developer Australia",
    "hire Full Stack Engineer UK",
    "hire Technical Delivery Manager ACS assessed",
    "portfolio Kuhandran",
    "kuhandranchatbot",
  ].join(", "),
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
      "ACS assessed & IELTS certified Technical Delivery Manager. UOW graduate, Cardiff Met MBA. 8+ years at FWD Insurance & Maybank. Migration-ready for Australia (CBA, ANZ, Westpac, NAB), UK, USA, Europe & NZ. Zero visa risk.",
    type: "website",
    url: "https://www.kuhandranchatbot.info",
    siteName: "Kuhandran SamudraPandiyan",
    locale: "en_MY",
    images: [
      {
        url: "https://static.kuhandranchatbot.info/public/image/profile.png",
        width: 1200,
        height: 630,
        alt: "Kuhandran SamudraPandiyan — Technical Delivery Manager & Full-Stack Engineer",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kuhandran SamudraPandiyan | Technical Delivery Manager & Full-Stack Engineer",
    description:
      "ACS assessed · IELTS certified · UOW degree · Cardiff Met MBA. 8+ yrs at FWD Insurance & Maybank. Targeting Australian banks, UK, USA, NZ & Europe. Migration-ready, zero risk.",
    images: ["https://static.kuhandranchatbot.info/public/image/profile.png"],
    creator: "@kuhan_samudra",
    site: "@kuhan_samudra",
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
    languages: {
      "en-MY": "https://www.kuhandranchatbot.info/en",
      "en-SG": "https://www.kuhandranchatbot.info/en",
      "en-GB": "https://www.kuhandranchatbot.info/en",
      "en-AU": "https://www.kuhandranchatbot.info/en",
      "en-AE": "https://www.kuhandranchatbot.info/en",
      "en-US": "https://www.kuhandranchatbot.info/en",
      "x-default": "https://www.kuhandranchatbot.info",
    },
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
  verification: {
    google: "kuhandranchatbot-google-verification",
  },
  other: {
    // Geo meta tags — help regional search engines and local SEO
    "geo.region": "MY-14",
    "geo.placename": "Kuala Lumpur",
    "geo.position": "3.1390;101.6869",
    ICBM: "3.1390, 101.6869",
    // Dublin Core
    "DC.title": "Kuhandran SamudraPandiyan — Portfolio",
    "DC.creator": "Kuhandran SamudraPandiyan",
    "DC.subject": "Technical Delivery Manager, Full-Stack Engineer, ACS Assessed, IELTS Certified, Australia, UK, USA, New Zealand, Europe",
    "DC.description":
      "Portfolio of Kuhandran SamudraPandiyan — ACS assessed, IELTS certified Technical Delivery Manager and Full-Stack Engineer. UOW graduate and Cardiff Met MBA. Available for Australian banks and global roles.",
    "DC.language": "en",
    "DC.coverage": "Australia, United Kingdom, United States, New Zealand, Germany, Netherlands, Singapore, Malaysia, UAE, Canada",
    // Profile meta
    "profile:first_name": "Kuhandran",
    "profile:last_name": "SamudraPandiyan",
    "profile:username": "kuhandran",
    // Explicit asset references for crawlers
    "og:image": "https://static.kuhandranchatbot.info/public/image/profile.png",
    "og:image:width": "400",
    "og:image:height": "400",
    "og:image:type": "image/png",
    "og:image:alt": "Kuhandran SamudraPandiyan — Technical Delivery Manager & Full-Stack Engineer",
    // Resume / CV link for recruiter aggregators
    "resume": "https://static.kuhandranchatbot.info/public/resume/resume.pdf",
    "cv": "https://static.kuhandranchatbot.info/public/resume/resume.pdf",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3b82f6",
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

        {/* Profile image — explicit for crawlers that don't parse OG tags */}
        <link rel="image_src" href="https://static.kuhandranchatbot.info/public/image/profile.png" />

        {/* CV / Resume — discoverable by recruiter bots and Google */}
        <link
          rel="alternate"
          type="application/pdf"
          href="https://static.kuhandranchatbot.info/public/resume/resume.pdf"
          title="Kuhandran SamudraPandiyan — CV / Resume (PDF)"
        />

        {/* hreflang — language + country signals for Google multi-region indexing */}
        {[
          { lang: "en-MY", href: "https://www.kuhandranchatbot.info/en" },
          { lang: "en-SG", href: "https://www.kuhandranchatbot.info/en" },
          { lang: "en-GB", href: "https://www.kuhandranchatbot.info/en" },
          { lang: "en-AU", href: "https://www.kuhandranchatbot.info/en" },
          { lang: "en-AE", href: "https://www.kuhandranchatbot.info/en" },
          { lang: "en-US", href: "https://www.kuhandranchatbot.info/en" },
          { lang: "en-CA", href: "https://www.kuhandranchatbot.info/en" },
          { lang: "en-DE", href: "https://www.kuhandranchatbot.info/en" },
          { lang: "en-NZ", href: "https://www.kuhandranchatbot.info/en" },
          { lang: "en-NL", href: "https://www.kuhandranchatbot.info/en" },
          { lang: "x-default", href: "https://www.kuhandranchatbot.info" },
        ].map(({ lang, href }) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={href} />
        ))}

        {/* JSON-LD — Person schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://www.kuhandranchatbot.info/#person",
              name: "Kuhandran SamudraPandiyan",
              alternateName: ["Kuhan Samudra", "Kuhan SamudraPandiyan"],
              url: "https://www.kuhandranchatbot.info",
              image: {
                "@type": "ImageObject",
                "@id": "https://static.kuhandranchatbot.info/public/image/profile.png",
                url: "https://static.kuhandranchatbot.info/public/image/profile.png",
                contentUrl: "https://static.kuhandranchatbot.info/public/image/profile.png",
                width: 400,
                height: 400,
                encodingFormat: "image/png",
                caption: "Kuhandran SamudraPandiyan — Technical Delivery Manager & Full-Stack Engineer",
                name: "Kuhandran SamudraPandiyan Profile Photo",
              },
              // CV / Resume — directly discoverable by Google and recruiter crawlers
              mainEntityOfPage: {
                "@type": "DigitalDocument",
                "@id": "https://static.kuhandranchatbot.info/public/resume/resume.pdf",
                name: "Kuhandran SamudraPandiyan — CV / Resume",
                description: "Full CV of Kuhandran SamudraPandiyan — Technical Delivery Manager, ACS assessed, IELTS certified, UOW graduate, Cardiff Met MBA. 8+ years at FWD Insurance and Maybank. Available for Australia, UK, USA, New Zealand, and Europe.",
                encodingFormat: "application/pdf",
                url: "https://static.kuhandranchatbot.info/public/resume/resume.pdf",
                author: { "@id": "https://www.kuhandranchatbot.info/#person" },
                keywords: "Technical Delivery Manager CV, ACS assessed resume, Full Stack Engineer CV Australia, React Native developer resume, Power BI developer CV, banking technology engineer resume",
                inLanguage: "en",
              },
              jobTitle: "Technical Delivery Manager",
              description:
                "Technical Delivery Manager and Full-Stack Engineer with 8+ years in enterprise banking and insurance software. ACS skills-assessed and IELTS certified — migration-ready for Australia, UK, USA, Europe, and New Zealand with zero sponsorship risk. UOW graduate and Cardiff Met MBA holder. Expert in React, React Native, Spring Boot, Power BI, and Agile delivery.",
              nationality: { "@type": "Country", name: "Sri Lanka" },
              worksFor: {
                "@type": "Organization",
                name: "FWD Insurance",
                url: "https://www.fwd.com",
                alternateName: ["FWD Malaysia", "FWD Technology and Innovation Malaysia Sdn. Bhd"],
                sameAs: "https://www.fwd.com",
              },
              // ACS assessment + IELTS = low-risk international hire signal for Australian & global employers
              hasCredential: [
                {
                  "@type": "EducationalOccupationalCredential",
                  name: "ACS Skills Assessment",
                  credentialCategory: "Professional Skills Assessment",
                  recognizedBy: {
                    "@type": "Organization",
                    name: "Australian Computer Society",
                    alternateName: "ACS",
                    url: "https://www.acs.org.au",
                  },
                  description: "ACS-assessed ICT professional — eligible for Australian skilled migration visas (subclass 189, 190, 491).",
                },
                {
                  "@type": "EducationalOccupationalCredential",
                  name: "IELTS — International English Language Testing System",
                  credentialCategory: "English Language Proficiency",
                  recognizedBy: {
                    "@type": "Organization",
                    name: "British Council / IDP",
                  },
                  description: "IELTS certified with a score of 6.0 and above — meets English language requirements for Australia, UK, USA, Canada, and New Zealand visa and employment applications.",
                },
                {
                  "@type": "EducationalOccupationalCredential",
                  name: "Master of Business Administration (MBA)",
                  credentialCategory: "degree",
                  educationalLevel: "PostgraduateDegree",
                  recognizedBy: {
                    "@type": "CollegeOrUniversity",
                    name: "Cardiff Metropolitan University",
                    url: "https://www.cardiffmet.ac.uk",
                  },
                },
                {
                  "@type": "EducationalOccupationalCredential",
                  name: "Bachelor of Computer Science",
                  credentialCategory: "degree",
                  educationalLevel: "BachelorDegree",
                  recognizedBy: {
                    "@type": "CollegeOrUniversity",
                    name: "University of Wollongong",
                    url: "https://www.uow.edu.au",
                    alternateName: ["UOW", "University of Wollongong Malaysia", "UOWM"],
                  },
                  description: "Degree from University of Wollongong — Australian institution recognised globally, directly relevant to Australian employer hiring.",
                },
              ],
              availableIn: [
                { "@type": "Country", name: "Australia" },
                { "@type": "Country", name: "United Kingdom" },
                { "@type": "Country", name: "United States" },
                { "@type": "Country", name: "New Zealand" },
                { "@type": "Country", name: "Germany" },
                { "@type": "Country", name: "Netherlands" },
                { "@type": "Country", name: "Singapore" },
                { "@type": "Country", name: "Canada" },
                { "@type": "Country", name: "United Arab Emirates" },
                { "@type": "Country", name: "Malaysia" },
              ],
              // Target employer organisations for structured-data matching
              seeks: {
                "@type": "Demand",
                description: "Seeking Technical Delivery Manager, Engineering Manager, or Senior Full-Stack Engineer roles in Australian banks (CBA, ANZ, Westpac, NAB, Macquarie), UK banks (Barclays, HSBC, Lloyds, NatWest), US banks (JPMorgan, Citi, Goldman Sachs), European banks (Deutsche Bank, ING), and NZ banks (ANZ NZ, ASB, BNZ, Westpac NZ).",
              },
              hasOccupation: {
                "@type": "Occupation",
                name: "Technical Delivery Manager",
                occupationLocation: [
                  { "@type": "Country", name: "Australia" },
                  { "@type": "Country", name: "United Kingdom" },
                  { "@type": "Country", name: "United States" },
                  { "@type": "Country", name: "New Zealand" },
                  { "@type": "Country", name: "Germany" },
                  { "@type": "Country", name: "Malaysia" },
                  { "@type": "Country", name: "Singapore" },
                ],
                skills: [
                  "React Native", "React.js", "Next.js", "TypeScript", "JavaScript",
                  "Spring Boot", "Java", "Node.js", "Python",
                  "Power BI", "Data Visualization", "Business Intelligence",
                  "Microservices", "RESTful APIs", "AWS", "CI/CD",
                  "Agile", "Scrum", "Project Management", "Technical Delivery",
                  "Cross-functional Team Leadership", "Stakeholder Management",
                  "Banking Technology", "Insurance Technology", "Fintech",
                ],
              },
              alumniOf: [
                {
                  "@type": "CollegeOrUniversity",
                  name: "Cardiff Metropolitan University",
                  url: "https://www.cardiffmet.ac.uk",
                  alternateName: ["Cardiff Met", "UWIC"],
                  address: { "@type": "PostalAddress", addressCountry: "GB", addressLocality: "Cardiff" },
                },
                {
                  "@type": "CollegeOrUniversity",
                  name: "University of Wollongong",
                  url: "https://www.uow.edu.au",
                  alternateName: ["UOW", "University of Wollongong Malaysia", "UOWM", "UOW Malaysia"],
                  address: { "@type": "PostalAddress", addressCountry: "AU", addressLocality: "Wollongong" },
                },
                {
                  "@type": "CollegeOrUniversity",
                  name: "INTI International University",
                  url: "https://www.newinti.edu.my",
                  alternateName: ["INTI UC", "INTI College"],
                },
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Kuala Lumpur",
                addressRegion: "Wilayah Persekutuan",
                addressCountry: "MY",
                postalCode: "50000",
              },
              sameAs: [
                "https://www.linkedin.com/in/kuhandran-samudrapandiyan/",
                "https://github.com/kuhandran",
                "https://instagram.com/kuhan_samudra",
              ],
              knowsAbout: [
                "React Native", "React.js", "Next.js", "TypeScript", "JavaScript",
                "Spring Boot", "Java", "Node.js", "Python",
                "Power BI", "Data Visualization", "Business Intelligence",
                "Full-Stack Development", "Microservices Architecture",
                "Enterprise Application Development", "Banking Technology",
                "Insurance Technology", "Fintech", "Digital Transformation",
                "Project Management", "Agile Methodologies", "Scrum",
                "Cross-functional Team Leadership", "RESTful APIs", "AWS",
                "CI/CD Pipelines", "DevOps", "Cloud Computing",
                "AWS Amplify", "Cloudflare Workers", "Cloudflare R2", "Cloudflare KV",
                "Cloudflare Analytics", "Claude LLM", "Anthropic AI", "Google Analytics 4",
                "Serverless Architecture", "Edge Computing",
                "Skilled Migration", "ACS Assessment", "International Relocation",
              ],
            }),
          }}
        />
        {/* JSON-LD — CV as a standalone DigitalDocument, discoverable by Google & recruiter crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "DigitalDocument",
              "@id": "https://static.kuhandranchatbot.info/public/resume/resume.pdf",
              name: "Kuhandran SamudraPandiyan — CV / Resume",
              description:
                "CV of Kuhandran SamudraPandiyan — ACS assessed, IELTS certified Technical Delivery Manager and Full-Stack Engineer. UOW graduate, Cardiff Met MBA. 8+ years at FWD Insurance and Maybank. Actively seeking roles in Australia (CBA, ANZ, Westpac, NAB, Macquarie), UK, USA, New Zealand, and Europe.",
              encodingFormat: "application/pdf",
              url: "https://static.kuhandranchatbot.info/public/resume/resume.pdf",
              author: {
                "@type": "Person",
                "@id": "https://www.kuhandranchatbot.info/#person",
                name: "Kuhandran SamudraPandiyan",
              },
              keywords: [
                "Technical Delivery Manager CV",
                "ACS assessed resume Australia",
                "Full Stack Engineer CV",
                "React Native developer resume",
                "Power BI developer CV",
                "banking software engineer resume",
                "IELTS certified developer CV",
                "UOW graduate resume",
                "Cardiff Met MBA CV",
                "software engineer resume Australia",
                "developer resume UK",
                "engineer resume USA",
                "developer resume New Zealand",
              ].join(", "),
              inLanguage: "en",
              isPartOf: { "@id": "https://www.kuhandranchatbot.info/#website" },
              about: { "@id": "https://www.kuhandranchatbot.info/#person" },
            }),
          }}
        />
        {/* JSON-LD — WebSite with SearchAction (enables Google Sitelinks Search Box) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://www.kuhandranchatbot.info/#website",
              name: "Kuhandran SamudraPandiyan",
              alternateName: "Kuhandran Portfolio",
              url: "https://www.kuhandranchatbot.info",
              description:
                "Portfolio and personal website of Kuhandran SamudraPandiyan — Technical Delivery Manager and Full-Stack Engineer based in Kuala Lumpur.",
              inLanguage: "en",
              author: { "@id": "https://www.kuhandranchatbot.info/#person" },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://www.kuhandranchatbot.info/?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* JSON-LD — BreadcrumbList for homepage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.kuhandranchatbot.info",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Case Studies",
                  item: "https://www.kuhandranchatbot.info/case-studies",
                },
              ],
            }),
          }}
        />
        {/* JSON-LD — FAQPage targeting recruiter searches: ACS, visa, AU/UK/US/NZ banks */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Is Kuhandran SamudraPandiyan ACS assessed?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Kuhandran holds an ACS (Australian Computer Society) skills assessment, making him eligible for Australian skilled migration under visa subclasses 189 (independent), 190 (state nominated), and 491 (regional). This means zero skills-assessment risk for Australian employers who want to sponsor or hire internationally.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does Kuhandran have proof of English proficiency for Australia or UK?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Kuhandran is IELTS certified with a score of 6.0 and above, meeting the English language requirements for Australia, the United Kingdom, New Zealand, Canada, and the United States — covering both visa and employer requirements without additional testing.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is Kuhandran's degree from an Australian university?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Kuhandran holds a degree from the University of Wollongong (UOW) — an Australian university ranked in the top 200 globally. His education meets Australian qualification recognition standards, making him an easy, low-risk hire for Australian banks and technology firms.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What MBA does Kuhandran hold and is it UK recognised?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Kuhandran holds an MBA from Cardiff Metropolitan University in Wales, United Kingdom — a UK-recognised postgraduate degree. This makes him a strong candidate for UK-based roles requiring management credentials alongside technical expertise.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can Kuhandran work for Australian banks like CBA, ANZ, Westpac, NAB, or Macquarie?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. With an ACS skills assessment, IELTS certification, an Australian university (UOW) degree, and 8+ years of enterprise banking and insurance software delivery, Kuhandran is ideally positioned for roles at Commonwealth Bank (CBA), ANZ, Westpac, NAB, Macquarie Bank, and other Australian financial institutions.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is Kuhandran available to relocate to the UK, USA, Europe, or New Zealand?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Kuhandran is actively seeking roles in Australia, the United Kingdom, the United States, New Zealand, Germany, the Netherlands, and other European markets. His credentials (ACS assessment, IELTS, UK MBA, Australian degree) make him a migration-ready, low-risk international hire.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What technologies does Kuhandran specialise in?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Kuhandran specialises in React, React Native, TypeScript, Next.js, Spring Boot, Power BI, and cloud-native microservices on AWS. He has 8+ years of deep expertise in banking and insurance technology delivering solutions for FWD Insurance and Maybank.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Who is Kuhandran SamudraPandiyan?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Kuhandran SamudraPandiyan is a Technical Delivery Manager and Full-Stack Engineer based in Kuala Lumpur, Malaysia. He has 8+ years of experience delivering enterprise software for FWD Insurance and Maybank, holds an ACS skills assessment, IELTS certification, a UOW degree, and a Cardiff Met MBA — making him a strong, migration-ready candidate for global banking and technology roles.",
                  },
                },
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
