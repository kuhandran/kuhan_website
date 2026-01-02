import { redirect } from 'next/navigation';
import { DEFAULT_LANGUAGE } from '@/lib/config/domains';

/**
 * Legacy redirect handler for old static config paths
 * Redirects /config/apiConfig.json to /api/config/en/apiConfig
 * This maintains backward compatibility
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const configType = url.pathname.split('/').pop()?.replace('.json', '') || 'apiConfig';
  
  // Redirect to the new dynamic route with default language
  redirect(`/api/config/${DEFAULT_LANGUAGE}/${configType}`);
}
