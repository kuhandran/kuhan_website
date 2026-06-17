import { NextRequest, NextResponse } from 'next/server';

const CHAT_SERVICE = process.env.NEXT_PUBLIC_CHAT_SERVICE_URL ?? 'https://chat-services.kuhandranchatbot.info';
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.kuhandranchatbot.info';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('Authorization') ?? '';

    const upstream = await fetch(`${CHAT_SERVICE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS/SSR)',
        'Origin': ORIGIN,
      },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    console.error('[/api/chat/send]', err);
    return NextResponse.json({ status: 500, error: 'Connection error. Please try again.' }, { status: 500 });
  }
}
