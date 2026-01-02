import { NextRequest, NextResponse } from 'next/server';

// Database schema (use MongoDB, PostgreSQL, or similar)
interface VisitorRecord {
  id?: string;
  city: string;
  country: string;
  countryCode: string;
  language: string;
  browserName: string;
  browserVersion: string;
  os: string;
  organizationName?: string;
  organizationDomain?: string;
  ipAddress: string;
  timestamp: string;
}

// Validation functions
interface ValidVisitorData {
  location: { city: string; country: string; countryCode: string };
  language: string;
  browser: { name: string; version: string; os: string };
  organization?: { name?: string; domain?: string };
}

function validateVisitorData(data: unknown): data is ValidVisitorData {
  if (!data || typeof data !== 'object') return false;
  
  const obj = data as Record<string, unknown>;
  const location = obj.location as Record<string, unknown> | undefined;
  const browser = obj.browser as Record<string, unknown> | undefined;
  
  return !!(location?.city && location?.country && location?.countryCode &&
            typeof obj.language === 'string' &&
            browser?.name && browser?.version && browser?.os);
}

export async function POST(request: NextRequest) {
  try {
    // Check for analytics consent cookie
    const consentCookie = request.cookies.get('analytics-consent');
    if (!consentCookie?.value) {
      console.warn('[Analytics] POST: Consent not provided');
      return NextResponse.json(
        { error: 'Analytics consent not provided' },
        { status: 403 }
      );
    }

    let data: unknown;
    try {
      data = await request.json();
    } catch (parseError) {
      console.error('[Analytics] POST: Invalid JSON payload', parseError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!validateVisitorData(data)) {
      console.error('[Analytics] POST: Validation failed - missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: location, browser, language' },
        { status: 400 }
      );
    }

    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'Unknown';

    // Prepare visitor record
    const visitorRecord: VisitorRecord = {
      city: data.location.city,
      country: data.location.country,
      countryCode: data.location.countryCode,
      language: data.language,
      browserName: data.browser.name,
      browserVersion: data.browser.version,
      os: data.browser.os,
      organizationName: data.organization?.name,
      organizationDomain: data.organization?.domain,
      ipAddress: clientIp,
      timestamp: new Date().toISOString(),
    };

    // TODO: Save to database
    // await db.visitorAnalytics.create(visitorRecord);

    // Log for development
    console.log('[Analytics] POST: Record created', { 
      country: visitorRecord.country,
      language: visitorRecord.language,
      browser: visitorRecord.browserName 
    });

    return NextResponse.json(
      { success: true, message: 'Analytics recorded' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Analytics] POST: Unexpected error', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: 'Failed to record analytics' },
      { status: 500 }
    );
  }
}

// GET endpoint for admin dashboard
export async function GET(request: NextRequest) {
  try {
    // Add authentication here
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.warn('[Analytics] GET: Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Fetch analytics from database
    // const analytics = await db.visitorAnalytics.find({
    //   timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    // });

    console.log('[Analytics] GET: Dashboard data fetched');

    return NextResponse.json({
      success: true,
      data: [],
      // data: analytics,
    });
  } catch (error) {
    console.error('[Analytics] GET: Unexpected error', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
