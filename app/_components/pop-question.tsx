'use client';

import { useState } from 'react';

import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { ArrowRightIcon, CornerDownRightIcon } from 'lucide-react';

import { useCourse } from '@/app/_components/course-provider';
import { Button } from '@/app/_components/ui/button';
import { RadioGroup } from '@/app/_components/ui/radio-group';
import { cn } from '@/app/_components/utils';

const LETTERS = 'ABCDEFGH';

type PopQuestionOption = {
  id: string;
  text: string;
};

type PopQuestionResponse =
  | { explanation: string; feedback?: Record<string, string> }
  | { explanation?: string; feedback: Record<string, string> };

export function resolvePopQuestionResponse({
  explanation,
  feedback,
  selected,
}: {
  explanation?: string;
  feedback?: Record<string, string>;
  selected?: string;
}) {
  if (selected && feedback?.[selected]) {
    return feedback[selected];
  }

  return explanation;
}

function renderEmphasis(text: string | undefined) {
  if (!text) {
    return null;
  }

  return text.split('**').map((part, index) =>
    index % 2 === 0 ? (
      part
    ) : (
      <strong key={index} className="font-semibold text-foreground">
        {part}
      </strong>
    )
  );
}

function Option({
  letter,
  text,
  value,
}: {
  letter: string;
  text: string;
  value: string;
}) {
  return (
    <RadioPrimitive.Root
      value={value}
      className={cn(
        'group/option flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5 text-left text-sm text-pretty transition-colors outline-none',
        'hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
        'data-checked:border-primary data-checked:bg-primary/5'
      )}
    >
      <span
        aria-hidden
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-muted font-mono text-xs font-medium text-muted-foreground uppercase transition-colors',
          'group-data-checked/option:border-primary group-data-checked/option:bg-primary group-data-checked/option:text-primary-foreground'
        )}
      >
        {letter}
      </span>
      <span className="flex-1">{text}</span>
    </RadioPrimitive.Root>
  );
}

export function PopQuestion({
  id,
  prompt,
  options,
  correctOptionId,
  explanation,
  feedback,
}: {
  id: string;
  prompt: string;
  options: readonly PopQuestionOption[];
  correctOptionId: string;
} & PopQuestionResponse) {
  const { markPopQuestionSubmitted } = useCourse();
  const [selected, setSelected] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const correct = selected === correctOptionId;
  const answeredText = options.find((option) => option.id === selected)?.text;
  const response = resolvePopQuestionResponse({
    explanation,
    feedback,
    selected,
  });
  const handleSubmit = () => {
    if (!selected) {
      return;
    }

    markPopQuestionSubmitted(id);
    setSubmitted(true);
  };

  return (
    <fieldset className="mt-3 flex flex-col gap-4 border-t border-border pt-8">
      <legend className="text-lg font-semibold tracking-tight text-balance text-foreground">
        {prompt}
        {!submitted ? (
          <span className="text-muted-foreground">
            {' *'}
            <span className="sr-only"> (required)</span>
          </span>
        ) : null}
      </legend>

      {submitted ? (
        <div
          aria-live="polite"
          className="flex flex-col gap-4 motion-safe:animate-in motion-safe:duration-300 motion-safe:ease-out motion-safe:fade-in-0 motion-safe:slide-in-from-top-1"
        >
          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CornerDownRightIcon className="size-3.5 shrink-0" aria-hidden />
              <span className="italic">You answered:</span>
              <span className="font-medium text-foreground">
                {answeredText}
              </span>
            </p>
            <p
              className={cn(
                'text-sm font-semibold',
                correct ? 'text-success' : 'text-destructive'
              )}
            >
              {correct ? 'Correct!' : 'Not quite.'}
            </p>
          </div>
          {response ? (
            <div className="text-[0.975rem]/7 text-foreground/90">
              {renderEmphasis(response)}
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <RadioGroup
            name={id}
            value={selected ?? ''}
            onValueChange={(value) => setSelected(String(value))}
            aria-label={prompt}
          >
            {options.map((option, index) => (
              <Option
                key={option.id}
                value={option.id}
                letter={LETTERS[index] ?? '?'}
                text={option.text}
              />
            ))}
          </RadioGroup>

          <div className="flex flex-col gap-2 border-t border-border pt-5">
            <Button
              className="self-start"
              disabled={!selected}
              onClick={handleSubmit}
            >
              Submit
              <ArrowRightIcon data-icon="inline-end" aria-hidden />
            </Button>
          </div>
        </>
      )}
    </fieldset>
  );
}
