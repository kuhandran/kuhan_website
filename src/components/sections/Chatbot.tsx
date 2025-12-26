
'use client';

import { useState, useRef, useEffect } from 'react';
import EmailCaptcha from './EmailCaptcha';
import OtpEntry from './OtpEntry';
import ChatProcess from './ChatProcess';
import type { ChatbotStep } from './ChatbotState';
import { resetToEmail, resetToOtp } from './chatbotHelpers';
import { MessageCircle, X, Bot } from 'lucide-react';
import { contentLabels } from '../../lib/data/contentLabels';
import { fetchApiConfig, getApiConfigSync } from '@/lib/config/configLoader';


export function Chatbot() {

  // Message type for chat messages
  interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }

  // State and refs for chatbot session, input, and timers
  const [apiConfig, setApiConfig] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inactivitySeconds, setInactivitySeconds] = useState(300);
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    // Fetch API config from CDN
    fetchApiConfig().then(config => setApiConfig(config));
  }, []);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [jwt, setJwt] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState<ChatbotStep>('email');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Timers: use number | null for browser
  const idleTimeoutRef = useRef<number | null>(null);
  const inactivityTimeoutRef = useRef<number | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Countdown effect for inactivity timer (visible timer)
  // Resets inactivitySeconds if not in chat, or decrements every second
  useEffect(() => {
    if (step !== 'chat') {
      setInactivitySeconds(300);
      return;
    }
    if (inactivitySeconds <= 0) {
      resetToOtp(
        setJwt,
        setSessionId,
        setOtp,
        setStep,
        setStatusMsg,
        setInactivitySeconds
      );
      return;
    }
    const interval = setInterval(() => {
      setInactivitySeconds((s: number) => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, inactivitySeconds]);
  // (State, refs, and interface declarations are only at the top of the file now)

  // On mount, reset all session state to initial values
  useEffect(() => {
    setJwt(null);
    setSessionId(null);
    setEmail('');
    setStep('email');
    setCaptchaToken(null);
  }, []);

  // Persist jwt/sessionId/email to localStorage when changed
  useEffect(() => {
    if (jwt && sessionId && email) {
      localStorage.setItem('chatbot_jwt', jwt);
      localStorage.setItem('chatbot_session_id', sessionId);
      localStorage.setItem('chatbot_email', email);
    }
  }, [jwt, sessionId, email]);

  // Idle timeout: reset if no typing or interaction for 5min
  useEffect(() => {
    if (step !== 'chat') return;
    const resetIdle = () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = window.setTimeout(() => {
        resetToOtp(
          setJwt,
          setSessionId,
          setOtp,
          setStep,
          setStatusMsg,
          setInactivitySeconds
        );
      }, 300000); // 5min
    };
    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
      resetIdle();
    };
    document.addEventListener('keydown', handleUserActivity);
    document.addEventListener('mousedown', handleUserActivity);
    const chatWindow = document.querySelector('.fixed.bottom-24.right-6');
    if (chatWindow) {
      chatWindow.addEventListener('scroll', handleUserActivity);
    }
    resetIdle();
    return () => {
      document.removeEventListener('keydown', handleUserActivity);
      document.removeEventListener('mousedown', handleUserActivity);
      if (chatWindow) {
        chatWindow.removeEventListener('scroll', handleUserActivity);
      }
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [step]);

  // Inactivity timeout: reset if no chat message sent for 5min
  useEffect(() => {
    if (step !== 'chat') return;
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    inactivityTimeoutRef.current = window.setTimeout(() => {
      resetToOtp(
        setJwt,
        setSessionId,
        setOtp,
        setStep,
        setStatusMsg,
        setInactivitySeconds
      );
    }, 5 * 60 * 1000); // 5min
    return () => {
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    };
  }, [messages, step]);


  // Send message handler: sends user message, calls backend, handles bot response and session expiry
  const handleSendMessage = async () => {
    // Reset inactivity timer on send
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Call new /chat API with jwt and sessionId
    let botResponse = '';
    try {
      if (!jwt || !sessionId) {
        botResponse = contentLabels?.chatbot?.messages?.sessionExpired || 'Session expired. Please log in again.';
      } else {
        const response = await fetch(apiConfig.fullUrls.chatSend, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
          },
          body: JSON.stringify({ token: sessionId, question: userMessage.text })
        });
        const data = await response.json();
        if (data.detail === 'Token expired') {
          // Clear session and reset to OTP screen
          const sessionExpiredMsg = contentLabels?.chatbot?.messages?.sessionExpiredOtp || 'Session expired. Please log in again.';
          resetToOtp(
            setJwt,
            setSessionId,
            setOtp,
            setStep,
            setStatusMsg,
            setInactivitySeconds,
            sessionExpiredMsg
          );
          botResponse = sessionExpiredMsg;
        } else if (data.answer) {
          botResponse = data.answer;
        } else if (data.error) {
          botResponse = data.error;
        } else {
          botResponse = contentLabels?.chatbot?.messages?.noResponse || 'No response received. Please try again.';
        }
      }
    } catch (error) {
      botResponse = contentLabels?.chatbot?.messages?.connectionError || 'Connection error. Please try again.';
    }
    setIsTyping(false);
    // Add bot message
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages((prev: Message[]) => [...prev, botMessage]);
    // Only reset to email or OTP if session expired or inactivity, not after every message
  };

  // Handle Enter key to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper to reset all session, token, email, otp and go to email entry

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
        {/* Notification Badge */}
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

          {/* Step-based component rendering */}
          {step === 'email' && (
            <EmailCaptcha
              email={email}
              setEmail={setEmail}
              captchaToken={captchaToken}
              setCaptchaToken={setCaptchaToken}
              loading={loading}
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
              onChangeEmail={() => setStep('email')}
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
  // OTP request handler: requests OTP from backend
  async function handleRequestOtp() {
    setStatusMsg(null);
    if (!captchaToken) {
      setStatusMsg(contentLabels?.chatbot?.messages?.captchaRequired || 'Please complete the captcha.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(apiConfig.fullUrls.requestOtp, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, recaptcha: captchaToken })
      });
      const data = await res.json();
      if (data.otp_generated) {
        setStep('otp');
        setStatusMsg(contentLabels?.chatbot?.messages?.otpSent || 'OTP sent successfully.');
      } else {
        setStatusMsg(contentLabels?.chatbot?.messages?.otpFailed || 'Failed to send OTP.');
      }
    } catch (e) {
      setStatusMsg(contentLabels?.chatbot?.messages?.otpError || 'Error sending OTP. Please try again.');
    }
    setLoading(false);
  }

  // OTP verify handler: verifies OTP and transitions to chat step
  async function handleVerifyOtp() {
    setStatusMsg(null);
    setLoading(true);
    try {
      const res = await fetch(apiConfig.fullUrls.verifyOtp, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if ((data.jwt || data.token) && data.session_id) {
        setJwt(data.jwt || data.token);
        setSessionId(data.session_id);
        setStep('chat');
        setStatusMsg(contentLabels?.chatbot?.messages?.verifySuccess || 'Verified successfully!');
      } else {
        setStatusMsg(data.detail || 'Invalid OTP. Try again.');
      }
    } catch (e) {
      setStatusMsg(contentLabels?.chatbot?.messages?.otpError2 || 'Error verifying OTP. Please try again.');
    }
    setLoading(false);
  }
}