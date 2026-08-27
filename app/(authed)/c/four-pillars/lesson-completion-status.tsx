import { CircleCheckIcon, CircleIcon } from 'lucide-react';

import { cn } from '@/app/_components/utils';

/** Shows whether one four-pillars lesson is complete. */
export function LessonCompletionStatus({
  children,
  className,
  completed,
}: {
  children: React.ReactNode;
  className?: string;
  completed: boolean;
}) {
  const Icon = completed ? CircleCheckIcon : CircleIcon;

  return (
    <span className={cn('contents', className)}>
      <Icon
        aria-hidden
        className={cn(
          'size-4 shrink-0',
          completed ? 'text-success' : 'text-muted-foreground'
        )}
      />
      {children}
      <span className="sr-only">
        {completed ? 'Completed' : 'Not completed'}
      </span>
    </span>
  );
}
