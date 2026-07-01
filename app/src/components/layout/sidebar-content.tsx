import { NavLink } from 'react-router-dom';
import { Compass, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes/routes';

interface SidebarContentProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

const navItems = [
  { label: 'Discover', icon: Compass, href: Routes.dashboard.root, end: true },
];

const upcomingItems = [
  { label: 'Scan', icon: LayoutGrid },
  { label: 'Search' },
  { label: 'History' },
  { label: 'Favorites' },
];

function NavItem({
  label,
  icon: Icon,
  href,
  end,
  collapsed,
  onNavigate,
}: {
  label: string;
  icon: React.ElementType;
  href: string;
  end: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <li>
      <NavLink
        to={href}
        end={end}
        title={collapsed ? label : undefined}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'group flex items-center w-full rounded-xl transition-all duration-200 outline-none',
            'focus-visible:ring-1 focus-visible:ring-accent/50',
            collapsed ? 'justify-center py-2.5 px-0' : 'gap-2.5 px-2.5 py-[8px]',
            isActive
              ? 'text-foreground'
              : 'text-muted hover:text-foreground hover:bg-surface-secondary',
          )
        }
        style={({ isActive }) =>
          isActive
            ? {
                background: 'color-mix(in oklch, var(--accent) 14%, transparent)',
                boxShadow: 'inset 0 0 0 1px color-mix(in oklch, var(--accent) 24%, transparent)',
              }
            : {}
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              className="shrink-0 transition-transform duration-200 group-hover:scale-[1.07]"
              style={{ width: 16, height: 16, color: isActive ? 'var(--accent)' : undefined }}
            />
            {!collapsed && (
              <span
                className="text-[13px] font-medium truncate leading-none"
                style={{ letterSpacing: '-0.005em' }}
              >
                {label}
              </span>
            )}
          </>
        )}
      </NavLink>
    </li>
  );
}

export default function SidebarContent({ collapsed, onNavigate }: SidebarContentProps) {
  return (
    <div className="space-y-4">
      <ul className="space-y-0.5">
        {navItems.map(({ label, icon, href, end }) => (
          <NavItem
            key={href}
            label={label}
            icon={icon}
            href={href}
            end={end}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </ul>

      {!collapsed && (
        <div className="px-2.5 pt-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-2">Coming soon</p>
          <ul className="space-y-1">
            {upcomingItems.map(({ label }) => (
              <li
                key={label}
                className="flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] text-muted/70 cursor-not-allowed select-none"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-border shrink-0" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
