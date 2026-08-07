'use client';

import { useState, useTransition } from 'react';

import { CheckIcon, LoaderIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';

import {
  type QuestionOutcome,
  type QuizAttemptResult,
  type QuizLesson,
  type QuizQuestion,
  type QuizSelections,
} from '@/src/entities/models/quiz';

import { useCourse } from '@/app/_components/course-provider';
import { Button } from '@/app/_components/ui/button';
import { Card, CardContent } from '@/app/_components/ui/card';
import { Checkbox } from '@/app/_components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/app/_components/ui/radio-group';
import { Separator } from '@/app/_components/ui/separator';
import { cn } from '@/app/_components/utils';
import { saveQuizSubmission } from '@/app/(authed)/c/four-pillars/actions';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-heading text-3xl font-semibold tabular-nums">
        {value}
      </span>
    </div>
  );
}

function ResultBanner({
  lesson,
  result,
}: {
  lesson: QuizLesson;
  result: QuizAttemptResult;
}) {
  const { retakeQuiz } = useCourse();
  const [confirmingRetake, setConfirmingRetake] = useState(false);
  const score = new Intl.NumberFormat(undefined, {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(result.score);

  return (
    <output
      aria-live="polite"
      className="block rounded-lg border bg-muted/30 p-5 motion-safe:animate-in motion-safe:duration-300 motion-safe:ease-out motion-safe:fade-in-0 motion-safe:slide-in-from-top-1"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-5">
        <div className="flex flex-col items-start gap-3">
          <p className="text-base/relaxed">
            {result.passed ? (
              <>
                <span aria-hidden>🎉</span> You{' '}
                <span className="font-medium text-success">passed</span> the
                quiz. Great job!
              </>
            ) : (
              <>
                Not quite — you scored below the passing mark. Review the lesson
                and try again.
              </>
            )}
          </p>
          {confirmingRetake ? (
            <div className="flex flex-col items-start gap-2">
              <p className="text-sm text-pretty text-muted-foreground">
                Retaking clears the current answers. Your saved score changes
                only after you submit again.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setConfirmingRetake(false);
                    retakeQuiz(lesson.id);
                  }}
                >
                  Retake &amp; Clear Answers
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmingRetake(false)}
                >
                  Keep My Answers
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmingRetake(true)}
            >
              Retake Quiz
            </Button>
          )}
        </div>
        <div className="flex gap-10">
          <Stat label="Score" value={score} />
          <Stat
            label="Correct answers"
            value={`${result.correct}/${result.total}`}
          />
        </div>
      </div>
    </output>
  );
}

function Verdict({ outcome }: { outcome: QuestionOutcome }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
        outcome.isCorrect
          ? 'bg-success/10 text-success'
          : 'bg-destructive/10 text-destructive'
      )}
    >
      {outcome.isCorrect ? (
        <CheckIcon className="size-4" aria-hidden />
      ) : (
        <XIcon className="size-4" aria-hidden />
      )}
      {outcome.isCorrect ? 'Correct' : 'Incorrect'}
    </div>
  );
}

