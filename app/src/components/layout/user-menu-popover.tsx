import { User, Settings, LogOut, ChevronsUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { Popover } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes/routes';

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

interface UserMenuPopoverProps {
  collapsed?: boolean;
  placement?: 'top' | 'bottom';
}

export default function UserMenuPopover({ collapsed = false, placement = 'top' }: UserMenuPopoverProps) {
  const { full_name, email, logout } = useAuthStore();
  const navigate = useNavigate();

  const displayName = full_name || email || 'User';
  const initials = getInitials(displayName);

  const menuItems = [
    { label: 'Profile', icon: User, onClick: () => navigate(Routes.dashboard.profile) },
    { label: 'Preferences', icon: Settings, onClick: () => {} },
  ];

  const Avatar = ({ size = 'md' }: { size?: 'sm' | 'md' }) => (
    <div
      className={cn('rounded-full flex items-center justify-center font-semibold shrink-0 select-none', size === 'md' ? 'h-7 w-7 text-xs' : 'h-6 w-6 text-xs')}
      style={{
        background: 'color-mix(in oklch, var(--accent) 88%, oklch(0.35 0.06 158))',
        color: 'oklch(0.98 0 0)',
        boxShadow: '0 1px 4px color-mix(in oklch, var(--accent) 35%, transparent)',
      }}
    >
      {initials}
    </div>
  );

  return (
    <Popover
      placement={placement}
      triggerClassName={cn(
        'group w-full rounded-xl transition-all duration-150 cursor-pointer',
        'hover:bg-surface-secondary',
        collapsed ? 'flex justify-center p-1.5' : 'flex items-center gap-2 px-1 py-1.5',
      )}
      contentClassName="p-0"
      trigger={
        collapsed ? (
          <Avatar />
        ) : (
          <>
            <Avatar />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold text-foreground truncate leading-snug">{displayName}</p>
              <p className="text-xs text-muted truncate leading-snug">{email ?? ''}</p>
            </div>
            <ChevronsUpDown className="h-3 w-3 text-muted shrink-0 group-hover:text-foreground transition-colors" />
          </>
        )
      }
    >
      <div className="flex items-center gap-2.5 border-b border-border px-2 py-2.5">
        <Avatar size="sm" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
          <p className="text-[11px] text-muted truncate">{email ?? ''}</p>
        </div>
      </div>

      <div className="py-1.5">
        {menuItems.map(({ label, icon: Icon, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-foreground hover:bg-surface-secondary transition-colors duration-100"
          >
            <Icon className="h-3.5 w-3.5 text-muted shrink-0" />
            {label}
          </button>
        ))}
      </div>

      <div className="border-t border-border py-1.5">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-danger hover:bg-danger/10 transition-colors duration-100"
        >
          <LogOut className="h-3.5 w-3.5 shrink-0" />
          Log out
        </button>
      </div>
    </Popover>
  );
}
