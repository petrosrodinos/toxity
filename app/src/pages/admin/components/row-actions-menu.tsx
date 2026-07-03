import { useEffect, useRef, useState, type FC } from "react";
import { createPortal } from "react-dom";
import { Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type RowActionsMenuProps = {
    onEdit: () => void;
    onDelete: () => void;
    is_deleting?: boolean;
    edit_label?: string;
    delete_label?: string;
};

const item_classes = cn(
    "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm",
    "transition-colors duration-100",
);

export const RowActionsMenu: FC<RowActionsMenuProps> = ({
    onEdit,
    onDelete,
    is_deleting = false,
    edit_label = "Edit",
    delete_label = "Remove",
}) => {
    const [is_open, set_is_open] = useState(false);
    const [is_confirming, set_is_confirming] = useState(false);
    const trigger_ref = useRef<HTMLButtonElement>(null);
    const panel_ref = useRef<HTMLDivElement>(null);
    const [coords, set_coords] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (!is_open || !trigger_ref.current) return;

        const update_position = () => {
            const rect = trigger_ref.current!.getBoundingClientRect();
            const width = panel_ref.current?.offsetWidth ?? 176;
            set_coords({ top: rect.bottom + 6, left: rect.right - width });
        };

        update_position();
        window.addEventListener("resize", update_position);
        window.addEventListener("scroll", update_position, true);
        return () => {
            window.removeEventListener("resize", update_position);
            window.removeEventListener("scroll", update_position, true);
        };
    }, [is_open]);

    useEffect(() => {
        if (!is_open) return;

        const on_pointer = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                trigger_ref.current?.contains(target) ||
                panel_ref.current?.contains(target)
            ) {
                return;
            }
            set_is_open(false);
            set_is_confirming(false);
        };

        const on_key = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                set_is_open(false);
                set_is_confirming(false);
            }
        };

        document.addEventListener("mousedown", on_pointer);
        document.addEventListener("keydown", on_key);
        return () => {
            document.removeEventListener("mousedown", on_pointer);
            document.removeEventListener("keydown", on_key);
        };
    }, [is_open]);

    const handle_edit = () => {
        set_is_open(false);
        set_is_confirming(false);
        onEdit();
    };

    return (
        <>
            <button
                ref={trigger_ref}
                type="button"
                aria-label="Row actions"
                aria-expanded={is_open}
                onClick={() => set_is_open((value) => !value)}
                className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-lg outline-none",
                    "text-muted transition-colors hover:bg-surface-secondary hover:text-foreground",
                    "focus-visible:ring-2 focus-visible:ring-accent/45",
                    is_open && "bg-surface-secondary text-foreground",
                )}
            >
                <MoreHorizontal className="h-4 w-4" />
            </button>

            {is_open &&
                createPortal(
                    <div
                        ref={panel_ref}
                        role="menu"
                        className="fixed z-50 w-44 rounded-xl border border-border bg-surface p-1.5 outline-none"
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
                        {is_confirming ? (
                            <>
                                <p className="px-2 py-1.5 text-[11px] text-muted">
                                    {delete_label} this item?
                                </p>
                                <button
                                    type="button"
                                    onClick={onDelete}
                                    className={cn(
                                        item_classes,
                                        "text-danger hover:bg-danger/10",
                                    )}
                                >
                                    {is_deleting ? (
                                        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-3.5 w-3.5 shrink-0" />
                                    )}
                                    Confirm
                                </button>
                                <button
                                    type="button"
                                    onClick={() => set_is_confirming(false)}
                                    className={cn(
                                        item_classes,
                                        "text-foreground hover:bg-surface-secondary",
                                    )}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={handle_edit}
                                    className={cn(
                                        item_classes,
                                        "text-foreground hover:bg-surface-secondary",
                                    )}
                                >
                                    <Pencil className="h-3.5 w-3.5 shrink-0 text-muted" />
                                    {edit_label}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => set_is_confirming(true)}
                                    className={cn(
                                        item_classes,
                                        "text-danger hover:bg-danger/10",
                                    )}
                                >
                                    <Trash2 className="h-3.5 w-3.5 shrink-0" />
                                    {delete_label}
                                </button>
                            </>
                        )}
                    </div>,
                    document.body,
                )}
        </>
    );
};
