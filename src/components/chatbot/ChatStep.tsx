import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2 } from 'lucide-react';
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
  <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
    <Bot className="w-5 h-5 text-white" />
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

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 shrink-0">
                {miniAvatar ?? <BotFallback />}
              </div>
            )}
            <div className={`max-w-[75%] p-3 rounded-2xl ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none'
                : 'bg-white text-slate-800 shadow-sm rounded-bl-none'
            }`}>
              {msg.sender === 'bot' ? (
                <div className="text-sm leading-relaxed">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{msg.text}</p>
              )}
              <span className={`text-xs mt-1 block ${msg.sender === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {msg.sender === 'user' && (
              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-slate-600" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2 justify-start">
            <div className="w-8 h-8 shrink-0">
              {miniAvatar ?? <BotFallback />}
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex gap-1">
                {[0, 150, 300].map(delay => (
                  <div key={delay} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
        <p className="mb-2 text-center text-xs text-slate-500 font-semibold">
          {`${labels?.sessionExpiry || 'Session will expire in'} ${mins}:${secs}`}
        </p>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={labels?.placeholder || 'Type your message...'}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            disabled={isTyping}
          />
          <button
            onClick={onSend}
            disabled={!inputValue.trim() || isTyping}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
            aria-label={labels?.ariaLabel || 'Send message'}
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        {quickActions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {quickActions.map(action => (
              <button
                key={action}
                onClick={() => onQuickAction(action)}
                className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
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
