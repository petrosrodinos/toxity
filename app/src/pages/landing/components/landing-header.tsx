import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/components/providers/theme-provider";
import { Routes } from "@/routes/routes";

export function LandingHeader() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useThemeContext();

    return (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                <Link
                    to={Routes.landing.root}
                    className="min-w-0 rounded-xl transition-opacity hover:opacity-90"
                >
                    <BrandMark size="md" />
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="rounded-lg p-2 text-muted transition-colors duration-200 hover:bg-surface-secondary hover:text-foreground"
                    >
                        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                    <Button
                        variant="ghost"
                        className="hidden sm:inline-flex"
                        onClick={() => navigate(Routes.auth.sign_in)}
                    >
                        Sign in
                    </Button>
                    <Button variant="scan" onClick={() => navigate(Routes.auth.sign_up)}>
                        Get started
                    </Button>
                </div>
            </div>
        </header>
    );
}
