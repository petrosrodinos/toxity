import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/brand/brand-mark";
import UserMenuPopover from "@/components/layout/user-menu-popover";
import { admin_nav_item, app_nav_items } from "@/components/layout/app-nav-items";
import { Routes } from "@/routes/routes";
import { useAuthStore } from "@/stores/auth";
import { RoleTypes } from "@/features/user/interfaces/user.interface";

export default function DesktopNav() {
    const role = useAuthStore((state) => state.role);
    const is_admin =
        role === RoleTypes.ADMIN || role === RoleTypes.SUPER_ADMIN;
    const nav_items = is_admin
        ? [...app_nav_items, admin_nav_item]
        : app_nav_items;

    return (
        <aside
            className={cn(
                "hidden lg:flex flex-col shrink-0 w-[220px]",
                "my-3 ml-3 rounded-2xl overflow-hidden",
                "bg-surface border border-border",
            )}
            style={{
                boxShadow: `
          0 0 0 1px color-mix(in oklch, var(--accent) 10%, transparent),
          0 20px 40px -12px color-mix(in oklch, black 20%, transparent),
          0 6px 16px -6px color-mix(in oklch, black 10%, transparent)
        `,
            }}
        >
            <div className="h-[54px] flex items-center shrink-0 px-3 border-b border-border">
                <NavLink
                    to={Routes.home.root}
                    className="flex-1 min-w-0 rounded-xl px-1 py-1 hover:bg-surface-secondary transition-colors duration-200"
                >
                    <BrandMark size="sm" />
                </NavLink>
            </div>

            <nav className="flex-1 py-2.5 px-2 overflow-y-auto" aria-label="Main navigation">
                <ul className="space-y-0.5">
                    {nav_items.map(({ label, icon: Icon, href, end, emphasized }) => (
                        <li key={href}>
                            <NavLink
                                to={href}
                                end={end}
                                className={({ isActive }) =>
                                    cn(
                                        "group flex items-center gap-2.5 w-full rounded-xl px-2.5 py-[8px]",
                                        "text-[13px] font-medium transition-all duration-200 outline-none",
                                        "focus-visible:ring-1 focus-visible:ring-accent/50",
                                        isActive
                                            ? "text-foreground"
                                            : "text-muted hover:text-foreground hover:bg-surface-secondary",
                                        emphasized && !isActive && "font-semibold",
                                    )
                                }
                                style={({ isActive }) =>
                                    isActive
                                        ? {
                                              background: "color-mix(in oklch, var(--accent) 14%, transparent)",
                                              boxShadow:
                                                  "inset 0 0 0 1px color-mix(in oklch, var(--accent) 24%, transparent)",
                                          }
                                        : {}
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon
                                            className="shrink-0 transition-transform duration-200 group-hover:scale-[1.07]"
                                            style={{
                                                width: emphasized ? 18 : 16,
                                                height: emphasized ? 18 : 16,
                                                color: isActive ? "var(--accent)" : undefined,
                                            }}
                                        />
                                        <span className="truncate leading-none" style={{ letterSpacing: "-0.005em" }}>
                                            {label}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="shrink-0 p-2 border-t border-border">
                <UserMenuPopover collapsed={false} placement="top" />
            </div>
        </aside>
    );
}
