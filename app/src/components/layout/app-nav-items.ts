import { ScanLine, Search, History, ShieldCheck, type LucideIcon } from "lucide-react";
import { Routes } from "@/routes/routes";

export interface AppNavItem {
    label: string;
    icon: LucideIcon;
    href: string;
    end?: boolean;
    emphasized?: boolean;
}

export const app_nav_items: AppNavItem[] = [
    { label: "History", icon: History, href: Routes.history.root, end: true },
    { label: "Scan", icon: ScanLine, href: Routes.scan.root, end: true, emphasized: true },
    { label: "Search", icon: Search, href: Routes.search.root, end: true },
];

export const admin_nav_item: AppNavItem = {
    label: "Admin",
    icon: ShieldCheck,
    href: Routes.admin.root,
    end: false,
};

export const app_page_titles: Record<string, string> = {
    ...Object.fromEntries(app_nav_items.map((item) => [item.href, item.label])),
    [admin_nav_item.href]: admin_nav_item.label,
    [Routes.profile.root]: "Profile",
};
