import React from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import contentLabels from '../../../public/data/contentLabels.json';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatProcessProps {
  inactivitySeconds: number;
  messages: Message[];
  isTyping: boolean;
  inputValue: string;
  setInputValue: (val: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
  quickActions: string[];
  setQuickAction: (action: string) => void;
}

const ChatProcess: React.FC<ChatProcessProps> = ({
  inactivitySeconds,
  messages,
  isTyping,
  inputValue,
  setInputValue,
  inputRef,
  messagesEndRef,
  handleKeyPress,
  handleSendMessage,
  quickActions,
  setQuickAction
}) => (
  <>
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
            {message.sender === 'bot' ? (
              <div className="text-sm leading-relaxed">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm leading-relaxed">{message.text}</p>
            )}
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
    <div className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
      <div className="mb-2 text-center text-xs text-slate-500 font-semibold">
        {`${contentLabels.chatbot.sessionExpiry} ${Math.floor(inactivitySeconds / 60)}:${(inactivitySeconds % 60).toString().padStart(2, '0')}`}
      </div>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={contentLabels.chatbot.placeholder}
          className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          disabled={isTyping}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isTyping}
          className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
          aria-label={contentLabels.chatbot.ariaLabel}
        >
          {isTyping ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {quickActions.map((action) => (
          <button
            key={action}
            onClick={() => setQuickAction(action)}
            className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  </>
);

export default ChatProcess;
