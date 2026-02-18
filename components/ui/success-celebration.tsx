'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useConfetti } from '@/hooks/use-confetti';

export function SuccessCelebration({ children }: { children: React.ReactNode }) {
  const { fireConfetti, setCanvas } = useConfetti();

  useEffect(() => {
    const timer = setTimeout(fireConfetti, 150);
    return () => clearTimeout(timer);
  }, [fireConfetti]);

  return (
    <div className="relative">
      <canvas
        ref={setCanvas}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
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
