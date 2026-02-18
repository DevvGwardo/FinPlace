'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useConfetti } from '@/hooks/use-confetti';

export function SuccessCelebration({
  children,
  confetti = false,
}: {
  children: React.ReactNode;
  confetti?: boolean;
}) {
  const { fireConfetti, setCanvas } = useConfetti();

  useEffect(() => {
    if (!confetti) return;
    const timer = setTimeout(() => {
      fireConfetti({ origin: { x: 0.5, y: 0.95 } });
    }, 150);
    return () => clearTimeout(timer);
  }, [confetti, fireConfetti]);

  return (
    <div className="relative">
      {confetti && (
        <canvas
          ref={setCanvas}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        />
      )}
      <motion.div
        className="relative"
        style={{ zIndex: 1 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  );
}
