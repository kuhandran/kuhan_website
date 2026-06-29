import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Primary search engines — full access ──────────────────
      {
        userAgent: [
          'Googlebot',
          'Googlebot-Image',
          'Googlebot-Video',
          'Bingbot',
          'Slurp',           // Yahoo
          'DuckDuckBot',
          'Baiduspider',
          'YandexBot',
        ],
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },

      // ── Social / recruiter crawlers — full access ─────────────
      {
        userAgent: [
          'LinkedInBot',
          'facebookexternalhit',
          'Twitterbot',
          'Applebot',
          'Discordbot',
          'WhatsApp',
          'TelegramBot',
        ],
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },

      // ── AI search crawlers — allow (benefits job visibility) ──
      // NOTE: Cloudflare Dashboard → Security → Bots → disable
      // "Block AI Scrapers" to prevent Cloudflare overriding these.
      {
        userAgent: [
          'Google-Extended',   // Google AI Overviews / Gemini
          'GPTBot',            // ChatGPT search
          'ChatGPT-User',
          'PerplexityBot',
          'YouBot',
          'ClaudeBot',         // Anthropic
          'anthropic-ai',
        ],
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },

      // ── Default — allow all, block internal paths ─────────────
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
