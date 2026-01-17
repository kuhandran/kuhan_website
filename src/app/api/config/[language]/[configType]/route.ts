import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, DATA_FILES } from '@/lib/config/domains';
import { getApiConfig, getPageLayout } from '@/lib/utils/contentLoader';
import { getDataSourceUrl } from '@/lib/config/loaders';

/**
 * Language-Specific Config Route Handler
 * Serves config files based on language code
 * 
 * Usage: GET /api/config/{language}/{configType}
 * Example: GET /api/config/en/apiConfig
 *          → returns English apiConfig.json with Content-Type: application/json
 *
 * Supported config types:
 * - apiConfig
 * - pageLayout
 * - urlConfig
 */

async function loadConfigFile(language: string, configType: string): Promise<unknown> {
  try {
    // Validate language
    const validLanguages = SUPPORTED_LANGUAGES as readonly string[];
    const normalizedLanguage = validLanguages.includes(language) ? language : DEFAULT_LANGUAGE;

    // Load config using proper functions from contentLoader
    switch (configType) {
      case DATA_FILES.apiConfig:
        return await getApiConfig(normalizedLanguage);
      case DATA_FILES.pageLayout:
        return await getPageLayout(normalizedLanguage);
      case DATA_FILES.urlConfig:
        // urlConfig is fetched directly from the API
        const url = getDataSourceUrl('urlConfig.json', normalizedLanguage, 'config');
        try {
          const response = await fetch(url);
          if (!response.ok) {
            console.error(`[Config] loadConfigFile: Failed to fetch ${configType} (status ${response.status})`);
            return null;
          }
          const data = await response.json();
          // Extract 'data' field if present (API response wrapper)
          return data.data || data;
        } catch (fetchError) {
          console.error(`[Config] loadConfigFile: Network error fetching ${configType}`, fetchError);
          return null;
        }
      default:
        return null;
    }
  } catch (error) {
    console.error(`[Config] loadConfigFile: Error loading config (${language}/${configType})`, error instanceof Error ? error.message : String(error));
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ language: string; configType: string }> }
) {
  try {
    // Parse and validate params
    let language: string;
    let configType: string;
    
    try {
      ({ language, configType } = await params);
    } catch (paramError) {
      console.error('[Config] GET: Failed to parse route params', paramError);
      return NextResponse.json(
        { error: 'Failed to parse request parameters' },
        { status: 400 }
      );
    }

    // Validate inputs
    if (!language || typeof language !== 'string') {
      console.error('[Config] GET: Missing or invalid language parameter');
      return NextResponse.json(
        { error: 'Missing or invalid language parameter' },
        { status: 400 }
      );
    }

    if (!configType || typeof configType !== 'string') {
      console.error('[Config] GET: Missing or invalid configType parameter');
      return NextResponse.json(
        { error: 'Missing or invalid configType parameter' },
        { status: 400 }
      );
    }

    // Valid config types
    const validConfigTypes: readonly string[] = [
      DATA_FILES.apiConfig,
      DATA_FILES.pageLayout,
      DATA_FILES.urlConfig,
    ];

    if (!validConfigTypes.includes(configType)) {
      console.warn('[Config] GET: Invalid configType', { configType, validConfigTypes });
      return NextResponse.json(
        {
          error: `Invalid configType. Must be one of: ${validConfigTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate language
    const validLanguages = SUPPORTED_LANGUAGES as readonly string[];
    if (!validLanguages.includes(language)) {
      console.warn('[Config] GET: Unsupported language', { language, validLanguages });
      // Don't fail - normalize to default language
    }

    console.log('[Config] GET: Loading config', { language, configType });

    const config = await loadConfigFile(language, configType);

    if (!config) {
      console.warn('[Config] GET: Config not found', { language, configType });
      return NextResponse.json(
        { error: `Config not found: ${configType} for language ${language}` },
        { status: 404 }
      );
    }

    return NextResponse.json(config, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[Config] GET: Unexpected error', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: 'Failed to load config' },
      { status: 500 }
    );
  }
}
