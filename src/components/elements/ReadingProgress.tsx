'use client';
import { motion, useScroll, useSpring } from 'framer-motion';

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[200] pointer-events-none"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981)',
      }}
    />
  );
}
