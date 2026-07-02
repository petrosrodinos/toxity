import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastRecord = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  duration?: number;
};

type ToastListener = (toasts: ToastRecord[]) => void;

let toasts: ToastRecord[] = [];
const listeners = new Set<ToastListener>();

function emit() {
  listeners.forEach((listener) => listener([...toasts]));
}

function dismiss(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function addToast(record: Omit<ToastRecord, 'id'>): string {
  const id = crypto.randomUUID();
  toasts = [...toasts, { id, ...record }];
  emit();

  const duration = record.duration ?? 4000;
  if (duration > 0) {
    window.setTimeout(() => dismiss(id), duration);
  }

  return id;
}

const variant_styles = {
  default: 'border-border bg-surface text-foreground',
  success: 'border-safety-safe/30 bg-safety-safe/10 text-foreground',
  warning: 'border-safety-caution/30 bg-safety-caution/10 text-foreground',
  error: 'border-danger/30 bg-danger/10 text-foreground',
} as const;

function ToastItem({ toast }: { toast: ToastRecord }) {
  const variant = toast.variant ?? 'default';

  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg',
        variant_styles[variant],
      )}
    >
      <div className="min-w-0 flex-1">
        {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
        {toast.description && (
          <p className={cn('text-sm text-muted', toast.title && 'mt-1')}>{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => dismiss(toast.id)}
        className="shrink-0 rounded-md p-1 text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const [items, setItems] = useState<ToastRecord[]>(toasts);

  useEffect(() => {
    const listener: ToastListener = setItems;
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (items.length === 0) return null;

  return createPortal(
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 p-4">
      {items.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>,
    document.body,
  );
}

export type ToastProps = {
  id?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: 'default' | 'destructive' | 'error';
  duration?: number;
};

export type ToastActionElement = React.ReactElement;
