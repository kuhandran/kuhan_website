export interface TokenResult {
  ok: boolean;
  accessToken?: string;
  error?: string;
  message?: string;
}

export interface ChatResult {
  status: number;
  response?: string;
  sessionId?: string;
  error?: string;
}

export async function generateToken(identifier: string, sessionToken: string): Promise<TokenResult> {
  try {
    const res = await fetch('/api/chat/generate-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, sessionToken }),
    });
    const data = await res.json();
    return { ok: res.ok, ...data };
  } catch {
    return { ok: false, error: 'Connection error. Please try again.' };
  }
}

export async function sendMessage(
  accessToken: string,
  message: string,
  sessionId?: string
): Promise<ChatResult> {
  try {
    const res = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ message, ...(sessionId ? { sessionId } : {}) }),
    });
    const data = await res.json();
    return { status: res.status, ...data };
  } catch {
    return { status: 0, error: 'Connection error. Please try again.' };
  }
}
