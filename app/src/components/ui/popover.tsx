import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type PopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
  placement?: 'top' | 'bottom';
  contentClassName?: string;
  triggerClassName?: string;
};

export function Popover({
  trigger,
  children,
  placement = 'top',
  contentClassName,
  triggerClassName,
}: PopoverProps) {
  const [is_open, setIsOpen] = useState(false);
  const trigger_ref = useRef<HTMLButtonElement>(null);
  const panel_ref = useRef<HTMLDivElement>(null);
  const panel_id = useId();
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!is_open || !trigger_ref.current) return;

    const update_position = () => {
      const rect = trigger_ref.current!.getBoundingClientRect();
      const panel_height = panel_ref.current?.offsetHeight ?? 0;
      const top =
        placement === 'top'
          ? rect.top - panel_height - 8
          : rect.bottom + 8;
      setCoords({ top, left: rect.left });
    };

    update_position();
    window.addEventListener('resize', update_position);
    window.addEventListener('scroll', update_position, true);
    return () => {
      window.removeEventListener('resize', update_position);
      window.removeEventListener('scroll', update_position, true);
    };
  }, [is_open, placement]);

  useEffect(() => {
    if (!is_open) return;

    const on_pointer = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        trigger_ref.current?.contains(target) ||
        panel_ref.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    const on_key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', on_pointer);
    document.addEventListener('keydown', on_key);
    return () => {
      document.removeEventListener('mousedown', on_pointer);
      document.removeEventListener('keydown', on_key);
    };
  }, [is_open]);

  return (
    <>
      <button
        ref={trigger_ref}
        type="button"
        aria-expanded={is_open}
        aria-controls={panel_id}
        onClick={() => setIsOpen((v) => !v)}
        className={cn('outline-none', triggerClassName)}
      >
        {trigger}
      </button>

      {is_open &&
        createPortal(
          <div
            ref={panel_ref}
            id={panel_id}
            role="dialog"
            className={cn(
              'fixed z-50 w-48 overflow-hidden rounded-xl border border-border bg-surface p-2 outline-none',
              contentClassName,
            )}
            style={{
              top: coords.top,
              left: coords.left,
              boxShadow: `
                0 0 0 1px color-mix(in oklch, var(--accent) 7%, transparent),
                0 16px 36px -8px color-mix(in oklch, black 22%, transparent),
                0 4px 10px -2px color-mix(in oklch, black 10%, transparent)
              `,
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}
