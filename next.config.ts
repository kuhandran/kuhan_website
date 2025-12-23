import type { NextConfig } from "next";

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
    unoptimized: false, // Enable next/image optimization
    formats: ['image/webp', 'image/avif'], // Modern image formats
    minimumCacheTTL: 31536000, // Cache images for 1 year
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
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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
      {
        source: '/(.*).css',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css',
          },
        ],
      },
      {
        source: '/(.*).js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
      {
        source: '/_next/static/chunks/(.*).js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
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
