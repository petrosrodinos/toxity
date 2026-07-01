import { Outlet, NavLink } from 'react-router-dom';
import { Command } from 'lucide-react';
import Sidebar from '@/components/layout/sidebar';
import DashboardNavbar from '@/components/layout/dashboard-navbar';
import SidebarContent from '@/components/layout/sidebar-content';
import UserMenuPopover from '@/components/layout/user-menu-popover';
import { Drawer, DrawerBody, DrawerHeader, useDrawerState } from '@/components/ui/drawer';
import { environments } from '@/config/environments';

export default function DashboardLayout() {
  const drawer = useDrawerState();

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-background">
      <Sidebar />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden mr-3">
        <DashboardNavbar onMenuClick={drawer.open} />
        <main className="min-h-0 flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <Drawer isOpen={drawer.isOpen} onClose={drawer.close}>
        <DrawerHeader onClose={drawer.close} className="h-[54px]">
          <NavLink
            to="/"
            onClick={drawer.close}
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors duration-200 hover:bg-surface-secondary"
          >
            <Command className="h-7 w-7 shrink-0 text-foreground" />
            <span className="truncate text-[13px] font-semibold tracking-tight text-foreground">
              {environments.APP_NAME}
            </span>
          </NavLink>
        </DrawerHeader>

        <DrawerBody className="gap-0 px-2 pb-2 pt-2.5">
          <SidebarContent collapsed={false} onNavigate={drawer.close} />
          <div className="mt-4 border-t border-border pt-2">
            <UserMenuPopover collapsed={false} placement="top" />
          </div>
        </DrawerBody>
      </Drawer>
    </div>
  );
}
