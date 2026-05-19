import React from 'react';
import { contentLabels as defaultLabels } from '@/lib/data/contentLabels';

interface OtpStepProps {
  otp: string;
  setOtp: (otp: string) => void;
  loading: boolean;
  statusMsg: string | null;
  onVerify: () => void;
  onChangeEmail: () => void;
}

const OtpStep: React.FC<OtpStepProps> = ({ otp, setOtp, loading, statusMsg, onVerify, onChangeEmail }) => {
  const labels = defaultLabels?.chatbot?.otp;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
      <label className="block mb-2 text-sm font-medium text-slate-700">
        {labels?.label || 'Enter the OTP sent to your email'}
      </label>
      <input
        type="text"
        value={otp}
        onChange={e => setOtp(e.target.value)}
        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3 text-black"
        placeholder={labels?.placeholder || '6-digit OTP'}
        disabled={loading}
      />
      <button
        onClick={onVerify}
        disabled={!otp || loading}
        className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (labels?.verifying || 'Verifying...') : (labels?.verifyButton || 'Verify OTP')}
      </button>
      <button
        onClick={onChangeEmail}
        disabled={loading}
        className="mt-2 text-xs text-blue-600 hover:underline"
      >
        {labels?.changeEmail || 'Change email'}
      </button>
      {statusMsg && <p className="mt-4 text-sm text-center text-slate-600">{statusMsg}</p>}
    </div>
  );
};

export default OtpStep;
