'use client';

import { useState } from 'react';

import { CheckIcon, XIcon } from 'lucide-react';

import { useCourse } from '@/app/_components/course-provider';
import {
  isAnswered,
  type QuestionOutcome,
  type QuizAttemptResult,
  type QuizLesson,
  type QuizQuestion,
} from '@/app/_components/quiz';
import { Button } from '@/app/_components/ui/button';
import { Card, CardContent } from '@/app/_components/ui/card';
import { Checkbox } from '@/app/_components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/app/_components/ui/radio-group';
import { Separator } from '@/app/_components/ui/separator';
import { cn } from '@/app/_components/utils';

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
  const pct = Math.round(result.score * 100);

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
                🎉 You <span className="font-medium text-success">passed</span>{' '}
                the quiz. Great job!
              </>
            ) : (
              <>
                Not quite — you scored below the passing mark. Review the lesson
                and try again.
              </>
            )}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => retakeQuiz(lesson.id)}
          >
            Retake quiz
          </Button>
        </div>
        <div className="flex gap-10">
          <Stat label="Score" value={`${pct}%`} />
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
  attemptedSubmit,
}: {
  lesson: QuizLesson;
  question: QuizQuestion;
  attemptedSubmit: boolean;
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
  const outcome = outcomeFor(lesson.id, question.id);
  const selected = getAnswer(lesson.id, question.id);
  const selections = getSelections(lesson.id, question.id);
  const answer = question.kind === 'multiple' ? selections : selected;
  const invalid =
    attemptedSubmit && !submitted && !isAnswered(question, answer);

  const picked = (optionId: string) =>
    outcome
      ? outcome.selectedOptionIds.includes(optionId)
      : question.kind === 'multiple'
        ? selections.includes(optionId)
        : selected === optionId;

  return (
    <fieldset
      id={`q-${question.id}`}
      className="flex scroll-mt-4 flex-col gap-3"
    >
      <legend className="mb-3 text-base font-semibold">
        {question.prompt}
        {invalid ? (
          <span className="text-destructive">
            {' *'}
            <span className="sr-only">(required)</span>
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
                  !submitted && 'cursor-pointer hover:bg-muted/50'
                )}
              >
                <Checkbox
                  checked={isPicked}
                  disabled={submitted}
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
          disabled={submitted}
          aria-label={question.prompt}
          aria-invalid={invalid || undefined}
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
                  !submitted && 'cursor-pointer hover:bg-muted/50'
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

      {invalid ? (
        <p className="text-xs font-medium text-destructive">
          {question.kind === 'multiple'
            ? 'Select at least one option to continue.'
            : 'Select an answer to continue.'}
        </p>
      ) : null}
    </fieldset>
  );
}

export function QuizView({ lesson }: { lesson: QuizLesson }) {
  const { isQuizComplete, submitQuiz, quizResult, getAnswer, getSelections } =
    useCourse();
  const result = quizResult(lesson.id);
  const complete = isQuizComplete(lesson);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const handleSubmit = () => {
    if (!complete) {
      setAttemptedSubmit(true);
      const firstUnanswered = lesson.quiz.questions.find((question) =>
        question.kind === 'multiple'
          ? getSelections(lesson.id, question.id).length === 0
          : !getAnswer(lesson.id, question.id)
      );
      const el = firstUnanswered
        ? document.getElementById(`q-${firstUnanswered.id}`)
        : null;
      if (el) {
        const reduce = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;
        el.scrollIntoView({
          behavior: reduce ? 'auto' : 'smooth',
          block: 'center',
        });
        el.querySelector<HTMLElement>(
          '[role="radio"], [role="checkbox"], input'
        )?.focus();
      }
      return;
    }
    setAttemptedSubmit(false);
    submitQuiz(lesson);
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
                attemptedSubmit={attemptedSubmit}
              />
            </div>
          ))}
        </div>

        {!result ? (
          <div className="flex flex-col gap-2">
            <Button onClick={handleSubmit}>Submit answers</Button>
            {!complete ? (
              attemptedSubmit ? (
                <p
                  role="alert"
                  className="text-xs font-medium text-destructive"
                >
                  Answer every question before submitting.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Answer every question to submit.
                </p>
              )
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
