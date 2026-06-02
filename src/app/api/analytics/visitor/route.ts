import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Enrich with server-side Cloudflare headers (more reliable than client IP)
    const cfCountry  = request.headers.get('cf-ipcountry')  ?? '';
    const cfCity     = request.headers.get('cf-ipcity')     ?? '';
    const cfRay      = request.headers.get('cf-ray')        ?? '';
    const realIp     = request.headers.get('cf-connecting-ip')
                    ?? request.headers.get('x-forwarded-for')?.split(',')[0]
                    ?? '';

    const record = {
      ...body,
      // Server-side enrichment (overrides client if Cloudflare is in front)
      cf_country:  cfCountry || body.country  || 'unknown',
      cf_city:     cfCity    || body.city     || 'unknown',
      cf_ray:      cfRay,
      server_ip:   realIp,
      received_at: new Date().toISOString(),
    };

    // ── Persist to Cloudflare D1 when ready ───────────────────────────────────
    // const db = getD1Binding(request);
    // await db.prepare(`
    //   INSERT INTO visitor_sessions
    //     (session_id, org_name, org_domain, country, city, referrer_domain,
    //      is_linkedin, is_jobboard, os, browser, visit_count, received_at)
    //   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    // `).bind(
    //   record.sessionId, record.org?.name, record.org?.domain,
    //   record.cf_country, record.cf_city, record.referrer?.domain,
    //   record.referrer?.isLinkedIn ? 1 : 0,
    //   record.referrer?.isJobBoard ? 1 : 0,
    //   record.device?.os, record.device?.browser,
    //   record.session?.visitCount, record.received_at
    // ).run();

    // Log in dev so you can see what would be stored
    if (process.env.NODE_ENV === 'development') {
      console.log('[Visitor Intelligence]', JSON.stringify(record, null, 2));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Visitor API]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
