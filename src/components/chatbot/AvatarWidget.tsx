'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { AvatarEmotion } from './types';

const PROFILE_URL = 'https://static.kuhandranchatbot.info/public/image/profile.webp';

interface AvatarWidgetProps {
  emotion: AvatarEmotion;
  size: 'full' | 'mini';
  isSpeaking?: boolean;
}

const ringVariants: Variants = {
  idle: {
    boxShadow: [
      '0 0 0 2px #3b82f6',
      '0 0 8px 4px rgba(59,130,246,0.31)',
      '0 0 0 2px #3b82f6',
    ],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
  },
  thinking: {
    boxShadow: [
      '0 0 0 2px #f59e0b',
      '0 0 12px 5px rgba(245,158,11,0.50)',
      '0 0 0 2px #f59e0b',
    ],
    opacity: [1, 0.55, 1],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' as const },
  },
  talking: {
    boxShadow: [
      '0 0 0 2px #3b82f6',
      '0 0 16px 7px rgba(59,130,246,0.38)',
      '0 0 0 2px #3b82f6',
    ],
    scale: [1, 1.04, 1],
    transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' as const },
  },
  happy: {
    boxShadow: [
      '0 0 0 2px #22c55e',
      '0 0 18px 8px rgba(34,197,94,0.38)',
      '0 0 0 2px #22c55e',
    ],
    scale: [1, 1.06, 1],
    transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const },
  },
  alert: {
    boxShadow: [
      '0 0 0 2px #ef4444',
      '0 0 14px 6px rgba(239,68,68,0.38)',
      '0 0 0 2px #ef4444',
    ],
    scale: [1, 1.03, 1, 1.03, 1],
    transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

const staticRingVariants: Variants = {
  idle:     { boxShadow: '0 0 0 2px #3b82f6' },
  thinking: { boxShadow: '0 0 0 2px #f59e0b' },
  talking:  { boxShadow: '0 0 0 2px #3b82f6' },
  happy:    { boxShadow: '0 0 0 2px #22c55e' },
  alert:    { boxShadow: '0 0 0 2px #ef4444' },
};

const WAVE_DELAYS = [0, 0.15, 0.3];

export function AvatarWidget({ emotion, size, isSpeaking = false }: AvatarWidgetProps) {
  const prefersReduced = useReducedMotion();
  const isFull = size === 'full';
  const dim = isFull ? 'w-20 h-20' : 'w-8 h-8';
  const imgInset = isFull ? 'inset-1' : 'inset-0.5';

  return (
    <div className={`relative ${dim} shrink-0`}>
      {/* Animated ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        variants={prefersReduced ? staticRingVariants : ringVariants}
        animate={emotion}
      />

      {/* Profile photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={PROFILE_URL}
        alt="Kuhandran avatar"
        className={`absolute ${imgInset} rounded-full object-cover`}
        style={{ width: 'calc(100% - 8px)', height: 'calc(100% - 8px)' }}
        draggable={false}
      />

      {/* Audio wave bars — full size + speaking only */}
      <AnimatePresence>
        {isFull && isSpeaking && (
          <motion.div
            key="wave"
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-0.75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {WAVE_DELAYS.map((delay, i) => (
              <motion.div
                key={i}
                className="w-0.75 bg-blue-300 rounded-full"
                style={{ height: 8 }}
                animate={{ scaleY: [0.4, 1.3, 0.4] }}
                transition={{ duration: 0.5, repeat: Infinity, delay, ease: 'easeInOut' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
