export type ChatbotStep = 'email' | 'otp' | 'chat';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}
