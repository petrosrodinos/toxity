import { Home, ScanLine, Search, History, User, type LucideIcon } from "lucide-react";
import { Routes } from "@/routes/routes";

export interface AppNavItem {
    label: string;
    icon: LucideIcon;
    href: string;
    end?: boolean;
    emphasized?: boolean;
}

export const app_nav_items: AppNavItem[] = [
    { label: "Home", icon: Home, href: Routes.home.root, end: true },
    { label: "Scan", icon: ScanLine, href: Routes.scan.root, end: true, emphasized: true },
    { label: "Search", icon: Search, href: Routes.search.root, end: true },
    { label: "History", icon: History, href: Routes.history.root, end: true },
    { label: "Profile", icon: User, href: Routes.profile.root, end: true },
];

export const app_page_titles: Record<string, string> = Object.fromEntries(
    app_nav_items.map((item) => [item.href, item.label]),
);
