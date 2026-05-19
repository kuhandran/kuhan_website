import Script from 'next/script';

export default function AnalyticsWrapper() {
  const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  if (!token || process.env.NODE_ENV === 'development') return null;

  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
      strategy="afterInteractive"
    />
  );
}
