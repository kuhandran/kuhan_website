import { NextRequest, NextResponse } from 'next/server';
import { DOMAINS, DEFAULT_LANGUAGE, getCollectionUrl } from '@/lib/config/domains';

/**
 * API Proxy Route for fetching multilingual content
 * Handles both external API and local fallback
 * 
 * Usage: /api/content/[type]?language=en&file=experience
 * Example: /api/content/data?language=ta&file=experience
 * 
 * ⚠️ Domains are now centralized in src/config/domains.ts
 */

// Local fallback cache
const localDataCache: Record<string, Record<string, any>> = {};

async function loadLocalFallback(language: string, fileType: string, fileName: string) {
  try {
    const cacheKey = `${language}/${fileType}/${fileName}`;
    
    if (localDataCache[cacheKey]) {
      return localDataCache[cacheKey];
    }

    // Try to load from local file system (server-side)
    if (typeof window === 'undefined') {
      try {
        const fs = await import('fs/promises');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'public', 'collections', language, fileType, `${fileName}.json`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        localDataCache[cacheKey] = data;
        console.log(`✅ Loaded from local file: ${filePath}`);
        return data;
      } catch (fsError) {
        console.warn(`⚠️ Local file not found: public/collections/${language}/${fileType}/${fileName}.json`);
      }
    }

    // Try to load via HTTP (client-side or as fallback)
    const filePath = `/collections/${language}/${fileType}/${fileName}.json`;
    const appUrl = DOMAINS.getAppUrl();
    const response = await fetch(`${appUrl}${filePath}`);
    
    if (response.ok) {
      const data = await response.json();
      localDataCache[cacheKey] = data;
      return data;
    }
  } catch (error) {
    console.error(`Failed to load local fallback for ${language}/${fileType}/${fileName}:`, error);
  }

  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || DEFAULT_LANGUAGE;
    const fileName = searchParams.get('file') || 'contentLabels';

    // Validate inputs
    if (!['data', 'config'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid content type. Must be "data" or "config"' },
        { status: 400 }
      );
    }

    // Try external API first
    try {
      const apiUrl = getCollectionUrl(language as any, type as any, fileName);
      console.log(`📡 Fetching from API: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Kuhandran-Portfolio/1.0',
        },
        // Timeout after 5 seconds
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Successfully fetched ${fileName} for ${language}`);
        
        return NextResponse.json(data, {
          headers: {
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
          },
        });
      }

      if (response.status === 503) {
        console.warn(`⚠️ API returning 503 for ${language}/${type}/${fileName}, trying local fallback`);
      }
    } catch (error) {
      console.error(`❌ API request failed for ${language}/${type}/${fileName}:`, error);
    }

    // Fallback to local data
    console.log(`📁 Falling back to local data for ${language}/${type}/${fileName}`);
    const localData = await loadLocalFallback(language, type, fileName);

    if (localData) {
      return NextResponse.json(localData, {
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=604800',
          'X-Data-Source': 'local-fallback',
        },
      });
    }

    // No data found anywhere
    return NextResponse.json(
      { 
        error: `Content not found: ${language}/${type}/${fileName}`,
        availableLanguages: ['en', 'ar-AE', 'es', 'fr', 'hi', 'id', 'my', 'si', 'ta', 'th'],
      },
      { status: 404 }
    );

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
