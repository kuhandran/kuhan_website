'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { X, Volume2, VolumeX } from 'lucide-react';
import { contentLabels as defaultLabels } from '@/lib/data/contentLabels';
import { sendOtp, verifyOtp } from '@/services/auth.service';
import { generateToken, sendMessage } from '@/services/chat.service';
import EmailStep from './EmailStep';
import OtpStep from './OtpStep';
import ChatStep from './ChatStep';
import { AvatarWidget } from './AvatarWidget';
import { useSpeech } from './hooks/useSpeech';
import { detectEmotion } from './utils/detectEmotion';
import type { ChatbotStep, ChatMessage, AvatarEmotion } from './types';

const AvatarScene = dynamic(() => import('./AvatarScene.client'), {
  ssr: false,
  loading: () => null,
});

const PROFILE_URL = 'https://static.kuhandranchatbot.info/public/image/profile.webp';
const DEFAULT_GREETING = "Hi! I'm Kuhandran's AI assistant. Ask me anything about his experience, skills, or projects!";

export function Chatbot() {
  const labels = defaultLabels?.chatbot;

  const [isOpen, setIsOpen]       = useState(false);
  const [step, setStep]           = useState<ChatbotStep>('email');
  const [email, setEmail]         = useState('');
  const [otp, setOtp]             = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);

  const [accessToken, setAccessToken]   = useState<string | null>(null);
  const [cfSessionId, setCfSessionId]   = useState<string | null>(null);
  const [messages, setMessages]         = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue]     = useState('');
  const [isTyping, setIsTyping]         = useState(false);
  const [inactivitySeconds, setInactivitySeconds] = useState(300);

  const [emotion, setEmotion]   = useState<AvatarEmotion>('idle');
  const [isMuted, setIsMuted]   = useState(true);
  const { speak, cancel, isSpeaking } = useSpeech();

  // true = 3D avatar trigger  |  false = photo circle trigger
  const [avatar3D, setAvatar3D] = useState(false); // start false (SSR safe), flip after mount
  useEffect(() => { setAvatar3D(true); }, []);

  // Hint bubble
  const [showHint, setShowHint] = useState(false);
  useEffect(() => {
    const show = setTimeout(() => setShowHint(true), 1400);
    const hide = setTimeout(() => setShowHint(false), 6000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  const messagesEndRef      = useRef<HTMLDivElement | null>(null);
  const inputRef            = useRef<HTMLInputElement | null>(null);
  const idleTimerRef        = useRef<number | null>(null);
  const inactivityTimerRef  = useRef<number | null>(null);
  const lastActivityRef     = useRef<number>(Date.now());

  // ── Timers ────────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== 'chat') return;
    if (inactivitySeconds <= 0) { resetSession('Session timed out.'); return; }
    const t = setInterval(() => setInactivitySeconds(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [step, inactivitySeconds]);

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

  useEffect(() => {
    if (step !== 'chat') return;
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = window.setTimeout(() => resetSession('Session expired due to inactivity.'), 300_000);
    return () => { if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current); };
  }, [messages, step]);

  // ── Avatar emotion effects ────────────────────────────────────────
  useEffect(() => {
    if (step === 'email') { setEmotion('idle'); cancel(); }
    else if (step === 'otp') { setEmotion('talking'); speak("I've sent a verification code to your email.", isMuted); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => { if (loading) { setEmotion('thinking'); cancel(); } }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (step !== 'chat') return;
    if (isTyping) { setEmotion('thinking'); cancel(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping, step]);

  useEffect(() => {
    if (step !== 'chat' || messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.sender !== 'bot') return;
    const isGreeting = messages.length === 1 && last.id === '1';
    const e = isGreeting ? 'happy' : detectEmotion(last.text);
    setEmotion(e === 'alert' ? 'alert' : e === 'happy' ? 'happy' : 'talking');
    speak(last.text, isMuted);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    if (!statusMsg) return;
    const lower = statusMsg.toLowerCase();
    if (['error','failed','invalid','expired','try again','please'].some(w => lower.includes(w))) setEmotion('alert');
  }, [statusMsg]);

  useEffect(() => {
    if (!isSpeaking && step === 'chat' && !isTyping) setEmotion('idle');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpeaking]);

  useEffect(() => { if (!isOpen) cancel(); }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ─────────────────────────────────────────────────────
  function resetSession(msg?: string) {
    setAccessToken(null); setCfSessionId(null); setOtp('');
    setStep('email'); setInactivitySeconds(300); setStatusMsg(msg || null);
  }

  async function handleEmailSubmit(tokenOverride?: string | null) {
    const turnstileToken = tokenOverride || captchaToken;
    const identifier = email.trim();
    setStatusMsg(null);
    if (!identifier) return setStatusMsg('Please enter your email.');
    if (!turnstileToken) return setStatusMsg(labels?.messages?.captchaRequired || 'Please complete the captcha.');
    setLoading(true);
    const result = await sendOtp(identifier, turnstileToken);
    if (result.ok) { setStep('otp'); setStatusMsg(result.message || 'OTP sent! Please check your email.'); }
    else { setCaptchaToken(null); setStatusMsg(result.error || result.message || 'Failed to send OTP.'); }
    setLoading(false);
  }

  async function handleOtpVerify() {
    setStatusMsg(null); setLoading(true);
    const identifier = email.trim();
    const otpResult = await verifyOtp(identifier, otp.trim());
    if (!otpResult.ok || !otpResult.sessionToken) {
      setStatusMsg(otpResult.error || otpResult.message || 'Invalid OTP. Please try again.');
      setLoading(false); return;
    }
    const tokenResult = await generateToken(identifier, otpResult.sessionToken);
    if (tokenResult.ok && tokenResult.accessToken) {
      setAccessToken(tokenResult.accessToken); setCfSessionId(null);
      setMessages([{ id: '1', text: labels?.initialMessage || DEFAULT_GREETING, sender: 'bot', timestamp: new Date() }]);
      setInactivitySeconds(300); setStep('chat'); setStatusMsg(null);
    } else {
      setStatusMsg(tokenResult.error || tokenResult.message || 'Authentication failed.');
    }
    setLoading(false);
  }

  async function handleSendMessage() {
    if (!inputValue.trim() || !accessToken) return;
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    const userMsg: ChatMessage = { id: Date.now().toString(), text: inputValue, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue(''); setIsTyping(true);
    const result = await sendMessage(accessToken, userMsg.text, cfSessionId ?? undefined);
    if (result.status === 401) { resetSession(labels?.messages?.sessionExpired || 'Session expired.'); setIsTyping(false); return; }
    const botText = result.response || result.error || labels?.messages?.noResponse || 'No response received.';
    if (result.sessionId) setCfSessionId(result.sessionId);
    setIsTyping(false);
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: botText, sender: 'bot', timestamp: new Date() }]);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const miniAvatar = <AvatarWidget emotion={emotion} size="mini" />;

  const toggleOpen = () => { setIsOpen(o => !o); setShowHint(false); };

  // ════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════
  return (
    <>
      {/* ── "Click to chat" hint ─────────────────────────────────── */}
      {showHint && !isOpen && (
        <div className="fixed bottom-48 right-24 z-50 bg-white rounded-2xl px-4 py-2.5 shadow-xl text-sm font-medium text-gray-700 whitespace-nowrap pointer-events-none animate-scale-in">
          👋 Hi! Click me to chat
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white rotate-45 shadow-[1px_1px_2px_rgba(0,0,0,0.06)]" />
        </div>
      )}

      {/* ── Avatar trigger (3D or photo circle) ─────────────────── */}
      <div className="fixed bottom-0 right-4 z-50 select-none flex flex-col items-center">
        {/* Sound toggle — always visible on the avatar */}
        <button
          onClick={e => { e.stopPropagation(); setIsMuted(m => !m); }}
          className={`mb-1 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium shadow-md transition-all ${
            isMuted
              ? 'bg-white/90 text-gray-500 border border-gray-200'
              : 'bg-blue-500 text-white'
          }`}
          aria-label={isMuted ? 'Enable voice' : 'Mute voice'}
        >
          {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          <span>{isMuted ? 'Voice off' : 'Voice on'}</span>
        </button>

        {/* Trigger: 3D avatar OR photo circle */}
        <div className="relative cursor-pointer" onClick={toggleOpen}>
          {/* Notification dot */}
          {!isOpen && (
            <span className="absolute top-3 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping z-10 pointer-events-none" />
          )}

          {avatar3D ? (
            /* ── PATHWAY A: 3D avatar ── */
            <AvatarScene
              compact
              emotion={emotion}
              isSpeaking={isSpeaking}
              onError={() => setAvatar3D(false)}
            />
          ) : (
            /* ── PATHWAY B: Photo circle ── */
            <div className={`w-20 h-20 rounded-full overflow-hidden border-4 shadow-2xl transition-all duration-300 mb-2 ${
              isSpeaking ? 'border-blue-400 scale-105' : 'border-white/80'
            }`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PROFILE_URL} alt="Kuhandran" className="w-full h-full object-cover" draggable={false} />
            </div>
          )}
        </div>
      </div>

      {/* ── Modern speech bubble chat panel ─────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-40 right-24 z-50 w-80 max-w-[calc(100vw-7rem)] bg-white rounded-2xl shadow-2xl flex flex-col animate-scale-in overflow-hidden">

          {/* Header */}
          <div className="bg-linear-to-br from-blue-600 via-blue-500 to-purple-600 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PROFILE_URL} alt="Kuhandran" className="w-9 h-9 rounded-full object-cover border-2 border-white/50" draggable={false} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white leading-tight">{labels?.header?.title || "Kuhandran's Assistant"}</p>
                  <p className="text-[10px] text-white/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                    Online · AI powered
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={e => { e.stopPropagation(); setIsMuted(m => !m); }}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white"
                  aria-label={isMuted ? 'Unmute voice' : 'Mute voice'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={e => { e.stopPropagation(); setIsOpen(false); }}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat steps */}
          {step === 'email' && (
            <EmailStep email={email} setEmail={setEmail} captchaToken={captchaToken}
              setCaptchaToken={setCaptchaToken} loading={loading} statusMsg={statusMsg}
              onSubmit={handleEmailSubmit} key="email" />
          )}
          {step === 'otp' && (
            <OtpStep otp={otp} setOtp={setOtp} loading={loading} statusMsg={statusMsg}
              onVerify={handleOtpVerify}
              onChangeEmail={() => { setStep('email'); setOtp(''); setStatusMsg(null); setCaptchaToken(null); }} />
          )}
          {step === 'chat' && (
            <ChatStep messages={messages} inactivitySeconds={inactivitySeconds} isTyping={isTyping}
              inputValue={inputValue} setInputValue={setInputValue}
              inputRef={inputRef as React.RefObject<HTMLInputElement>}
              messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
              onSend={handleSendMessage} onKeyDown={handleKeyDown}
              quickActions={labels?.quickActions || []}
              onQuickAction={action => { setInputValue(action); setTimeout(handleSendMessage, 100); }}
              miniAvatar={miniAvatar} />
          )}

          {/* Speech bubble tail */}
          <div className="absolute -bottom-3 right-6 w-5 h-5 bg-white rotate-45 shadow-[2px_2px_4px_rgba(0,0,0,0.08)]" />
        </div>
      )}
    </>
  );
}
