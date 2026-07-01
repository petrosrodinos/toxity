import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes/routes';
import UserMenuPopover from '@/components/layout/user-menu-popover';
import { useThemeContext } from '@/components/providers/theme-provider';

interface DashboardNavbarProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  [Routes.dashboard.root]: 'Discover',
};

export default function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] ?? 'Toxity';
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header
      className={cn(
        'mx-3 mt-3 rounded-xl shrink-0',
        'h-12 flex items-center justify-between px-3',
        'bg-surface border border-border',
      )}
      style={{
        boxShadow: `
          0 0 0 1px color-mix(in oklch, var(--accent) 8%, transparent),
          0 8px 20px -8px color-mix(in oklch, black 14%, transparent),
          0 2px 6px -2px color-mix(in oklch, black 6%, transparent)
        `,
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-secondary transition-colors duration-200"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-sm tracking-tight leading-none" style={{ fontFamily: 'var(--heading)' }}>
            {currentTitle}
          </p>
          <p className="text-[11px] text-muted truncate leading-snug mt-0.5">Ingredient intelligence</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-secondary transition-colors duration-200"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <UserMenuPopover collapsed={false} placement="bottom" />
      </div>
    </header>
  );
}
