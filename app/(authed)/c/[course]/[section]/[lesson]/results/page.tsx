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
import { lessonHref } from '@/app/(authed)/c/[course]/course-href';
import {
  CoursePageHeader,
  CoursePageMain,
} from '@/app/(authed)/c/[course]/course-page-shell';
import { LessonLearningResults } from '@/app/(authed)/c/[course]/lesson-learning-results';

import { loadCourse, loadLesson } from '../../../course-content';
import { findLesson } from '../../../curriculum';

async function loadLessonLearningResults(courseSlug: string, lessonId: string) {
  return await startAppSpanAdapter(
    { name: 'loadLessonLearningResults', op: 'function.nextjs' },
    async () => {
      const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;

      try {
        return await getLessonLearningResultsAdapter(
          courseSlug,
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
}: PageProps<'/c/[course]/[section]/[lesson]/results'>): Promise<Metadata> {
  const { course: courseSlug, section, lesson } = await params;
  const course = await loadCourse(courseSlug);
  const lessonTitle =
    course && findLesson(course.sections, section, lesson)?.title;

  return { title: lessonTitle ? `${lessonTitle} results` : 'Lesson results' };
}

export default async function Page({
  params,
}: PageProps<'/c/[course]/[section]/[lesson]/results'>) {
  const { course: courseSlug, section, lesson } = await params;
  const course = await loadCourse(courseSlug);
  const currentLesson = course && findLesson(course.sections, section, lesson);

  if (!course || !currentLesson) {
    notFound();
  }

  const [user, results, { quiz }] = await Promise.all([
    getCurrentUser(),
    loadLessonLearningResults(course.slug, currentLesson.id),
    loadLesson(course.slug, section, lesson),
  ]);
  const originalLessonHref = lessonHref(course.slug, section, lesson);

  return (
    <>
      <CoursePageHeader
        courseTitle={course.title}
        actions={
          <UserMenu username={user.username} avatarUrl={user.avatarUrl} />
        }
        back={{
          href: originalLessonHref,
          label: `Back to lesson: ${currentLesson.title}`,
        }}
        titleAs="p"
      />

      <CoursePageMain maxWidth="5xl">
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

        <LessonLearningResults results={results} hasQuiz={Boolean(quiz)} />
      </CoursePageMain>
    </>
  );
}
