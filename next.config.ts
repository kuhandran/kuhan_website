import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isDevelopment ? ["'unsafe-eval'"] : []),
  "https://challenges.cloudflare.com",
].join(" ");

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "worker-src blob: 'self'",
  "font-src 'self' https://fonts.gstatic.com data:",
  "manifest-src 'self' https://static.kuhandranchatbot.info",
  [
    "connect-src 'self' blob:",
    "https://static.kuhandranchatbot.info",
    "https://auth-services.kuhandranchatbot.info",
    "https://chat-services.kuhandranchatbot.info",
    "https://contact-ai-services.kuhandranchatbot.info",
    "https://resume-chatbot-services-v2-0.onrender.com",
    "https://api-gateway-715i.onrender.com",
    "https://ipapi.co",
    "https://challenges.cloudflare.com",
  ].join(" "),
  "frame-src 'self' https://static.kuhandranchatbot.info https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  /* Target modern browsers to reduce polyfills and transpilation */
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  /* Optimize for modern browsers - no legacy polyfills needed */
  experimental: {
    optimizePackageImports: ["lucide-react"],
    optimizeCss: true, // Enable CSS optimization
  },
  /* Image optimization settings */
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.kuhandranchatbot.info',
        pathname: '/public/image/**',
      },
    ],
  },
  /* Headers for caching and bfcache optimization */
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
        ],
      },
      {
        source: '/api/contact',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/public/image/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/image/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  /* Optimize React rendering */
  reactStrictMode: true,
  /* PoweredBy header for security */
  poweredByHeader: false,
};

export default nextConfig;
