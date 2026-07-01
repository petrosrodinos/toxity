import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ActionButtonWithPendingProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  idleLeading?: ReactNode;
  isPending?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
};

export function ActionButtonWithPending({
  children,
  idleLeading,
  isPending,
  isDisabled,
  fullWidth,
  className,
  disabled,
  ...rest
}: ActionButtonWithPendingProps) {
  return (
    <Button
      loading={isPending}
      disabled={isDisabled || disabled}
      className={cn(fullWidth && 'w-full', className)}
      {...rest}
    >
      {!isPending && idleLeading}
      {children}
    </Button>
  );
}
