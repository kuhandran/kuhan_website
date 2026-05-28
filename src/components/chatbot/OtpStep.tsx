'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ShieldCheck, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { contentLabels as defaultLabels } from '@/lib/data/contentLabels';

interface OtpStepProps {
  otp: string;
  setOtp: (otp: string) => void;
  loading: boolean;
  statusMsg: string | null;
  onVerify: () => void;
  onChangeEmail: () => void;
}

const OTP_LENGTH = 6;

const OtpStep: React.FC<OtpStepProps> = ({ otp, setOtp, loading, statusMsg, onVerify, onChangeEmail }) => {
  const labels = defaultLabels?.chatbot?.otp;
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(OTP_LENGTH).fill(null));
  const [digits, setDigits] = useState<string[]>(() => {
    const arr = otp.split('').slice(0, OTP_LENGTH);
    while (arr.length < OTP_LENGTH) arr.push('');
    return arr;
  });

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    setOtp(digits.join(''));
  }, [digits, setOtp]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter' && digits.every(d => d)) onVerify();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.split('').concat(Array(OTP_LENGTH).fill('')).slice(0, OTP_LENGTH);
    setDigits(next);
    const lastFilled = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[lastFilled]?.focus();
  };

  const isFilled = digits.every(d => d !== '');
  const isError = statusMsg && ['error','failed','invalid','expired','try again','please'].some(w =>
    statusMsg.toLowerCase().includes(w)
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #f8f7ff 0%, #f1f0ff 100%)' }}>

      {/* Hero */}
      <div className="px-6 pt-8 pb-6 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">Check your inbox</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {labels?.label || "We sent a 6-digit code to your email"}
        </p>
      </div>

      {/* OTP card */}
      <div className="mx-4 mb-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <label className="block text-xs font-semibold text-slate-600 mb-4 text-center uppercase tracking-wide">
          Enter verification code
        </label>

        {/* 6 digit boxes */}
        <div className="flex gap-2 justify-center mb-5" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleDigitChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              disabled={loading}
              className={`w-10 h-12 text-center text-lg font-bold rounded-xl border-2 transition-all focus:outline-none text-slate-800 ${
                digit
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-slate-50'
              } focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50`}
            />
          ))}
        </div>

        {/* Verify button */}
        <button
          onClick={onVerify}
          disabled={!isFilled || loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {labels?.verifying || 'Verifying…'}
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              {labels?.verifyButton || 'Verify code'}
            </>
          )}
        </button>
      </div>

      {/* Status */}
      {statusMsg && (
        <div className={`mx-4 mb-3 px-4 py-3 rounded-xl text-xs font-medium text-center ${
          isError
            ? 'bg-red-50 text-red-600 border border-red-100'
            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
        }`}>
          {statusMsg}
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-center gap-4 px-6 pb-6 mt-auto">
        <button
          onClick={onChangeEmail}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {labels?.changeEmail || 'Change email'}
        </button>
        <span className="text-slate-200">|</span>
        <button
          onClick={onChangeEmail}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 font-medium transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Resend code
        </button>
      </div>
    </div>
  );
};

export default OtpStep;
