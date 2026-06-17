export interface OtpResult {
  ok: boolean;
  message?: string;
  error?: string;
}

export interface VerifyOtpResult {
  ok: boolean;
  sessionToken?: string;
  error?: string;
  message?: string;
}

export async function sendOtp(identifier: string, captchaToken: string): Promise<OtpResult> {
  try {
    const res = await fetch('/api/auth/generate-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, captchaToken }),
    });
    const data = await res.json();
    return { ok: res.ok, ...data };
  } catch {
    return { ok: false, error: 'Connection error. Please try again.' };
  }
}

export async function verifyOtp(identifier: string, otp: string): Promise<VerifyOtpResult> {
  try {
    const res = await fetch('/api/auth/authorise-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, otp }),
    });
    const data = await res.json();
    return { ok: res.ok, ...data };
  } catch {
    return { ok: false, error: 'Connection error. Please try again.' };
  }
}
