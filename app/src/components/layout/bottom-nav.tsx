import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { admin_nav_item, app_nav_items } from "@/components/layout/app-nav-items";
import { useAuthStore } from "@/stores/auth";
import { RoleTypes } from "@/features/user/interfaces/user.interface";

export default function BottomNav() {
    const role = useAuthStore((state) => state.role);
    const is_admin =
        role === RoleTypes.ADMIN || role === RoleTypes.SUPER_ADMIN;
    const nav_items = is_admin
        ? [...app_nav_items, admin_nav_item]
        : app_nav_items;

    return (
        <nav
            className={cn(
                "fixed inset-x-0 bottom-0 z-40 lg:hidden",
                "border-t border-border bg-surface/95 backdrop-blur-md",
                "pb-[env(safe-area-inset-bottom)]",
            )}
            aria-label="Main navigation"
        >
            <ul className="flex h-16 items-stretch justify-around px-1">
                {nav_items.map(({ label, icon: Icon, href, end, emphasized }) => (
                    <li key={href} className="flex flex-1 min-w-0">
                        <NavLink
                            to={href}
                            end={end}
                            className={({ isActive }) =>
                                cn(
                                    "flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5",
                                    "font-mono uppercase text-[9px] tracking-wide font-medium transition-colors duration-200",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45",
                                    isActive ? "text-accent" : "text-muted hover:text-foreground",
                                    emphasized && !isActive && "text-foreground/80",
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={cn(
                                            "flex items-center justify-center rounded-xl transition-all duration-200",
                                            emphasized ? "h-9 w-9" : "h-7 w-7",
                                            isActive &&
                                                emphasized &&
                                                "bg-accent text-accent-foreground shadow-[0_4px_12px_color-mix(in_oklch,var(--accent)_35%,transparent)]",
                                            isActive && !emphasized && "bg-accent/14",
                                        )}
                                    >
                                        <Icon
                                            className={cn(emphasized ? "h-5 w-5" : "h-[18px] w-[18px]")}
                                            strokeWidth={isActive ? 2.25 : 2}
                                        />
                                    </span>
                                    <span className="truncate leading-none">{label}</span>
                                </>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
