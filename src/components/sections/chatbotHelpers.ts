// Chatbot helper functions for state/session management
import { Dispatch, SetStateAction } from 'react';
import { contentLabels } from '../../lib/data/contentLabels';

export function resetToEmail(
  setJwt: Dispatch<SetStateAction<string | null>>,
  setSessionId: Dispatch<SetStateAction<string | null>>,
  setEmail: Dispatch<SetStateAction<string>>,
  setOtp: Dispatch<SetStateAction<string>>,
  setStep: Dispatch<SetStateAction<'email' | 'otp' | 'chat'>>,
  setStatusMsg: Dispatch<SetStateAction<string | null>>,
  setMessages: Dispatch<SetStateAction<any[]>>,
  setInactivitySeconds: Dispatch<SetStateAction<number>>,
  setCaptchaToken?: Dispatch<SetStateAction<string | null>>,
  msg?: string
) {
  setJwt(null);
  setSessionId(null);
  setEmail('');
  setOtp('');
  setStep('email');
  setStatusMsg(msg || null);
  setMessages([
    {
      id: '1',
      text: contentLabels.chatbot.initialMessage,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  setInactivitySeconds(300);
  if (setCaptchaToken) setCaptchaToken(null);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('chatbot_jwt');
    localStorage.removeItem('chatbot_session_id');
    localStorage.removeItem('chatbot_email');
  }
}

export function resetToOtp(
  setJwt: Dispatch<SetStateAction<string | null>>,
  setSessionId: Dispatch<SetStateAction<string | null>>,
  setOtp: Dispatch<SetStateAction<string>>,
  setStep: Dispatch<SetStateAction<'email' | 'otp' | 'chat'>>,
  setStatusMsg: Dispatch<SetStateAction<string | null>>,
  setInactivitySeconds: Dispatch<SetStateAction<number>>,
  msg?: string
) {
  setJwt(null);
  setSessionId(null);
  setOtp('');
  setStep('otp');
  setStatusMsg(msg || null);
  setInactivitySeconds(300);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('chatbot_jwt');
    localStorage.removeItem('chatbot_session_id');
  }
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('chatbot_jwt');
    localStorage.removeItem('chatbot_session_id');
    localStorage.removeItem('chatbot_email');
  }
}
