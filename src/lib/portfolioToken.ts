/**
 * Server-side only — never imported by client components.
 * Fetches a daily HMAC token from the auth service and caches it in memory
 * until the expires_at timestamp. Re-fetches automatically on expiry.
 */

const AUTH_SERVICE = 'https://auth-services.kuhandranchatbot.info';
const ORIGIN       = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.kuhandranchatbot.info';

interface TokenResponse {
  token:      string;
  expires_at: string; // ISO 8601 — "2026-05-30T23:59:59Z"
}

// Module-level cache — survives across requests on the same warm instance.
// In serverless (Vercel/Amplify) cold starts reset this, triggering a fresh fetch.
let _token:     string | null = null;
let _expiresAt: Date   | null = null;

export async function getPortfolioToken(): Promise<string> {
  const now = new Date();

  // Return cached token if still valid (with 60 s buffer before midnight rotation)
  if (_token && _expiresAt && _expiresAt.getTime() - now.getTime() > 60_000) {
    return _token;
  }

  const res = await fetch(`${AUTH_SERVICE}/portfolio/token`, {
    headers: { Origin: ORIGIN },
    // No caching — we manage expiry ourselves
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`[portfolioToken] GET /portfolio/token returned ${res.status}`);
  }

  const data = (await res.json()) as TokenResponse;

  _token     = data.token;
  _expiresAt = new Date(data.expires_at);

  return _token;
}
