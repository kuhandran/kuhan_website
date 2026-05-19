import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Require analytics consent cookie
    const consent = request.cookies.get('analytics-consent');
    if (!consent || consent.value !== 'true') {
      return NextResponse.json({ error: 'Consent not provided' }, { status: 403 });
    }

    const body = await request.json();
    const { event, language, referrer, userAgent, timestamp } = body;

    if (!event) {
      return NextResponse.json({ error: 'Missing event field' }, { status: 400 });
    }

    const record = {
      event,
      language: language || 'en',
      referrer: referrer || '',
      userAgent: userAgent || '',
      timestamp: timestamp || new Date().toISOString(),
      // IP-based country is read from Cloudflare header when deployed on CF/Amplify+CF proxy
      country: request.headers.get('cf-ipcountry') || request.headers.get('x-vercel-ip-country') || 'unknown',
    };

    // ── Persist here when you add a database ──────────────────────────────────
    // Example (Cloudflare D1 / PlanetScale / DynamoDB):
    //   await db.downloads.create({ data: record });
    // ─────────────────────────────────────────────────────────────────────────

    console.log('[Analytics] Download event:', JSON.stringify(record));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[Analytics] Download route error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
