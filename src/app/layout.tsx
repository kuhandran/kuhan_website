import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AnalyticsWrapper from '../components/AnalyticsWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kuhandran SamudraPandiyan | Technical Delivery Manager & Full-Stack Engineer',
  description: 'Technical leader specializing in enterprise applications, React Native development, and data visualization. 8+ years experience in banking and insurance sectors.',
  keywords: 'Technical Delivery Manager, Full-Stack Engineer, React Native, React.js, Data Visualization, Power BI, AWS, Spring Boot',
  authors: [{ name: 'Kuhandran SamudraPandiyan' }],
  openGraph: {
    title: 'Kuhandran SamudraPandiyan | Technical Delivery Manager',
    description: 'Technical leader with 8+ years experience in enterprise applications',
    type: 'website',
    url: 'https://www.kuhandranchatbot.info',
    siteName: 'Kuhandran SamudraPandiyan',
    images: [
      {
        url: 'https://www.kuhandranchatbot.info/public/image/profile.jpg',
        width: 400,
        height: 400,
        alt: 'Kuhandran SamudraPandiyan Profile',
      },
    ],
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
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
        {/* Security and trust meta tags for Zscaler and SEO */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://resume-chatbot-services-v2-0.onrender.com https://www.google.com https://www.gstatic.com https://api-gateway-715i.onrender.com https://api-gateway-services-7tgk.onrender.com; frame-src 'self' https://www.google.com https://www.gstatic.com;" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, noimageindex:off, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="Kuhandran SamudraPandiyan" />
        <meta name="category" content="technology" />
        <meta name="application-name" content="Kuhandran SamudraPandiyan Portfolio" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="canonical" href="https://www.kuhandranchatbot.info" />
      </head>
      <body className={inter.className}>
        {children}
        <AnalyticsWrapper />
      </body>
    </html>
  );
}