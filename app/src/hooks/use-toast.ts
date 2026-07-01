import type { ReactNode } from 'react';
import { addToast } from '@/components/ui/toast';

export type ToastOptions = {
  title?: ReactNode;
  description?: ReactNode;
  duration?: number;
  variant?: 'error' | 'success' | 'warning' | 'default';
};

function hasTitle(t?: ReactNode): boolean {
  if (t === undefined || t === null) return false;
  if (typeof t === 'string') return t.trim() !== '';
  return true;
}

export function toast(opts: ToastOptions): string {
  const titled = hasTitle(opts.title);
  const title = titled ? opts.title! : opts.description ?? '';
  const description = titled ? opts.description : undefined;

  return addToast({
    title,
    description,
    duration: opts.duration,
    variant: opts.variant ?? 'default',
  });
}
