import { useCallback } from 'react';
import { useToastStore, type ToastVariant } from '@/lib/stores/toast-store';

export function useToast() {
  const addToast = useToastStore((s) => s.addToast);
  const dismissToast = useToastStore((s) => s.dismissToast);

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration?: number) =>
      addToast(message, variant, duration),
    [addToast],
  );

  return {
    toast: Object.assign(toast, {
      success: (message: string, duration?: number) => addToast(message, 'success', duration),
      error: (message: string, duration?: number) => addToast(message, 'error', duration),
      warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
      info: (message: string, duration?: number) => addToast(message, 'info', duration),
    }),
    dismiss: dismissToast,
  };
}
