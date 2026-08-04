'use client';

import { useState } from 'react';

import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { FormAlert } from '@/app/_components/form-alert';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { cn } from '@/app/_components/utils';

type AuthFieldProps = Omit<React.ComponentProps<'input'>, 'id'> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  revealable?: boolean;
};

export function AuthField({
  id,
  label,
  hint,
  error,
  revealable = false,
  className,
  type,
  ...props
}: AuthFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const messageId = `${id}-message`;

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={revealable && revealed ? 'text' : type}
          className={cn('h-11 md:h-10', revealable && 'pr-11', className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={hint || error ? messageId : undefined}
          {...props}
        />
        {revealable && (
          <button
            type="button"
            onClick={() => setRevealed((current) => !current)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
            aria-controls={id}
            className="absolute inset-y-0 right-0 flex w-11 touch-manipulation items-center justify-center rounded-r-lg text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {revealed ? (
              <EyeOffIcon aria-hidden className="size-4" />
            ) : (
              <EyeIcon aria-hidden className="size-4" />
            )}
          </button>
        )}
      </div>
      {error ? (
        <FormAlert id={messageId} className="text-xs">
          {error}
        </FormAlert>
      ) : (
        hint && (
          <p id={messageId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
