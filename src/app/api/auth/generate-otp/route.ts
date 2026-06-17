import { NextRequest, NextResponse } from 'next/server';

const AUTH_SERVICE = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ?? 'https://auth-services.kuhandranchatbot.info';
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.kuhandranchatbot.info';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const upstream = await fetch(`${AUTH_SERVICE}/generate-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS/SSR)',
        'Origin': ORIGIN,
      },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    console.error('[/api/auth/generate-otp]', err);
    return NextResponse.json({ ok: false, error: 'Connection error. Please try again.' }, { status: 500 });
  }
}
