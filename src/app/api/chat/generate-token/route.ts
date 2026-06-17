import { NextRequest, NextResponse } from 'next/server';

const CHAT_SERVICE = process.env.NEXT_PUBLIC_CHAT_SERVICE_URL ?? 'https://chat-services.kuhandranchatbot.info';
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.kuhandranchatbot.info';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const upstream = await fetch(`${CHAT_SERVICE}/generate-token`, {
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
    console.error('[/api/chat/generate-token]', err);
    return NextResponse.json({ ok: false, error: 'Connection error. Please try again.' }, { status: 500 });
  }
}
