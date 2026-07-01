import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function useDrawerState(initial_open = false) {
  const [is_open, setIsOpen] = useState(initial_open);
  return {
    isOpen: is_open,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((v) => !v),
  };
}

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export function Drawer({ isOpen, onClose, children, className }: DrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const on_key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', on_key);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', on_key);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'color-mix(in oklch, black 30%, transparent)' }}
      />
      <aside
        className={cn(
          'absolute left-0 top-0 flex h-full w-[min(280px,85vw)] flex-col bg-surface shadow-xl',
          className,
        )}
        style={{
          boxShadow: `
            0 0 0 1px color-mix(in oklch, var(--accent) 8%, transparent),
            4px 0 32px -4px color-mix(in oklch, black 20%, transparent)
          `,
        }}
      >
        {children}
      </aside>
    </div>,
    document.body,
  );
}

type DrawerHeaderProps = {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
};

export function DrawerHeader({ children, onClose, className }: DrawerHeaderProps) {
  return (
    <div className={cn('flex shrink-0 items-center gap-2 border-b border-border px-3', className)}>
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close drawer"
          className="shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function DrawerBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-1 flex-col overflow-y-auto', className)}>{children}</div>;
}
