'use client';

import React from 'react';
import { Turnstile } from 'react-turnstile';
import type { BoundTurnstileObject } from 'react-turnstile';

interface EmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  captchaToken: string | null;
  setCaptchaToken: (token: string | null) => void;
  loading: boolean;
  statusMsg: string | null;
  onSubmit: (captchaToken?: string | null) => void;
}

const EmailStep: React.FC<EmailStepProps> = ({
  email,
  setEmail,
  captchaToken,
  setCaptchaToken,
  loading,
  statusMsg,
  onSubmit,
}) => {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const turnstileRef = React.useRef<BoundTurnstileObject | null>(null);
  const [localToken, setLocalToken] = React.useState<string | null>(captchaToken);

  const clearToken = () => {
    setLocalToken(null);
    setCaptchaToken(null);
  };

  const handleToken = (token: string) => {
    const t = token?.trim() || null;
    setLocalToken(t);
    setCaptchaToken(t);
  };

  const getToken = () => {
    const widget = turnstileRef.current?.getResponse() as unknown as string | undefined;
    return localToken || captchaToken || widget?.trim() || null;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
      <label className="block mb-2 text-sm font-medium text-slate-700">
        Enter your email to start chat
      </label>
      <input
        type="email"
        value={email}
        onChange={e => { setEmail(e.target.value); clearToken(); }}
        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3 text-black"
        placeholder="you@email.com"
        disabled={loading}
      />
      <div className="mb-3 flex justify-center">
        {siteKey ? (
          <Turnstile
            sitekey={siteKey}
            onLoad={(_id, bound) => { turnstileRef.current = bound; }}
            onVerify={(token, bound) => { turnstileRef.current = bound; handleToken(token); }}
            onSuccess={(token, _pre, bound) => { turnstileRef.current = bound; handleToken(token); }}
            onExpire={clearToken}
            onError={clearToken}
            onTimeout={clearToken}
            refreshExpired="auto"
            theme="light"
          />
        ) : (
          <p className="text-sm text-red-600">Turnstile site key not configured.</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onSubmit(getToken())}
        disabled={!email || loading}
        className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? 'Sending OTP...' : 'Request OTP'}
      </button>
      {statusMsg && (
        <p className="mt-4 text-sm text-center text-slate-600">{statusMsg}</p>
      )}
    </div>
  );
};

export default EmailStep;
