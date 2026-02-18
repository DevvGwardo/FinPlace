import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
  createdAt: number;
}

const DEFAULT_DURATIONS: Record<ToastVariant, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
};

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, variant: ToastVariant, duration?: number) => string;
  dismissToast: (id: string) => void;
}

let counter = 0;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, variant, duration) => {
    const id = `toast-${++counter}-${Date.now()}`;
    const toast: Toast = {
      id,
      message,
      variant,
      duration: duration ?? DEFAULT_DURATIONS[variant],
      createdAt: Date.now(),
    };
    set((state) => ({
      toasts: [...state.toasts.slice(-4), toast], // max 5
    }));
    return id;
  },
  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
