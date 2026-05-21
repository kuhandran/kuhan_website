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

// Score voices — higher = better quality
function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  let s = 0;
  // Microsoft neural (Windows 11) — best on Windows
  if (name.includes('natural'))  s += 120;
  if (name.includes('online'))   s += 100;
  // Google neural — best in Chrome
  if (name.includes('google'))   s += 90;
  // Apple enhanced / premium — best on Mac/iOS
  if (name.includes('enhanced')) s += 80;
  if (name.includes('premium'))  s += 80;
  // Specific good voices
  if (name.includes('aria'))      s += 30;  // Microsoft Aria
  if (name.includes('jenny'))     s += 30;  // Microsoft Jenny
  if (name.includes('guy'))       s += 25;  // Microsoft Guy
  if (name.includes('samantha'))  s += 40;  // macOS Samantha
  if (name.includes('alex'))      s += 20;  // macOS Alex
  if (name.includes('female'))    s += 10;
  // Prefer en-US, then en-GB
  if (v.lang === 'en-US') s += 15;
  if (v.lang === 'en-GB') s += 8;
  return s;
}

function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const english = voices.filter(v => v.lang.startsWith('en'));
  if (!english.length) return voices[0] ?? null;
  return english.slice().sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] ?? null;
}

export interface SpeechControls {
  speak: (text: string, isMuted: boolean) => void;
  cancel: () => void;
  isSpeaking: boolean;
}

export function useSpeech(): SpeechControls {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voiceRef     = useRef<SpeechSynthesisVoice | null>(null);
  const isSupported  = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load voices — browsers fire onvoiceschanged when the list is ready
  useEffect(() => {
    if (!isSupported) return;

    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) voiceRef.current = pickBestVoice(voices);
    };

    load(); // may already be available (Safari)
    window.speechSynthesis.onvoiceschanged = load;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  function speak(text: string, isMuted: boolean) {
    if (!isSupported || isMuted) return;
    window.speechSynthesis.cancel();

    const clean = stripMarkdown(text);
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);

    // Use best available voice; fall back to browser default
    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
      utterance.lang  = voiceRef.current.lang;
    } else {
      utterance.lang = 'en-US';
    }

    // Natural-sounding parameters
    utterance.rate   = 0.88;   // slightly slower = more human
    utterance.pitch  = 1.05;   // very slight warmth
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend   = () => setIsSpeaking(false);
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
