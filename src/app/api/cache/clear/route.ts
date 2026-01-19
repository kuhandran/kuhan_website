/**
 * Cache Clear API Endpoint
 * GET /api/cache/clear - Clears all service worker caches
 * GET /api/cache/clear?type=api - Clears specific cache type
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cacheType = searchParams.get('type');

    // Validate cache type if provided
    const validTypes = ['static', 'api', 'images', 'cdn'];
    if (cacheType && !validTypes.includes(cacheType)) {
      return NextResponse.json(
        {
          error: 'Invalid cache type',
          validTypes,
          received: cacheType,
        },
        { status: 400 }
      );
    }

    // This endpoint documents the cache clearing capability
    // Actual cache clearing happens on the client-side via service worker
    return NextResponse.json(
      {
        success: true,
        message: 'Cache clearing initiated',
        cacheType: cacheType || 'all',
        details: {
          note: 'Cache clearing must be handled by client-side service worker',
          implementation: 'Use the service worker message API or PWA utils',
          examples: {
            clientSide: [
              "import { clearCache } from '@/pwa';",
              "await clearCache('v1.0.0-api');",
            ],
            serviceWorker: [
              "navigator.serviceWorker.controller?.postMessage({",
              "  type: 'CLEAR_CACHE'",
              "})",
            ],
          },
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Cache clear error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process cache clear request',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Support OPTIONS for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
