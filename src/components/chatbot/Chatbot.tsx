'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { X, Volume2, VolumeX, MessageCircle, Sparkles } from 'lucide-react';
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

  const [avatar3D, setAvatar3D] = useState(false);
  useEffect(() => { setAvatar3D(true); }, []);

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

  // ── Lock body scroll when open on mobile ─────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

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
      {/* ── Hint bubble ──────────────────────────────────────────── */}
      {showHint && !isOpen && (
        <div className="fixed bottom-48 right-24 z-50 bg-white rounded-2xl px-4 py-2.5 shadow-xl text-sm font-medium text-gray-700 whitespace-nowrap pointer-events-none animate-scale-in">
          👋 Hi! Click me to chat
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white rotate-45 shadow-[1px_1px_2px_rgba(0,0,0,0.06)]" />
        </div>
      )}

      {/* ── Floating trigger ─────────────────────────────────────── */}
      {!isOpen && (
        <div className="fixed bottom-0 right-4 z-50 select-none flex flex-col items-center">
          <button
            onClick={e => { e.stopPropagation(); setIsMuted(m => !m); }}
            className={`mb-1 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium shadow-md transition-all ${
              isMuted ? 'bg-white/90 text-gray-500 border border-gray-200' : 'bg-indigo-500 text-white'
            }`}
            aria-label={isMuted ? 'Enable voice' : 'Mute voice'}
          >
            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            <span>{isMuted ? 'Voice off' : 'Voice on'}</span>
          </button>

          <div className="relative cursor-pointer" onClick={toggleOpen}>
            <span className="absolute top-3 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping z-10 pointer-events-none" />
            {avatar3D ? (
              <AvatarScene compact emotion={emotion} isSpeaking={isSpeaking} onError={() => setAvatar3D(false)} />
            ) : (
              <div className={`w-20 h-20 rounded-full overflow-hidden border-4 shadow-2xl transition-all duration-300 mb-2 ${isSpeaking ? 'border-indigo-400 scale-105' : 'border-white/80'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PROFILE_URL} alt="Kuhandran" className="w-full h-full object-cover" draggable={false} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Chat panel — full screen mobile / large card desktop ─── */}
      {isOpen && (
        <>
          {/* Backdrop (desktop: dim behind card) */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:bg-black/20"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="
            fixed z-50 flex flex-col bg-white overflow-hidden
            inset-0
            sm:inset-auto sm:bottom-6 sm:right-6
            sm:w-110 sm:h-170 sm:max-h-[calc(100dvh-3rem)]
            sm:rounded-3xl sm:shadow-2xl
            animate-scale-in
          ">
            {/* ── Header ─────────────────────────────────────────── */}
            <div
              className="shrink-0 px-5 py-4 sm:rounded-t-3xl"
              style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 100%)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={PROFILE_URL} alt="Kuhandran"
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white/20 shadow-lg"
                      draggable={false}
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#302b63] shadow" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-base text-white leading-tight tracking-tight">
                        {labels?.header?.title || "Kuhandran's Assistant"}
                      </p>
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    </div>
                    <p className="text-[11px] text-purple-200 flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                      Online · AI powered
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={e => { e.stopPropagation(); setIsMuted(m => !m); }}
                    className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-white/70 hover:text-white"
                    aria-label={isMuted ? 'Unmute voice' : 'Mute voice'}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-white/70 hover:text-white"
                    aria-label="Close chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Step content ───────────────────────────────────── */}
            <div className="flex-1 min-h-0 flex flex-col">
              {step === 'email' && (
                <EmailStep
                  email={email} setEmail={setEmail}
                  captchaToken={captchaToken} setCaptchaToken={setCaptchaToken}
                  loading={loading} statusMsg={statusMsg}
                  onSubmit={handleEmailSubmit} key="email"
                />
              )}
              {step === 'otp' && (
                <OtpStep
                  otp={otp} setOtp={setOtp}
                  loading={loading} statusMsg={statusMsg}
                  onVerify={handleOtpVerify}
                  onChangeEmail={() => { setStep('email'); setOtp(''); setStatusMsg(null); setCaptchaToken(null); }}
                />
              )}
              {step === 'chat' && (
                <ChatStep
                  messages={messages} inactivitySeconds={inactivitySeconds}
                  isTyping={isTyping} inputValue={inputValue}
                  setInputValue={setInputValue}
                  inputRef={inputRef as React.RefObject<HTMLInputElement>}
                  messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
                  onSend={handleSendMessage} onKeyDown={handleKeyDown}
                  quickActions={labels?.quickActions || []}
                  onQuickAction={action => { setInputValue(action); setTimeout(handleSendMessage, 100); }}
                  miniAvatar={miniAvatar}
                />
              )}
            </div>

            {/* ── Mobile bottom safe area ─────────────────────────── */}
            <div className="shrink-0 h-safe-bottom sm:hidden" />
          </div>
        </>
      )}

      {/* ── Mobile open-chat FAB (shown when closed, bottom-right) ─ */}
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="fixed bottom-6 right-6 z-40 sm:hidden flex items-center gap-2 px-5 py-3.5 rounded-2xl text-white font-semibold text-sm shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #302b63, #24243e)' }}
          aria-label="Open chat"
        >
          <MessageCircle className="w-5 h-5" />
          Chat with AI
        </button>
      )}
    </>
  );
}
