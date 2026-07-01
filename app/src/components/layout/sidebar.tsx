import { useState, useEffect } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BrandMark } from '@/components/brand/brand-mark';
import SidebarContent from '@/components/layout/sidebar-content';
import UserMenuPopover from '@/components/layout/user-menu-popover';
import { Routes } from '@/routes/routes';

const STORAGE_KEY = 'sidebar_collapsed';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {}
  }, [collapsed]);

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col shrink-0',
        'my-3 ml-3 rounded-2xl overflow-hidden',
        'bg-surface border border-border',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-[64px]' : 'w-[220px]',
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
        {collapsed ? (
          <div className="flex flex-col items-center justify-center w-full gap-1.5 py-0.5">
            <NavLink
              to={Routes.dashboard.root}
              aria-label="Toxity home"
              title="Toxity"
              className="rounded-xl p-1 transition-colors duration-200 hover:bg-surface-secondary"
            >
              <BrandMark size="sm" showWordmark={false} />
            </NavLink>
            <button
              onClick={() => setCollapsed(false)}
              title="Expand sidebar"
              className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-surface-secondary transition-all duration-200"
            >
              <PanelLeftOpen className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <>
            <NavLink
              to={Routes.dashboard.root}
              className="flex-1 min-w-0 rounded-xl px-1 py-1 hover:bg-surface-secondary transition-colors duration-200"
            >
              <BrandMark size="sm" />
            </NavLink>
            <button
              onClick={() => setCollapsed(true)}
              title="Collapse sidebar"
              className="shrink-0 p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-secondary transition-all duration-200"
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>

      <nav className="flex-1 py-2.5 px-2 overflow-y-auto">
        <SidebarContent collapsed={collapsed} />
      </nav>

      <div className="shrink-0 p-2 border-t border-border">
        <UserMenuPopover collapsed={collapsed} placement="top" />
      </div>
    </aside>
  );
}
