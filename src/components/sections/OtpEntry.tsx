import React from 'react';
import contentLabels from '../../../public/data/contentLabels.json';

interface OtpEntryProps {
  otp: string;
  setOtp: (otp: string) => void;
  loading: boolean;
  statusMsg: string | null;
  onVerifyOtp: () => void;
  onChangeEmail: () => void;
}

const OtpEntry: React.FC<OtpEntryProps> = ({
  otp,
  setOtp,
  loading,
  statusMsg,
  onVerifyOtp,
  onChangeEmail
}) => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
    <label className="block mb-2 text-sm font-medium text-slate-700">{contentLabels.chatbot.otp.label}</label>
    <input
      type="text"
      value={otp}
      onChange={e => setOtp(e.target.value)}
      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3 text-black"
      placeholder={contentLabels.chatbot.otp.placeholder}
      disabled={loading}
    />
    <button
      onClick={onVerifyOtp}
      disabled={!otp || loading}
      className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {loading ? contentLabels.chatbot.otp.verifying : contentLabels.chatbot.otp.verifyButton}
    </button>
    <button
      onClick={onChangeEmail}
      className="mt-2 text-xs text-blue-600 hover:underline"
      disabled={loading}
    >{contentLabels.chatbot.otp.changeEmail}</button>
    {statusMsg && <div className="mt-4 text-sm text-center text-slate-600">{statusMsg}</div>}
  </div>
);

export default OtpEntry;
