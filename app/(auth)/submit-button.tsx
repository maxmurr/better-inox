'use client';

import { LoaderCircleIcon } from 'lucide-react';

import { Button } from '@/app/_components/ui/button';
import { cn } from '@/app/_components/utils';

type SubmitButtonProps = {
  pending: boolean;
  pendingLabel: string;
  children: React.ReactNode;
};

export function SubmitButton({
  pending,
  pendingLabel,
  children,
}: SubmitButtonProps) {
  return (
    <>
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        aria-busy={pending}
        className="h-11 w-full touch-manipulation text-sm md:h-10"
      >
        <span className="grid place-items-center">
          <span
            className={cn(
              'col-start-1 row-start-1 transition-opacity duration-150',
              pending && 'opacity-0'
            )}
          >
            {children}
          </span>
          <LoaderCircleIcon
            aria-hidden
            className={cn(
              'col-start-1 row-start-1 animate-spin transition-opacity duration-150 motion-reduce:animate-none',
              !pending && 'opacity-0'
            )}
          />
        </span>
      </Button>
      <span role="status" className="sr-only">
        {pending ? pendingLabel : ''}
      </span>
    </>
  );
}
