import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all major search bots with full access
      {
        userAgent: ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider', 'YandexBot', 'facebookexternalhit', 'LinkedInBot', 'Twitterbot'],
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      // Default rule for all other bots
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/'],
      },
    ],
    sitemap: 'https://www.kuhandranchatbot.info/sitemap.xml',
    host: 'https://www.kuhandranchatbot.info',
  };
}
