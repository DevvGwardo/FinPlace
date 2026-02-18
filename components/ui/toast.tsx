'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useToastStore, type ToastVariant } from '@/lib/stores/toast-store';

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-green/30 bg-bg-card text-text shadow-[0_4px_24px_rgba(34,197,94,0.15)]',
  error: 'border-red-500/30 bg-bg-card text-text shadow-[0_4px_24px_rgba(239,68,68,0.15)]',
  warning: 'border-amber-500/30 bg-bg-card text-text shadow-[0_4px_24px_rgba(245,158,11,0.15)]',
  info: 'border-blue/30 bg-bg-card text-text shadow-[0_4px_24px_rgba(59,130,246,0.15)]',
};

const accentColors: Record<ToastVariant, string> = {
  success: 'bg-green',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue',
};

const iconColors: Record<ToastVariant, string> = {
  success: 'text-green',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue',
};

const icons: Record<ToastVariant, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

function ToastItem({ id, message, variant, duration }: { id: string; message: string; variant: ToastVariant; duration: number }) {
  const dismiss = useToastStore((s) => s.dismissToast);

  useEffect(() => {
    const timer = setTimeout(() => dismiss(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, dismiss]);

  const Icon = icons[variant];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      role="status"
      aria-live="polite"
      className={`pointer-events-auto flex items-stretch rounded-lg overflow-hidden min-w-[320px] max-w-[420px] border ${variantStyles[variant]}`}
    >
      <div className={`w-1.5 shrink-0 rounded-l-lg ${accentColors[variant]}`} />
      <div className="flex items-center gap-3 px-4 py-3 flex-1">
        <Icon size={16} className={`shrink-0 ${iconColors[variant]}`} />
        <span className="text-[13px] font-medium flex-1 leading-snug">{message}</span>
        <button
          onClick={() => dismiss(id)}
          className="shrink-0 text-text-muted hover:text-text transition-colors p-0.5 ml-1"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed top-16 right-4 z-[100] pointer-events-none flex flex-col items-end gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} />
        ))}
      </AnimatePresence>
    </div>
  );
}
