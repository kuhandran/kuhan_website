'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Bot, X } from 'lucide-react';
import { contentLabels as defaultLabels } from '@/lib/data/contentLabels';
import { sendOtp, verifyOtp } from '@/services/auth.service';
import { generateToken, sendMessage } from '@/services/chat.service';
import EmailStep from './EmailStep';
import OtpStep from './OtpStep';
import ChatStep from './ChatStep';
import type { ChatbotStep, ChatMessage } from './types';

const DEFAULT_GREETING = "Hi! I'm Kuhandran's AI assistant. Ask me anything about his experience, skills, or projects!";

export function Chatbot() {
  const labels = defaultLabels?.chatbot;

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<ChatbotStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Chat state — tokens in memory only
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [cfSessionId, setCfSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [inactivitySeconds, setInactivitySeconds] = useState(300);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const inactivityTimerRef = useRef<number | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Countdown visible timer
  useEffect(() => {
    if (step !== 'chat') return;
    if (inactivitySeconds <= 0) { resetSession('Session timed out.'); return; }
    const t = setInterval(() => setInactivitySeconds(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [step, inactivitySeconds]);

  // Idle timeout (no user interaction)
  useEffect(() => {
    if (step !== 'chat') return;
    const arm = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => resetSession('Session expired due to inactivity.'), 300_000);
    };
    const onActivity = () => { lastActivityRef.current = Date.now(); arm(); };
    document.addEventListener('keydown', onActivity);
    document.addEventListener('mousedown', onActivity);
    arm();
    return () => {
      document.removeEventListener('keydown', onActivity);
      document.removeEventListener('mousedown', onActivity);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [step]);

  // Inactivity timeout (no messages sent)
  useEffect(() => {
    if (step !== 'chat') return;
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = window.setTimeout(() => resetSession('Session expired due to inactivity.'), 300_000);
    return () => { if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current); };
  }, [messages, step]);

  function resetSession(msg?: string) {
    setAccessToken(null);
    setCfSessionId(null);
    setOtp('');
    setStep('email');
    setInactivitySeconds(300);
    setStatusMsg(msg || null);
  }

  // Step 1: send OTP
  async function handleEmailSubmit(tokenOverride?: string | null) {
    const turnstileToken = tokenOverride || captchaToken;
    const identifier = email.trim();
    setStatusMsg(null);
    if (!identifier) return setStatusMsg('Please enter your email.');
    if (!turnstileToken) return setStatusMsg(labels?.messages?.captchaRequired || 'Please complete the captcha.');

    setLoading(true);
    const result = await sendOtp(identifier, turnstileToken);
    if (result.ok) {
      setStep('otp');
      setStatusMsg(result.message || 'OTP sent! Please check your email.');
    } else {
      setCaptchaToken(null);
      setStatusMsg(result.error || result.message || 'Failed to send OTP. Please try again.');
    }
    setLoading(false);
  }

  // Step 2: verify OTP → get access token
  async function handleOtpVerify() {
    setStatusMsg(null);
    setLoading(true);
    const identifier = email.trim();

    const otpResult = await verifyOtp(identifier, otp.trim());
    if (!otpResult.ok || !otpResult.sessionToken) {
      setStatusMsg(otpResult.error || otpResult.message || 'Invalid OTP. Please try again.');
      setLoading(false);
      return;
    }

    const tokenResult = await generateToken(identifier, otpResult.sessionToken);
    if (tokenResult.ok && tokenResult.accessToken) {
      setAccessToken(tokenResult.accessToken);
      setCfSessionId(null);
      setMessages([{ id: '1', text: labels?.initialMessage || DEFAULT_GREETING, sender: 'bot', timestamp: new Date() }]);
      setInactivitySeconds(300);
      setStep('chat');
      setStatusMsg(null);
    } else {
      setStatusMsg(tokenResult.error || tokenResult.message || 'Authentication failed. Please try again.');
    }
    setLoading(false);
  }

  // Step 3: chat
  async function handleSendMessage() {
    if (!inputValue.trim() || !accessToken) return;
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    const userMsg: ChatMessage = { id: Date.now().toString(), text: inputValue, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const result = await sendMessage(accessToken, userMsg.text, cfSessionId ?? undefined);

    if (result.status === 401) {
      resetSession(labels?.messages?.sessionExpired || 'Session expired. Please log in again.');
      setIsTyping(false);
      return;
    }

    const botText = result.response || result.error || labels?.messages?.noResponse || 'No response received.';
    if (result.sessionId) setCfSessionId(result.sessionId);

    setIsTyping(false);
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: botText, sender: 'bot', timestamp: new Date() }]);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(o => !o)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
        }`}
        aria-label={labels?.toggleChat || 'Toggle chat'}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white animate-pulse" />}
        {!isOpen && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-10rem)] bg-white rounded-2xl shadow-2xl flex flex-col animate-scale-in">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{labels?.header?.title || 'Chat with me'}</h3>
              <p className="text-xs text-white/80">{labels?.header?.subtitle || 'Ask me anything'}</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors" aria-label="Close chat">
              <X className="w-5 h-5" />
            </button>
          </div>

          {step === 'email' && (
            <EmailStep
              email={email}
              setEmail={setEmail}
              captchaToken={captchaToken}
              setCaptchaToken={setCaptchaToken}
              loading={loading}
              statusMsg={statusMsg}
              onSubmit={handleEmailSubmit}
              key="email"
            />
          )}
          {step === 'otp' && (
            <OtpStep
              otp={otp}
              setOtp={setOtp}
              loading={loading}
              statusMsg={statusMsg}
              onVerify={handleOtpVerify}
              onChangeEmail={() => { setStep('email'); setOtp(''); setStatusMsg(null); setCaptchaToken(null); }}
            />
          )}
          {step === 'chat' && (
            <ChatStep
              messages={messages}
              inactivitySeconds={inactivitySeconds}
              isTyping={isTyping}
              inputValue={inputValue}
              setInputValue={setInputValue}
              inputRef={inputRef as React.RefObject<HTMLInputElement>}
              messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
              onSend={handleSendMessage}
              onKeyPress={handleKeyPress}
              quickActions={labels?.quickActions || []}
              onQuickAction={action => { setInputValue(action); setTimeout(handleSendMessage, 100); }}
            />
          )}
        </div>
      )}
    </>
  );
}
