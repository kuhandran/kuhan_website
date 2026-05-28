'use client';

import React from 'react';
import { Sparkles, Mail, ArrowRight, Loader2 } from 'lucide-react';
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

  const clearToken = () => { setLocalToken(null); setCaptchaToken(null); };

  const handleToken = (token: string) => {
    const t = token?.trim() || null;
    setLocalToken(t);
    setCaptchaToken(t);
  };

  const getToken = () => {
    const widget = turnstileRef.current?.getResponse() as unknown as string | undefined;
    return localToken || captchaToken || widget?.trim() || null;
  };

  const isError = statusMsg && ['error','failed','invalid','expired','try again','please'].some(w =>
    statusMsg.toLowerCase().includes(w)
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #f8f7ff 0%, #f1f0ff 100%)' }}>

      {/* Hero section */}
      <div className="px-6 pt-8 pb-6 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">Start a conversation</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Enter your email to get instant access to Kuhandran&apos;s AI assistant
        </p>
      </div>

      {/* Form card */}
      <div className="mx-4 mb-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
          Your email address
        </label>

        {/* Email input */}
        <div className="relative mb-4">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); clearToken(); }}
            className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-800 placeholder-slate-400 bg-slate-50 transition-all"
            placeholder="you@example.com"
            disabled={loading}
            autoComplete="email"
          />
        </div>

        {/* Turnstile captcha */}
        <div className="mb-4 flex justify-center">
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
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              Turnstile site key not configured.
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="button"
          onClick={() => onSubmit(getToken())}
          disabled={!email || loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending code…
            </>
          ) : (
            <>
              Get verification code
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Status message */}
      {statusMsg && (
        <div className={`mx-4 mb-4 px-4 py-3 rounded-xl text-xs font-medium text-center ${
          isError
            ? 'bg-red-50 text-red-600 border border-red-100'
            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
        }`}>
          {statusMsg}
        </div>
      )}

      {/* Privacy note */}
      <p className="text-center text-[10px] text-slate-400 px-6 pb-6 mt-auto">
        Your email is only used for verification and is never shared.
      </p>
    </div>
  );
};

export default EmailStep;
