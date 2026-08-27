import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { UnauthenticatedError } from '@/src/entities/errors/auth';

import { SESSION_COOKIE } from '@/config';

import { UserMenu } from '@/app/_components/user-menu';
import { getLessonLearningResultsAdapter } from '@/app/_lib/adapters/course-progress.adapters';
import {
  reportAppErrorAdapter,
  startAppSpanAdapter,
} from '@/app/_lib/adapters/monitoring.adapters';
import { getCurrentUser } from '@/app/(authed)/auth';
import { lessonHref } from '@/app/(authed)/c/four-pillars/course-href';
import {
  FourPillarsCourseHeader,
  FourPillarsCourseMain,
} from '@/app/(authed)/c/four-pillars/course-page-shell';
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
        if (err instanceof UnauthenticatedError) {
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
      <FourPillarsCourseHeader
        actions={
          <UserMenu username={user.username} avatarUrl={user.avatarUrl} />
        }
        back={{
          href: originalLessonHref,
          label: `Back to lesson: ${currentLesson.title}`,
        }}
        titleAs="p"
      />

      <FourPillarsCourseMain maxWidth="5xl">
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
      </FourPillarsCourseMain>
    </>
  );
}
