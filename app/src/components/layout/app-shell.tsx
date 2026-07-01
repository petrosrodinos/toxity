import { Outlet } from "react-router-dom";
import BottomNav from "@/components/layout/bottom-nav";
import DesktopNav from "@/components/layout/desktop-nav";
import AppTopBar from "@/components/layout/app-top-bar";

export default function AppShell() {
    return (
        <div className="flex h-full min-h-0 overflow-hidden bg-background">
            <DesktopNav />

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:mr-3">
                <AppTopBar />
                <main className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] lg:p-6 lg:pb-6">
                    <Outlet />
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
