// ============================================
// FILE: src/components/common/Chatbot.tsx
// ============================================

'use client';
import { useState, useRef, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Kuhandran's AI assistant. Ask me anything about his experience, skills, or projects!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [jwt, setJwt] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState<'email' | 'otp' | 'chat'>('email');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Try to restore jwt/sessionId/email from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedJwt = localStorage.getItem('chatbot_jwt');
      const savedSessionId = localStorage.getItem('chatbot_session_id');
      const savedEmail = localStorage.getItem('chatbot_email');
      if (savedJwt && savedSessionId && savedEmail) {
        setJwt(savedJwt);
        setSessionId(savedSessionId);
        setEmail(savedEmail);
        setStep('chat');
      }
    }
  }, []);

  // Save jwt/sessionId/email to localStorage
  useEffect(() => {
    if (jwt && sessionId && email) {
      localStorage.setItem('chatbot_jwt', jwt);
      localStorage.setItem('chatbot_session_id', sessionId);
      localStorage.setItem('chatbot_email', email);
    }
  }, [jwt, sessionId, email]);
  // Request OTP
  const handleRequestOtp = async () => {
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
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    setStatusMsg(null);
    setLoading(true);
    try {
      const res = await fetch('https://resume-chatbot-services-v2-0.onrender.com/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      // Accepts either { jwt, session_id } or { token, session_id }
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
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Simulated bot response - Replace this with your API call
  const getBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Sample responses based on keywords
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
      return "Kuhandran has 8+ years of experience in technical leadership, currently serving as Technical Project Manager at FWD Insurance. Previously, he spent 6 years at Maybank progressing from Junior Developer to Senior Software Engineer. Would you like to know more about any specific role?";
    }
    
    if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
      return "Kuhandran specializes in React.js, React Native, Spring Boot, and Power BI. He's also AWS certified and has expertise in data visualization and microservices architecture. Which technology would you like to know more about?";
    }
    
    if (lowerMessage.includes('project')) {
      return "Some notable projects include the FWD Insurance React Native App with 15% efficiency improvement, Maybank Digital Banking Platform with 15% faster load speeds, and various API integrations. Would you like details on any specific project?";
    }
    
    if (lowerMessage.includes('education') || lowerMessage.includes('mba')) {
      return "Kuhandran holds an MBA in Business Analytics from Cardiff Metropolitan University (2022-2024) and a BSc in Computer Software Engineering from University of Wollongong. This combination of technical and business expertise makes him unique!";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email')) {
      return "You can reach Kuhandran at skuhandran@yahoo.com or call +60 14 933 7280. He's based in Kuala Lumpur, Malaysia and is open to relocation opportunities!";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! 👋 I'm here to help you learn more about Kuhandran. You can ask me about his experience, skills, projects, education, or how to contact him. What would you like to know?";
    }
    
    // Default response
    return "That's a great question! While I'm still learning, you can explore the portfolio sections above for detailed information, or feel free to contact Kuhandran directly at skuhandran@yahoo.com. Is there something specific you'd like to know about his experience, skills, or projects?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
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
        if (data.answer) {
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
    setMessages(prev => [...prev, botMessage]);
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

          {/* Email/OTP Step */}
          {step !== 'chat' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
              {step === 'email' && (
                <>
                  <label className="block mb-2 text-sm font-medium text-slate-700">Enter your email to start chat</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                    placeholder="you@email.com"
                    disabled={loading}
                  />
                  <div className="mb-3 flex justify-center">
                    <ReCAPTCHA
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                      onChange={(token: string | null) => setCaptchaToken(token)}
                    />
                  </div>
                  <button
                    onClick={handleRequestOtp}
                    disabled={!email || !captchaToken || loading}
                    className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? 'Sending OTP...' : 'Request OTP'}
                  </button>
                </>
              )}
              {step === 'otp' && (
                <>
                  <label className="block mb-2 text-sm font-medium text-slate-700">Enter the OTP sent to your email</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                    placeholder="6-digit OTP"
                    disabled={loading}
                  />
                  <button
                    onClick={handleVerifyOtp}
                    disabled={!otp || loading}
                    className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    onClick={() => setStep('email')}
                    className="mt-2 text-xs text-blue-600 hover:underline"
                    disabled={loading}
                  >Change email</button>
                </>
              )}
              {statusMsg && <div className="mt-4 text-sm text-center text-slate-600">{statusMsg}</div>}
            </div>
          )}

          {/* Chat Step */}
          {step === 'chat' && <>
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((message) => (
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
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                )}
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
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                aria-label="Send message"
              >
                {isTyping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
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
}