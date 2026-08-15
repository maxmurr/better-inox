import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { ArrowLeftIcon } from 'lucide-react';

import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';

import { SESSION_COOKIE } from '@/config';

import { buttonVariants } from '@/app/_components/ui/button';
import { UserMenu } from '@/app/_components/user-menu';
import { cn } from '@/app/_components/utils';
import { getLessonLearningResultsAdapter } from '@/app/_lib/adapters/course-progress.adapters';
import {
  reportAppErrorAdapter,
  startAppSpanAdapter,
} from '@/app/_lib/adapters/monitoring.adapters';
import { getCurrentUser } from '@/app/(authed)/auth';
import { lessonHref } from '@/app/(authed)/c/four-pillars/course-href';
import { LessonLearningResults } from '@/app/(authed)/c/four-pillars/lesson-learning-results';

import { findLesson, FOUR_PILLARS_COURSE_SLUG } from '../../../curriculum';
import { findQuiz } from '../../../quiz-content';

async function loadLessonLearningResults(lessonId: string) {
  return await startAppSpanAdapter(
    { name: 'loadFourPillarsLessonResults', op: 'function.nextjs' },
    async () => {
      const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;

      try {
        return await getLessonLearningResultsAdapter(
          FOUR_PILLARS_COURSE_SLUG,
          lessonId,
          sessionId
        );
      } catch (err) {
        if (
          err instanceof UnauthenticatedError ||
          err instanceof AuthenticationError
        ) {
          redirect('/sign-in');
        }

        await reportAppErrorAdapter(err);
        throw err;
      }
    }
  );
}

export async function generateMetadata({
  params,
}: PageProps<'/c/four-pillars/[section]/[lesson]/results'>): Promise<Metadata> {
  const { section, lesson } = await params;
  const lessonTitle = findLesson(section, lesson)?.title;

  return { title: lessonTitle ? `${lessonTitle} results` : 'Lesson results' };
}

export default async function Page({
  params,
}: PageProps<'/c/four-pillars/[section]/[lesson]/results'>) {
  const { section, lesson } = await params;
  const currentLesson = findLesson(section, lesson);

  if (!currentLesson) {
    notFound();
  }

  const [user, results] = await Promise.all([
    getCurrentUser(),
    loadLessonLearningResults(currentLesson.id),
  ]);
  const originalLessonHref = lessonHref(
    FOUR_PILLARS_COURSE_SLUG,
    section,
    lesson
  );

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href={originalLessonHref}
            aria-label={`Back to lesson: ${currentLesson.title}`}
            className={cn(buttonVariants({ size: 'icon', variant: 'ghost' }))}
          >
            <ArrowLeftIcon aria-hidden />
          </Link>
          <p className="min-w-0 truncate font-heading text-base font-semibold text-foreground sm:text-lg">
            The 4 Pillars of Automated Tests
          </p>
        </div>
        <UserMenu username={user.username} avatarUrl={user.avatarUrl} />
      </header>

      <main
        id="main-content"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-8 sm:gap-10 sm:px-8 sm:py-10">
          <header className="flex flex-col gap-2">
            <p className="text-base font-medium text-muted-foreground sm:text-sm">
              Lesson results
            </p>
            <h1 className="max-w-[40ch] font-heading text-3xl font-semibold tracking-tight text-balance text-foreground">
              {currentLesson.title}
            </h1>
            <p className="max-w-[56ch] text-base text-pretty text-muted-foreground sm:text-sm">
              See who completed this lesson and their latest recorded
              understanding signal.
            </p>
          </header>

          <LessonLearningResults
            results={results}
            hasQuiz={Boolean(findQuiz(section, lesson))}
          />
        </div>
      </main>
    </>
  );
}