function Question({
  lesson,
  question,
  isSubmitting,
}: {
  lesson: QuizLesson;
  question: QuizQuestion;
  isSubmitting: boolean;
}) {
  const {
    getAnswer,
    setAnswer,
    getSelections,
    toggleSelection,
    isQuizSubmitted,
    outcomeFor,
  } = useCourse();
  const submitted = isQuizSubmitted(lesson.id);
  const disabled = submitted || isSubmitting;
  const outcome = outcomeFor(lesson.id, question.id);
  const selected = getAnswer(lesson.id, question.id);
  const selections = getSelections(lesson.id, question.id);

  const picked = (optionId: string) =>
    outcome
      ? outcome.selectedOptionIds.includes(optionId)
      : question.kind === 'multiple'
        ? selections.includes(optionId)
        : selected === optionId;

  return (
    <fieldset
      id={`q-${question.id}`}
      disabled={disabled}
      className="flex scroll-mt-4 flex-col gap-3"
    >
      <legend className="mb-3 text-base font-semibold">
        {question.prompt}
        {!submitted ? (
          <span className="text-muted-foreground">
            {' *'}
            <span className="sr-only"> (required)</span>
          </span>
        ) : null}
      </legend>

      {outcome ? <Verdict outcome={outcome} /> : null}

      {question.kind === 'multiple' ? (
        <div className="flex flex-col gap-0">
          {question.options.map((option) => {
            const isPicked = picked(option.id);
            const isAnswer = outcome?.correctOptionIds.includes(option.id);
            const isWrongPick = submitted && isPicked && !isAnswer;
            return (
              <label
                key={option.id}
                className={cn(
                  'flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors',
                  !disabled && 'cursor-pointer hover:bg-muted/50'
                )}
              >
                <Checkbox
                  checked={isPicked}
                  disabled={disabled}
                  onCheckedChange={() =>
                    toggleSelection(lesson.id, question.id, option.id)
                  }
                />
                <span
                  className={cn(
                    'flex-1 text-sm',
                    submitted && isAnswer && 'font-medium text-foreground',
                    isWrongPick && 'text-muted-foreground line-through'
                  )}
                >
                  {option.text}
                </span>
              </label>
            );
          })}
        </div>
      ) : (
        <RadioGroup
          value={outcome?.selectedOptionIds[0] ?? selected ?? ''}
          onValueChange={(value) =>
            setAnswer(lesson.id, question.id, String(value))
          }
          disabled={disabled}
          aria-label={question.prompt}
          className="gap-0"
        >
          {question.options.map((option) => {
            const isAnswer = outcome?.correctOptionIds.includes(option.id);
            const isWrongPick = submitted && picked(option.id) && !isAnswer;
            return (
              <label
                key={option.id}
                className={cn(
                  'flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors',
                  !disabled && 'cursor-pointer hover:bg-muted/50'
                )}
              >
                <RadioGroupItem value={option.id} />
                <span
                  className={cn(
                    'flex-1 text-sm',
                    submitted && isAnswer && 'font-medium text-foreground',
                    isWrongPick && 'text-muted-foreground line-through'
                  )}
                >
                  {option.text}
                </span>
              </label>
            );
          })}
        </RadioGroup>
      )}
    </fieldset>
  );
}

export function QuizView({ lesson }: { lesson: QuizLesson }) {
  const { isQuizComplete, applyQuizResult, quizResult, getSelections } =
    useCourse();
  const result = quizResult(lesson.id);
  const complete = isQuizComplete(lesson);
  const [submitError, setSubmitError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (isPending || !complete) {
      return;
    }

    setSubmitError(undefined);
    const selections: QuizSelections = Object.fromEntries(
      lesson.quiz.questions.map((question) => [
        question.id,
        [...getSelections(lesson.id, question.id)],
      ])
    );

    startTransition(async () => {
      try {
        const response = await saveQuizSubmission(lesson.id, selections);
        if ('error' in response) {
          setSubmitError(response.error);
          toast.error(response.error);
          return;
        }

        applyQuizResult(response.data.lessonId, response.data.result);
      } catch {
        const message = 'Could not submit the quiz. Please try again.';
        setSubmitError(message);
        toast.error(message);
      }
    });
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-6">
        {result ? <ResultBanner lesson={lesson} result={result} /> : null}

        {lesson.quiz.intro ? (
          <p className="text-[0.975rem]/7 text-foreground/90">
            {lesson.quiz.intro}
          </p>
        ) : null}

        <div className="flex flex-col gap-6">
          {lesson.quiz.questions.map((question, idx) => (
            <div key={question.id} className="flex flex-col gap-6">
              {idx > 0 ? <Separator /> : null}
              <Question
                lesson={lesson}
                question={question}
                isSubmitting={isPending}
              />
            </div>
          ))}
        </div>

        {!result ? (
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isPending || !complete}
              aria-busy={isPending}
            >
              {isPending ? (
                <>
                  <LoaderIcon
                    aria-hidden
                    className="animate-spin motion-reduce:animate-none"
                  />
                  Submitting…
                </>
              ) : (
                'Submit Answers'
              )}
            </Button>
            {submitError ? (
              <p role="alert" className="text-xs font-medium text-destructive">
                {submitError}
              </p>
            ) : !complete ? (
              <p className="text-xs text-muted-foreground">
                Answer every question to submit.
              </p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
