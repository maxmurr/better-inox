'use client';

import { useState } from 'react';

import { ArrowRightIcon, CircleCheckIcon } from 'lucide-react';

import { Button } from '@/app/_components/ui/button';

export function LessonFooter({ completed }: { completed: boolean }) {
  const [isCompleted, setIsCompleted] = useState(completed);

  return (
    <footer
      aria-live="polite"
      className="flex shrink-0 items-center justify-center border-t border-border bg-background px-5 py-3"
    >
      <Button
        type="button"
        size="lg"
        variant={isCompleted ? 'secondary' : 'default'}
        aria-pressed={isCompleted}
        className="gap-2 rounded-full px-4"
        onClick={() => setIsCompleted((value) => !value)}
      >
        {isCompleted ? (
          <>
            <CircleCheckIcon aria-hidden className="size-4 text-success" />
            Completed
          </>
        ) : (
          <>
            Complete lesson
            <ArrowRightIcon aria-hidden />
          </>
        )}
      </Button>
    </footer>
  );
}
