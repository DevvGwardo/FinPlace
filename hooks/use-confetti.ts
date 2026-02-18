import { useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

export function useConfetti() {
  const cannonRef = useRef<confetti.CreateTypes | null>(null);

  const setCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      cannonRef.current = confetti.create(canvas, { resize: true, useWorker: true });
    } else {
      cannonRef.current?.reset();
      cannonRef.current = null;
    }
  }, []);

  const fireConfetti = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const fire = cannonRef.current ?? confetti;
    fire({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.5, y: 0.35 },
      colors: ['#22c55e', '#fbbf24', '#ffffff', '#4ade80', '#facc15'],
      gravity: 1.2,
      drift: 0,
      decay: 0.92,
      ticks: 150,
      scalar: 0.9,
      disableForReducedMotion: true,
    });
  }, []);

  return { fireConfetti, setCanvas };
}
