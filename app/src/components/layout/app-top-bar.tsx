import { NavLink } from "react-router-dom";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/brand/brand-mark";
import { Routes } from "@/routes/routes";

export default function AppTopBar() {
    return (
        <header
            className={cn(
                "lg:hidden shrink-0",
                "h-16 flex items-center justify-between px-4",
                "border-b border-border bg-surface/95 backdrop-blur-md",
            )}
        >
            <NavLink
                to={Routes.home.root}
                className="min-w-0 shrink-0 rounded-xl transition-opacity hover:opacity-90"
            >
                <BrandMark size="sm" />
            </NavLink>

            <NavLink
                to={Routes.profile.root}
                end
                aria-label="Profile"
                className={({ isActive }) =>
                    cn(
                        "shrink-0 p-1.5 rounded-lg transition-colors duration-200",
                        isActive
                            ? "text-accent bg-accent/14"
                            : "text-muted hover:text-foreground hover:bg-surface-secondary",
                    )
                }
            >
                <User className="h-4 w-4" />
            </NavLink>
        </header>
    );
}
