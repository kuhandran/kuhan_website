import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, Clock } from 'lucide-react';
import { contentLabels as defaultLabels } from '@/lib/data/contentLabels';
import type { ChatMessage } from './types';

interface ChatStepProps {
  messages: ChatMessage[];
  inactivitySeconds: number;
  isTyping: boolean;
  inputValue: string;
  setInputValue: (val: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  quickActions: string[];
  onQuickAction: (action: string) => void;
  miniAvatar?: React.ReactNode;
}

const BotFallback = () => (
  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
    style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
    <Bot className="w-4 h-4 text-white" />
  </div>
);

const TypingIndicator = () => (
  <div className="flex gap-1 items-center px-1 py-0.5">
    {[0, 150, 300].map(delay => (
      <div
        key={delay}
        className="w-2 h-2 rounded-full animate-bounce"
        style={{
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          animationDelay: `${delay}ms`,
          animationDuration: '1s',
        }}
      />
    ))}
  </div>
);

const ChatStep: React.FC<ChatStepProps> = ({
  messages,
  inactivitySeconds,
  isTyping,
  inputValue,
  setInputValue,
  inputRef,
  messagesEndRef,
  onSend,
  onKeyDown,
  quickActions,
  onQuickAction,
  miniAvatar,
}) => {
  const labels = defaultLabels?.chatbot;
  const mins = Math.floor(inactivitySeconds / 60);
  const secs = (inactivitySeconds % 60).toString().padStart(2, '0');
  const isUrgent = inactivitySeconds < 60;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, messagesEndRef]);

  return (
    <>
      {/* ── Messages area — min-h-0 is the critical scroll fix ── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3"
        style={{ background: 'linear-gradient(180deg, #f8f7ff 0%, #f1f0ff 100%)' }}>

        {messages.map((msg, idx) => {
          const isBot = msg.sender === 'bot';
          const prevMsg = messages[idx - 1];
          const showAvatar = isBot && (!prevMsg || prevMsg.sender !== 'bot');

          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {/* Bot avatar — only on first in a run */}
              {isBot && (
                <div className="shrink-0 mt-auto w-7 h-7">
                  {showAvatar ? (miniAvatar ?? <BotFallback />) : null}
                </div>
              )}

              {/* Bubble */}
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 shadow-sm ${
                  isBot
                    ? 'bg-white text-slate-800 rounded-bl-sm'
                    : 'text-white rounded-br-sm'
                }`}
                style={isBot ? {} : {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                }}
              >
                {isBot ? (
                  <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-0.5 prose-ul:my-1 prose-li:my-0">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                )}
                <p className={`text-[10px] mt-1.5 ${isBot ? 'text-slate-400' : 'text-white/60'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* User avatar */}
              {!isBot && (
                <div className="shrink-0 mt-auto w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-indigo-600" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2 justify-start">
            <div className="shrink-0 mt-auto w-7 h-7">
              {miniAvatar ?? <BotFallback />}
            </div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ─────────────────────────────────────────── */}
      <div className="shrink-0 bg-white border-t border-slate-100 px-4 pt-3 pb-4">

        {/* Session timer */}
        <div className={`flex items-center justify-center gap-1.5 mb-3 text-[11px] font-medium ${isUrgent ? 'text-red-500' : 'text-slate-400'}`}>
          <Clock className="w-3 h-3" />
          <span>
            {`${labels?.sessionExpiry || 'Session expires in'} ${mins}:${secs}`}
          </span>
        </div>

        {/* Input row */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={labels?.placeholder || 'Ask me anything…'}
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none min-w-0"
            disabled={isTyping}
          />
          <button
            onClick={onSend}
            disabled={!inputValue.trim() || isTyping}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            aria-label={labels?.ariaLabel || 'Send message'}
          >
            {isTyping
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Send className="w-4 h-4" />
            }
          </button>
        </div>

        {/* Quick actions */}
        {quickActions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {quickActions.map(action => (
              <button
                key={action}
                onClick={() => onQuickAction(action)}
                className="px-3 py-1 text-[11px] font-medium rounded-full border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ChatStep;
