import { CircleAlertIcon } from 'lucide-react';

import { cn } from '@/app/_components/utils';

export function FormAlert({
  className,
  children,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      role="alert"
      className={cn(
        'flex items-start gap-2 text-sm text-destructive',
        className
      )}
      {...props}
    >
      <CircleAlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span className="min-w-0 text-pretty">{children}</span>
    </p>
  );
}
