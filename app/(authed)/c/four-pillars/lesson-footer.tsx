'use client';

import type { Route } from 'next';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { ArrowRightIcon, CircleCheckIcon, LoaderIcon } from 'lucide-react';
import { toast } from 'sonner';

import { useCourse } from '@/app/_components/course-provider';
import { Button } from '@/app/_components/ui/button';

import { saveLessonCompletion } from './actions';

export function LessonFooter<T extends string>({
  lessonId,
  nextLessonHref,
  isQuizLesson,
  requiredPopQuestionIds,
}: {
  lessonId: string;
  nextLessonHref: Route<T> | undefined;
  isQuizLesson: boolean;
  requiredPopQuestionIds: readonly string[];
}) {
  const {
    isLessonCompleted,
    applyLessonCompletion,
    hasSavedQuizResult,
    isPopQuestionSubmitted,
  } = useCourse();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const completed = isLessonCompleted(lessonId);
  const hasUnsubmittedQuiz = isQuizLesson && !hasSavedQuizResult(lessonId);
  const hasUnsubmittedPopQuestion = requiredPopQuestionIds.some(
    (questionId) => !isPopQuestionSubmitted(questionId)
  );
  const needsRequiredSubmission =
    !completed && (hasUnsubmittedQuiz || hasUnsubmittedPopQuestion);

  function updateCompletion() {
    if (isPending || needsRequiredSubmission) {
      return;
    }

    const desiredCompletion = !completed;
    startTransition(async () => {
      try {
        const response = await saveLessonCompletion(
          lessonId,
          desiredCompletion
        );

        if ('error' in response) {
          toast.error(response.error);
          return;
        }

        applyLessonCompletion(response.data.lessonId, response.data.completed);
        if (response.data.completed && nextLessonHref) {
          router.push(nextLessonHref);
        }
      } catch {
        toast.error('Could not save lesson progress. Please try again.');
      }
    });
  }

  return (
    <footer className="flex shrink-0 items-center justify-center border-t border-border bg-background px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <Button
        type="button"
        size="lg"
        variant={completed ? 'secondary' : 'default'}
        aria-pressed={completed}
        aria-busy={isPending}
        disabled={isPending || needsRequiredSubmission}
        className="gap-2 rounded-full px-4"
        onClick={updateCompletion}
      >
        {isPending ? (
          <>
            <LoaderIcon
              aria-hidden
              className="animate-spin motion-reduce:animate-none"
            />
            Saving…
          </>
        ) : completed ? (
          <>
            <CircleCheckIcon aria-hidden className="size-4 text-success" />
            Completed
          </>
        ) : (
          <>
            Complete Lesson
            <ArrowRightIcon aria-hidden />
          </>
        )}
      </Button>
    </footer>
  );
}
