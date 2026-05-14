'use client';

import React from 'react';
import { Turnstile } from 'react-turnstile';
import type { BoundTurnstileObject } from 'react-turnstile';

interface EmailCaptchaProps {
  email: string;
  setEmail: (email: string) => void;
  captchaToken: string | null;
  setCaptchaToken: (token: string | null) => void;
  loading: boolean;
  statusMsg: string | null;
  onRequestOtp: (captchaToken?: string | null) => void;
}

const EmailCaptcha: React.FC<EmailCaptchaProps> = ({
  email,
  setEmail,
  captchaToken,
  setCaptchaToken,
  loading,
  statusMsg,
  onRequestOtp
}) => {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const turnstileRef = React.useRef<BoundTurnstileObject | null>(null);
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(captchaToken);

  const clearTurnstileToken = () => {
    setTurnstileToken(null);
    setCaptchaToken(null);
  };

  const handleTurnstileToken = (token: string) => {
    const nextToken = token?.trim() || null;
    setTurnstileToken(nextToken);
    setCaptchaToken(nextToken);
  };

  const getLatestTurnstileToken = () => {
    const widgetToken = turnstileRef.current?.getResponse() as unknown as string | undefined;
    return turnstileToken || captchaToken || widgetToken?.trim() || null;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
      <label className="block mb-2 text-sm font-medium text-slate-700">Enter your email to start chat</label>
      <input
        type="email"
        value={email}
        onChange={e => {
          setEmail(e.target.value);
          clearTurnstileToken();
        }}
        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3 text-black"
        placeholder="you@email.com"
        disabled={loading}
      />
      <div className="mb-3 flex justify-center">
        {turnstileSiteKey ? (
          <Turnstile
            sitekey={turnstileSiteKey}
            onLoad={(_widgetId, boundTurnstile) => {
              turnstileRef.current = boundTurnstile;
            }}
            onVerify={(token, boundTurnstile) => {
              turnstileRef.current = boundTurnstile;
              handleTurnstileToken(token);
            }}
            onSuccess={(token, _preClearanceObtained, boundTurnstile) => {
              turnstileRef.current = boundTurnstile;
              handleTurnstileToken(token);
            }}
            onExpire={clearTurnstileToken}
            onError={clearTurnstileToken}
            onTimeout={clearTurnstileToken}
            refreshExpired="auto"
            theme="light"
          />
        ) : (
          <div className="text-sm text-red-600 text-center">
            Turnstile site key is not configured.
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onRequestOtp(getLatestTurnstileToken())}
        disabled={!email || loading}
        className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? 'Sending OTP...' : 'Request OTP'}
      </button>
      {statusMsg && <div className="mt-4 text-sm text-center text-slate-600">{statusMsg}</div>}
    </div>
  );
};

export default EmailCaptcha;
