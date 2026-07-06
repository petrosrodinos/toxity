import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { get_app_logo_route } from "@/lib/platform";
import { BrandMark } from "@/components/brand/brand-mark";
import { Routes } from "@/routes/routes";

const ROOT_PATHS = new Set<string>([
    Routes.home.root,
    Routes.scan.root,
    Routes.search.root,
    Routes.history.root,
]);

function resolveTitle(pathname: string): string {
    if (pathname === Routes.profile.root) return "Profile";
    if (pathname === Routes.scan.root) return "Scan";
    if (pathname === Routes.search.root) return "Search";
    if (pathname === Routes.history.root) return "History";
    if (pathname === Routes.home.root) return "Home";
    if (pathname === Routes.admin.root) return "Admin";
    if (pathname === Routes.products.create) return "Add product";
    if (pathname.startsWith("/products/")) return "Product";
    if (pathname.startsWith("/ingredients/")) return "Ingredient";
    return "Toxity";
}

export default function AppTopBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const is_root = ROOT_PATHS.has(location.pathname);

    return (
        <header
            className={cn(
                "lg:hidden shrink-0",
                "h-16 flex items-center justify-between px-4",
                "border-b border-border bg-surface/95 backdrop-blur-md",
            )}
        >
            {is_root ? (
                <NavLink
                    to={get_app_logo_route()}
                    className="min-w-0 shrink-0 rounded-xl transition-opacity hover:opacity-90"
                >
                    <BrandMark size="sm" />
                </NavLink>
            ) : (
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                    className={cn(
                        "flex shrink-0 items-center gap-2 rounded-lg py-1.5 pr-2.5 pl-1.5",
                        "text-sm font-medium text-foreground",
                        "hover:bg-surface-secondary transition-colors duration-200",
                    )}
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="truncate" style={{ fontFamily: "var(--heading)" }}>
                        {resolveTitle(location.pathname)}
                    </span>
                </button>
            )}

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
