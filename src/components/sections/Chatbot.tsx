
'use client';

import { useState, useRef, useEffect } from 'react';
import EmailCaptcha from './EmailCaptcha';
import OtpEntry from './OtpEntry';
import ChatProcess from './ChatProcess';
import type { ChatbotStep } from './ChatbotState';
import { resetToEmail, resetToOtp } from './chatbotHelpers';
import { MessageCircle, X, Bot } from 'lucide-react';


export function Chatbot() {

  // Message type for chat messages
  interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }

  // State and refs for chatbot session, input, and timers
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inactivitySeconds, setInactivitySeconds] = useState(300);
  const [isTyping, setIsTyping] = useState(false);
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

  // (handleSendMessageWithTimer logic removed as it's not used)
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
        botResponse = 'Session expired or not verified. Please refresh and verify your email again.';
      } else {
        const response = await fetch('https://resume-chatbot-services-v2-0.onrender.com/chat', {
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
          resetToOtp(
            setJwt,
            setSessionId,
            setOtp,
            setStep,
            setStatusMsg,
            setInactivitySeconds,
            'Your session has expired. Please re-enter the OTP sent to your email.'
          );
          botResponse = 'Your session has expired. Please re-enter the OTP sent to your email.';
        } else if (data.answer) {
          botResponse = data.answer;
        } else if (data.error) {
          botResponse = data.error;
        } else {
          botResponse = 'Sorry, I did not understand the response.';
        }
      }
    } catch (error) {
      botResponse = "Sorry, I'm having trouble connecting. Please try again later.";
    }
    setIsTyping(false);
    // Add bot message
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };
            resetToEmail(
              setJwt,
              setSessionId,
              setEmail,
              setOtp,
              setStep,
              setStatusMsg,
              setMessages,
              setInactivitySeconds,
              undefined
            );
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
        aria-label="Toggle chat"
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
              <h3 className="font-bold text-lg">AI Assistant</h3>
              <p className="text-xs text-white/80">Ask me anything about Kuhandran</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close chat"
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
              quickActions={['Experience', 'Skills', 'Projects', 'Contact']}
              setQuickAction={(action) => {
                setInputValue(action);
                setTimeout(() => handleSendMessage(), 100);
              }}
            />
          )}

          {/* Chat Step */}
          {step === 'chat' && <>
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((message: Message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 shadow-sm rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span className={`text-xs mt-1 block ${
                    message.sender === 'user' ? 'text-white/70' : 'text-slate-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {/* User avatar handled in ChatProcess subcomponent */}
              </div>
            ))}
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
           {/* Input Area */}
           <div className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
             {/* Inactivity Timer Display */}
             <div className="mb-2 text-center text-xs text-slate-500 font-semibold">
               {`Session will expire in ${Math.floor(inactivitySeconds / 60)}:${(inactivitySeconds % 60).toString().padStart(2, '0')}`}
             </div>
             <div className="flex gap-2">
               <input
                 ref={inputRef}
                 type="text"
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 onKeyPress={handleKeyPress}
                 placeholder="Type your message..."
                 className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                 disabled={isTyping}
               />
               <button
                 onClick={handleSendMessage}
                 disabled={!inputValue.trim() || isTyping}
                 className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                 aria-label="Send message"
               >
                 {/* Loader2 and Send icons handled in ChatProcess subcomponent */}
               </button>
             </div>
             {/* Quick Actions */}
             <div className="flex flex-wrap gap-2 mt-3">
               {['Experience', 'Skills', 'Projects', 'Contact'].map((action) => (
                 <button
                   key={action}
                   onClick={() => {
                     setInputValue(action);
                     setTimeout(() => handleSendMessage(), 100);
                   }}
                   className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
                 >
                   {action}
                 </button>
               ))}
             </div>
           </div>
          </>}
        </div>
      )}
    </>
  );
  // OTP request handler: requests OTP from backend
  async function handleRequestOtp() {
    setStatusMsg(null);
    if (!captchaToken) {
      setStatusMsg('Please complete the captcha.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://resume-chatbot-services-v2-0.onrender.com/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, recaptchaToken: captchaToken })
      });
      const data = await res.json();
      if (data.otp_generated) {
        setStep('otp');
        setStatusMsg('OTP sent to your email. Please check your inbox.');
      } else {
        setStatusMsg('Failed to send OTP. Try again.');
      }
    } catch (e) {
      setStatusMsg('Error sending OTP. Try again.');
    }
    setLoading(false);
  }

  // OTP verify handler: verifies OTP and transitions to chat step
  async function handleVerifyOtp() {
    setStatusMsg(null);
    setLoading(true);
    try {
      const res = await fetch('https://resume-chatbot-services-v2-0.onrender.com/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if ((data.jwt || data.token) && data.session_id) {
        setJwt(data.jwt || data.token);
        setSessionId(data.session_id);
        setStep('chat');
        setStatusMsg('Email verified! You can now chat.');
      } else {
        setStatusMsg(data.detail || 'Invalid OTP. Try again.');
      }
    } catch (e) {
      setStatusMsg('Error verifying OTP. Try again.');
    }
    setLoading(false);
  }
}