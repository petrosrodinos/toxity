import {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption<T extends string = string> = {
    value: T;
    label: ReactNode;
    disabled?: boolean;
};

type SelectProps<T extends string = string> = {
    value: T;
    onChange: (value: T) => void;
    options: SelectOption<T>[];
    id?: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    contentClassName?: string;
    "aria-label"?: string;
};

const PANEL_SHADOW = `
    0 0 0 1px color-mix(in oklch, var(--accent) 7%, transparent),
    0 16px 36px -8px color-mix(in oklch, black 22%, transparent),
    0 4px 10px -2px color-mix(in oklch, black 10%, transparent)
`;

export function Select<T extends string = string>({
    value,
    onChange,
    options,
    id,
    placeholder = "Select…",
    disabled = false,
    className,
    contentClassName,
    "aria-label": aria_label,
}: SelectProps<T>) {
    const [is_open, set_is_open] = useState(false);
    const [active_index, set_active_index] = useState(-1);
    const trigger_ref = useRef<HTMLButtonElement>(null);
    const panel_ref = useRef<HTMLDivElement>(null);
    const listbox_id = useId();
    const [rect, set_rect] = useState({ top: 0, left: 0, width: 0 });

    const selected = useMemo(
        () => options.find((option) => option.value === value),
        [options, value],
    );

    // Position the panel below the trigger, matching its width.
    useEffect(() => {
        if (!is_open || !trigger_ref.current) return;

        const update_position = () => {
            const bounds = trigger_ref.current!.getBoundingClientRect();
            set_rect({
                top: bounds.bottom + 6,
                left: bounds.left,
                width: bounds.width,
            });
        };

        update_position();
        window.addEventListener("resize", update_position);
        window.addEventListener("scroll", update_position, true);
        return () => {
            window.removeEventListener("resize", update_position);
            window.removeEventListener("scroll", update_position, true);
        };
    }, [is_open]);

    // Highlight the current selection when the menu opens.
    useEffect(() => {
        if (!is_open) return;
        const selected_index = options.findIndex(
            (option) => option.value === value,
        );
        set_active_index(selected_index === -1 ? 0 : selected_index);
    }, [is_open, options, value]);

    // Dismiss on outside click.
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
        };

        document.addEventListener("mousedown", on_pointer);
        return () => document.removeEventListener("mousedown", on_pointer);
    }, [is_open]);

    const move_active = (direction: 1 | -1) => {
        set_active_index((current) => {
            const total = options.length;
            if (total === 0) return -1;
            let next = current;
            for (let step = 0; step < total; step += 1) {
                next = (next + direction + total) % total;
                if (!options[next]?.disabled) return next;
            }
            return current;
        });
    };

    const commit = (option: SelectOption<T>) => {
        if (option.disabled) return;
        onChange(option.value);
        set_is_open(false);
        trigger_ref.current?.focus();
    };

    const on_key = (event: React.KeyboardEvent) => {
        if (disabled) return;

        if (!is_open) {
            if (
                event.key === "Enter" ||
                event.key === " " ||
                event.key === "ArrowDown" ||
                event.key === "ArrowUp"
            ) {
                event.preventDefault();
                set_is_open(true);
            }
            return;
        }

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                move_active(1);
                break;
            case "ArrowUp":
                event.preventDefault();
                move_active(-1);
                break;
            case "Home":
                event.preventDefault();
                set_active_index(options.findIndex((o) => !o.disabled));
                break;
            case "End":
                event.preventDefault();
                set_active_index(
                    options.length -
                        1 -
                        [...options]
                            .reverse()
                            .findIndex((o) => !o.disabled),
                );
                break;
            case "Enter":
            case " ": {
                event.preventDefault();
                const option = options[active_index];
                if (option) commit(option);
                break;
            }
            case "Escape":
                event.preventDefault();
                set_is_open(false);
                trigger_ref.current?.focus();
                break;
            case "Tab":
                set_is_open(false);
                break;
            default:
                break;
        }
    };

    return (
        <>
            <button
                ref={trigger_ref}
                id={id}
                type="button"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={is_open}
                aria-controls={listbox_id}
                aria-label={aria_label}
                disabled={disabled}
                onClick={() => !disabled && set_is_open((value) => !value)}
                onKeyDown={on_key}
                className={cn(
                    "flex h-10 w-full items-center justify-between gap-2 rounded-md border bg-field px-3 py-2 text-left text-sm",
                    "transition-colors duration-150 outline-none",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    is_open
                        ? "border-accent ring-2 ring-accent/40"
                        : "border-field-border hover:border-accent/60",
                    className,
                )}
            >
                <span
                    className={cn(
                        "truncate",
                        selected ? "text-foreground" : "text-muted",
                    )}
                >
                    {selected ? selected.label : placeholder}
                </span>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 shrink-0 text-muted transition-transform duration-200",
                        is_open && "rotate-180",
                    )}
                />
            </button>

            {is_open &&
                createPortal(
                    <div
                        ref={panel_ref}
                        id={listbox_id}
                        role="listbox"
                        aria-activedescendant={
                            active_index >= 0
                                ? `${listbox_id}-${active_index}`
                                : undefined
                        }
                        className={cn(
                            "fixed z-50 max-h-64 overflow-y-auto rounded-xl border border-border bg-surface p-1.5 outline-none",
                            "animate-pop-in",
                            contentClassName,
                        )}
                        style={{
                            top: rect.top,
                            left: rect.left,
                            minWidth: rect.width,
                            boxShadow: PANEL_SHADOW,
                        }}
                    >
                        {options.map((option, index) => {
                            const is_selected = option.value === value;
                            const is_active = index === active_index;
                            return (
                                <button
                                    key={option.value}
                                    id={`${listbox_id}-${index}`}
                                    type="button"
                                    role="option"
                                    aria-selected={is_selected}
                                    disabled={option.disabled}
                                    onClick={() => commit(option)}
                                    onMouseEnter={() => set_active_index(index)}
                                    className={cn(
                                        "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm outline-none",
                                        "transition-colors duration-100",
                                        "disabled:cursor-not-allowed disabled:opacity-40",
                                        is_active && "bg-surface-secondary",
                                        is_selected
                                            ? "font-medium text-accent"
                                            : "text-foreground",
                                    )}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {is_selected ? (
                                        <Check className="h-4 w-4 shrink-0 text-accent" />
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>,
                    document.body,
                )}
        </>
    );
}
