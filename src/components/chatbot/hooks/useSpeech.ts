'use client';

import { useState, useRef, useEffect } from 'react';

const MARKDOWN_PATTERNS: [RegExp, string][] = [
  [/```[\s\S]*?```/g, ''],
  [/`[^`]*`/g, ''],
  [/\*{1,3}([^*]+)\*{1,3}/g, '$1'],
  [/^#{1,6}\s+/gm, ''],
  [/\[([^\]]+)\]\([^)]+\)/g, '$1'],
  [/https?:\/\/\S+/g, ''],
  [/\s+/g, ' '],
];

function stripMarkdown(raw: string): string {
  return MARKDOWN_PATTERNS.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    raw
  ).trim();
}

export interface SpeechControls {
  speak: (text: string, isMuted: boolean) => void;
  cancel: () => void;
  isSpeaking: boolean;
}

export function useSpeech(): SpeechControls {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    return () => {
      if (isSupported) window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  function speak(text: string, isMuted: boolean) {
    if (!isSupported || isMuted) return;
    window.speechSynthesis.cancel();
    const clean = stripMarkdown(text);
    if (!clean) return;
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';
    utterance.volume = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function cancel() {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  return { speak, cancel, isSpeaking };
}
