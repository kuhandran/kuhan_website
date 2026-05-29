'use client';
import Script from 'next/script';

// Set NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX in .env.local
// Leave unset in dev — GA4 won't load and all ga4.ts calls silently no-op.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GA4Provider() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}', {
          anonymize_ip: true,
          send_page_view: true,
          cookie_flags: 'SameSite=None;Secure',
        });
      `}</Script>
    </>
  );
}
