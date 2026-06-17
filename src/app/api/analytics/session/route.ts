import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioToken } from '@/lib/portfolioToken';

const AUTH_SERVICE = 'https://auth-services.kuhandranchatbot.info';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Token is fetched + cached server-side — never reaches the browser
    const token = await getPortfolioToken();

    const upstream = await fetch(`${AUTH_SERVICE}/portfolio/session`, {
      method: 'POST',
      headers: {
        Authorization:   `Bearer ${token}`,
        'Content-Type':  'application/json',
        'User-Agent':    'Mozilla/5.0 (compatible; NextJS/SSR)',
        'Accept':        'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Return auth service response as-is (status + body)
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });

  } catch (err) {
    console.error('[/api/analytics/session]', err);
    return NextResponse.json({ error: 'Session store failed' }, { status: 500 });
  }
}
