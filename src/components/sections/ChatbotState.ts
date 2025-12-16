// Centralized chatbot state types and initial values
import { RefObject } from 'react';

export type ChatbotStep = 'email' | 'otp' | 'chat';

export interface ChatbotState {
  inputValue: string;
  inactivitySeconds: number;
  isTyping: boolean;
  email: string;
  otp: string;
  jwt: string | null;
  sessionId: string | null;
  step: ChatbotStep;
  statusMsg: string | null;
  loading: boolean;
  captchaToken: string | null;
  messagesEndRef: RefObject<HTMLDivElement> | null;
  inputRef: RefObject<HTMLInputElement> | null;
  idleTimeoutRef: RefObject<number | null> | null;
  inactivityTimeoutRef: RefObject<number | null> | null;
  lastActivityRef: RefObject<number> | null;
}

export const initialChatbotState = {
  inputValue: '',
  inactivitySeconds: 300,
  isTyping: false,
  email: '',
  otp: '',
  jwt: null,
  sessionId: null,
  step: 'email' as ChatbotStep,
  statusMsg: null,
  loading: false,
  captchaToken: null,
  messagesEndRef: null,
  inputRef: null,
  idleTimeoutRef: null,
  inactivityTimeoutRef: null,
  lastActivityRef: null,
};
