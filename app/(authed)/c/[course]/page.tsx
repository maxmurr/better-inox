import { notFound } from 'next/navigation';

import { UserMenu } from '@/app/_components/user-menu';
import { CourseContinueLink } from '@/app/(authed)/c/[course]/course-continue-link';
import { CourseOutline } from '@/app/(authed)/c/[course]/course-outline';
import {
  CoursePageHeader,
  CoursePageMain,
} from '@/app/(authed)/c/[course]/course-page-shell';

import { getCurrentUser } from '../../auth';
import { loadCourse } from './course-content';

export default async function Page({ params }: PageProps<'/c/[course]'>) {
  const [course, user] = await Promise.all([
    params.then(({ course }) => loadCourse(course)),
    getCurrentUser(),
  ]);
  if (!course) {
    notFound();
  }

  return (
    <>
      <CoursePageHeader
        courseTitle={course.title}
        actions={
          <UserMenu username={user.username} avatarUrl={user.avatarUrl} />
        }
      />

      <CoursePageMain>
        <section
          aria-labelledby="course-welcome"
          className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3"
        >
          <h2
            id="course-welcome"
            className="min-w-0 flex-1 font-heading text-2xl font-bold tracking-tight text-balance wrap-break-word text-foreground sm:text-3xl"
          >
            Welcome, {user.username}.
          </h2>
          <CourseContinueLink
            courseSlug={course.slug}
            sections={course.sections}
          />
        </section>

        <section
          aria-labelledby="course-content"
          className="flex flex-col gap-4"
        >
          <h2
            id="course-content"
            className="font-heading text-lg/snug font-medium tracking-tight text-balance text-foreground"
          >
            Content
          </h2>
          <CourseOutline courseSlug={course.slug} sections={course.sections} />
        </section>
      </CoursePageMain>
    </>
  );
}
