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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <AnalyticsWrapper />
      </body>
    </html>
  );
}