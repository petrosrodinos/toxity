import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: ReactNode;
    description?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
};

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    className,
}: ModalProps) {
    useEffect(() => {
        if (!isOpen) return;

        const on_key = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", on_key);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", on_key);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="absolute inset-0 backdrop-blur-sm"
                style={{ background: "color-mix(in oklch, black 40%, transparent)" }}
            />

            <div
                role="dialog"
                aria-modal="true"
                className={cn(
                    "relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-surface",
                    className,
                )}
                style={{
                    boxShadow: `
                        0 0 0 1px color-mix(in oklch, var(--accent) 8%, transparent),
                        0 24px 60px -12px color-mix(in oklch, black 35%, transparent)
                    `,
                }}
            >
                <div className="flex shrink-0 items-start gap-3 border-b border-border px-5 py-4">
                    <div className="min-w-0 flex-1">
                        {title && (
                            <h2
                                className="text-base font-semibold text-foreground"
                                style={{ fontFamily: "var(--heading)" }}
                            >
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="mt-0.5 text-xs text-muted">{description}</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

                {footer && (
                    <div className="flex shrink-0 justify-end gap-2 border-t border-border px-5 py-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body,
    );
}
