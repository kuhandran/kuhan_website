import type { AvatarEmotion } from '../types';

const ALERT_WORDS = [
  'error', 'sorry', 'unfortunately', 'failed', 'unable', 'cannot', "can't",
  'problem', 'issue', 'invalid', 'expired', 'denied', 'blocked', 'try again',
  'wrong', 'incorrect', 'unavailable', 'not found',
];

const HAPPY_WORDS = [
  'great', 'excellent', 'congratulations', 'congrats', 'success', 'awesome',
  'wonderful', 'fantastic', 'perfect', 'well done', 'impressive', 'glad',
  'happy', 'excited', 'delighted', 'achieved', 'accomplished', 'love',
];

export function detectEmotion(text: string): AvatarEmotion {
  const t = text.toLowerCase();
  if (ALERT_WORDS.some(w => t.includes(w))) return 'alert';
  if (HAPPY_WORDS.some(w => t.includes(w))) return 'happy';
  return 'talking';
}
