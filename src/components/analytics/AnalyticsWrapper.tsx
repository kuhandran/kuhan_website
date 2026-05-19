export default function AnalyticsWrapper() {
  // Cloudflare RUM is configured with auto-inject in the Cloudflare zone.
  // Do not add a manual `beacon.min.js` snippet here — the proxy will
  // inject the beacon on the server edge when requests pass through Cloudflare.
  return null;
}
