
'use client';

import { useState, useRef, useEffect } from 'react';
import EmailCaptcha from './EmailCaptcha';
import OtpEntry from './OtpEntry';
import ChatProcess from './ChatProcess';
import type { ChatbotStep } from './ChatbotState';
import { MessageCircle, Bot, X } from 'lucide-react';
import { contentLabels as defaultLabels } from '../../lib/data/contentLabels';

const AUTH_SERVICE_BASE_URL = 'https://auth-services.kuhandranchatbot.info';
const CHAT_SERVICE_BASE_URL = 'https://chat-services.kuhandranchatbot.info';

const defaultMessage = "Hi! I'm Kuhandran's AI assistant. Ask me anything about his experience, skills, or projects!";

const defaultContentLabels = {
  chatbot: {
    initialMessage: defaultMessage,
    messages: {
      sessionExpired: 'Session expired. Please log in again.',
      noResponse: 'Sorry, I did not understand the response.',
      connectionError: "Sorry, I'm having trouble connecting.",
      captchaRequired: 'Please complete the captcha.',
      otpSent: 'OTP sent! Please check your email.',
      otpFailed: 'Failed to send OTP. Please try again.',
      verifySuccess: 'Verified! Starting chat...',
    },
  }
};

export function Chatbot() {
  const contentLabels = defaultLabels || defaultContentLabels;

  interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inactivitySeconds, setInactivitySeconds] = useState(300);
  const [isTyping, setIsTyping] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<ChatbotStep>('email');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // Tokens kept in memory only (not localStorage)
  const [accessToken, setAccessToken] = useState<string | null>(null);
  // CF chat session ID — passed back to /chat for conversation context
  const [cfSessionId, setCfSessionId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const idleTimeoutRef = useRef<number | null>(null);
  const inactivityTimeoutRef = useRef<number | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Inactivity countdown (visible timer)
  useEffect(() => {
    if (step !== 'chat') return;
    if (inactivitySeconds <= 0) {
      resetSession('Session timed out. Please log in again.');
      return;
    }
    const interval = setInterval(() => {
      setInactivitySeconds(s => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, inactivitySeconds]);

  // Idle timeout: reset after 5 min of no user interaction
  useEffect(() => {
    if (step !== 'chat') return;
    const resetIdle = () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = window.setTimeout(() => {
        resetSession('Session expired due to inactivity.');
      }, 300000);
    };
    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
      resetIdle();
    };
    document.addEventListener('keydown', handleUserActivity);
    document.addEventListener('mousedown', handleUserActivity);
    const chatWindow = document.querySelector('.fixed.bottom-24.right-6');
    if (chatWindow) chatWindow.addEventListener('scroll', handleUserActivity);
    resetIdle();
    return () => {
      document.removeEventListener('keydown', handleUserActivity);
      document.removeEventListener('mousedown', handleUserActivity);
      if (chatWindow) chatWindow.removeEventListener('scroll', handleUserActivity);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [step]);

  // Inactivity timeout: reset if no message sent for 5 min
  useEffect(() => {
    if (step !== 'chat') return;
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    inactivityTimeoutRef.current = window.setTimeout(() => {
      resetSession('Session expired due to inactivity.');
    }, 5 * 60 * 1000);
    return () => {
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    };
  }, [messages, step]);

  function resetSession(msg?: string) {
    setAccessToken(null);
    setCfSessionId(null);
    setOtp('');
    setStep('email');
    setInactivitySeconds(300);
    setStatusMsg(msg || null);
  }

  // Step 1: Send OTP
  async function handleRequestOtp(tokenOverride?: string | null) {
    const turnstileToken = tokenOverride || captchaToken;
    const identifier = email.trim();

    setStatusMsg(null);
    if (!identifier) {
      setStatusMsg('Please enter your email.');
      return;
    }
    if (!turnstileToken) {
      setStatusMsg(contentLabels?.chatbot?.messages?.captchaRequired || defaultContentLabels.chatbot.messages.captchaRequired);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${AUTH_SERVICE_BASE_URL}/generate-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, captchaToken: turnstileToken })
      });
      const data = await res.json();
      if (res.ok) {
        setStep('otp');
        setStatusMsg(data.message || contentLabels?.chatbot?.messages?.otpSent || defaultContentLabels.chatbot.messages.otpSent);
      } else {
        setCaptchaToken(null);
        setStatusMsg(data.error || data.message || contentLabels?.chatbot?.messages?.otpFailed || defaultContentLabels.chatbot.messages.otpFailed);
      }
    } catch {
      setCaptchaToken(null);
      setStatusMsg(contentLabels?.chatbot?.messages?.connectionError || defaultContentLabels.chatbot.messages.connectionError);
    }
    setLoading(false);
  }

  // Step 2: Verify OTP → Step 3: Exchange sessionToken for accessToken
  async function handleVerifyOtp() {
    setStatusMsg(null);
    setLoading(true);
    try {
      const identifier = email.trim();

      // Verify OTP
      const otpRes = await fetch(`${AUTH_SERVICE_BASE_URL}/authorise-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp: otp.trim() })
      });
      const otpData = await otpRes.json();

      if (!otpRes.ok) {
        setStatusMsg(otpData.error || otpData.message || 'Invalid OTP. Please try again.');
        setLoading(false);
        return;
      }

      const sessionToken = otpData.sessionToken;
      if (!sessionToken) {
        setStatusMsg('Verification failed. Please try again.');
        setLoading(false);
        return;
      }

      // Exchange sessionToken for accessToken
      const tokenRes = await fetch(`${CHAT_SERVICE_BASE_URL}/generate-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, sessionToken })
      });
      const tokenData = await tokenRes.json();

      if (tokenRes.ok && tokenData.accessToken) {
        setAccessToken(tokenData.accessToken);
        setCfSessionId(null);
        setMessages([{
          id: '1',
          text: contentLabels?.chatbot?.initialMessage || defaultMessage,
          sender: 'bot',
          timestamp: new Date()
        }]);
        setInactivitySeconds(300);
        setStep('chat');
        setStatusMsg(null);
      } else {
        setStatusMsg(tokenData.error || tokenData.message || 'Authentication failed. Please try again.');
      }
    } catch {
      setStatusMsg(contentLabels?.chatbot?.messages?.connectionError || defaultContentLabels.chatbot.messages.connectionError);
    }
    setLoading(false);
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    let botResponse = '';
    try {
      if (!accessToken) {
        botResponse = contentLabels?.chatbot?.messages?.sessionExpired || defaultContentLabels.chatbot.messages.sessionExpired;
      } else {
        const doChat = (token: string) =>
          fetch(`${CHAT_SERVICE_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              message: userMessage.text,
              ...(cfSessionId ? { sessionId: cfSessionId } : {})
            })
          });

        const response = await doChat(accessToken);

        // On 401, reset to email — no silent refresh possible without OTP flow
        if (response.status === 401) {
          resetSession(contentLabels?.chatbot?.messages?.sessionExpired || defaultContentLabels.chatbot.messages.sessionExpired);
          setIsTyping(false);
          return;
        }

        const data = await response.json();
        if (data.response) {
          botResponse = data.response;
          if (data.sessionId) setCfSessionId(data.sessionId);
        } else if (data.error) {
          botResponse = data.error;
        } else {
          botResponse = contentLabels?.chatbot?.messages?.noResponse || defaultContentLabels.chatbot.messages.noResponse;
        }
      }
    } catch {
      botResponse = contentLabels?.chatbot?.messages?.connectionError || defaultContentLabels.chatbot.messages.connectionError;
    }

    setIsTyping(false);
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
        }`}
        aria-label={contentLabels?.chatbot?.toggleChat || 'Toggle chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white animate-pulse" />
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-10rem)] bg-white rounded-2xl shadow-2xl flex flex-col animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{contentLabels?.chatbot?.header?.title || 'Chat with me'}</h3>
              <p className="text-xs text-white/80">{contentLabels?.chatbot?.header?.subtitle || 'Ask me anything'}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label={contentLabels?.chatbot?.closeChat || 'Close chat'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {step === 'email' && (
            <EmailCaptcha
              email={email}
              setEmail={setEmail}
              captchaToken={captchaToken}
              setCaptchaToken={setCaptchaToken}
              loading={loading}
              statusMsg={statusMsg}
              onRequestOtp={handleRequestOtp}
              key={step}
            />
          )}
          {step === 'otp' && (
            <OtpEntry
              otp={otp}
              setOtp={setOtp}
              loading={loading}
              statusMsg={statusMsg}
              onVerifyOtp={handleVerifyOtp}
              onChangeEmail={() => {
                setStep('email');
                setOtp('');
                setStatusMsg(null);
                setCaptchaToken(null);
              }}
            />
          )}
          {step === 'chat' && (
            <ChatProcess
              messages={messages}
              inactivitySeconds={inactivitySeconds}
              isTyping={isTyping}
              inputValue={inputValue}
              setInputValue={setInputValue}
              inputRef={inputRef as React.RefObject<HTMLInputElement>}
              messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
              handleSendMessage={handleSendMessage}
              handleKeyPress={handleKeyPress}
              quickActions={contentLabels?.chatbot?.quickActions || []}
              setQuickAction={(action) => {
                setInputValue(action);
                setTimeout(() => handleSendMessage(), 100);
              }}
            />
          )}
        </div>
      )}
    </>
  );
}
