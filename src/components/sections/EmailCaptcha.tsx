import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface EmailCaptchaProps {
  email: string;
  setEmail: (email: string) => void;
  captchaToken: string | null;
  setCaptchaToken: (token: string | null) => void;
  loading: boolean;
  onRequestOtp: () => void;
}

const EmailCaptcha: React.FC<EmailCaptchaProps> = ({
  email,
  setEmail,
  captchaToken,
  setCaptchaToken,
  loading,
  onRequestOtp
}) => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
    <label className="block mb-2 text-sm font-medium text-slate-700">Enter your email to start chat</label>
    <input
      type="email"
      value={email}
      onChange={e => setEmail(e.target.value)}
      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3 text-black"
      placeholder="you@email.com"
      disabled={loading}
    />
    <div className="mb-3 flex justify-center">
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
        onChange={setCaptchaToken}
      />
    </div>
    <button
      onClick={onRequestOtp}
      disabled={!email || !captchaToken || loading}
      className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {loading ? 'Sending OTP...' : 'Request OTP'}
    </button>
  </div>
);

export default EmailCaptcha;
