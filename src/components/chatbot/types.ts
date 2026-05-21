export type ChatbotStep = 'email' | 'otp' | 'chat';

export type AvatarEmotion = 'idle' | 'thinking' | 'talking' | 'happy' | 'alert';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}
