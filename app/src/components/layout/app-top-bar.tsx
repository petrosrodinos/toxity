import { useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { app_page_titles } from "@/components/layout/app-nav-items";
import { useThemeContext } from "@/components/providers/theme-provider";

export default function AppTopBar() {
    const location = useLocation();
    const { theme, toggleTheme } = useThemeContext();
    const current_title = app_page_titles[location.pathname] ?? "Toxity";

    return (
        <header
            className={cn(
                "lg:hidden shrink-0",
                "mx-3 mt-3 rounded-xl",
                "h-12 flex items-center justify-between px-3",
                "bg-surface border border-border",
            )}
            style={{
                boxShadow: `
          0 0 0 1px color-mix(in oklch, var(--accent) 8%, transparent),
          0 8px 20px -8px color-mix(in oklch, black 14%, transparent),
          0 2px 6px -2px color-mix(in oklch, black 6%, transparent)
        `,
            }}
        >
            <div className="min-w-0">
                <p
                    className="font-semibold text-foreground text-sm tracking-tight leading-none"
                    style={{ fontFamily: "var(--heading)" }}
                >
                    {current_title}
                </p>
                <p className="text-[11px] text-muted truncate leading-snug mt-0.5">Ingredient intelligence</p>
            </div>

            <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-secondary transition-colors duration-200"
            >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
        </header>
    );
}
