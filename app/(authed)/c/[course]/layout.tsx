import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { UnauthenticatedError } from '@/src/entities/errors/auth';

import { COURSE_PANEL_COOKIE, SESSION_COOKIE } from '@/config';

import { getCourseProgressAdapter } from '@/app/_lib/adapters/course-progress.adapters';
import {
  reportAppErrorAdapter,
  startAppSpanAdapter,
} from '@/app/_lib/adapters/monitoring.adapters';
import { CourseWorkspace } from '@/app/(authed)/c/[course]/course-workspace';

import { loadCourse } from './course-content';
import { parseCoursePanelState } from './course-panel-state';

async function loadCourseProgress(
  courseSlug: string,
  sessionId: string | undefined
) {
  return await startAppSpanAdapter(
    { name: 'loadCourseProgress', op: 'function.nextjs' },
    async () => {
      try {
        return await getCourseProgressAdapter(courseSlug, sessionId);
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

export default async function Layout({
  children,
  params,
}: LayoutProps<'/c/[course]'>) {
  const course = await loadCourse((await params).course);
  if (!course) {
    notFound();
  }

  const cookieStore = await cookies();
  const panelState = parseCoursePanelState(
    cookieStore.get(COURSE_PANEL_COOKIE)?.value
  );
  const progress = await loadCourseProgress(
    course.slug,
    cookieStore.get(SESSION_COOKIE)?.value
  );

  return (
    <CourseWorkspace
      courseSlug={course.slug}
      sections={course.sections}
      panelState={panelState}
      initialProgress={progress}
    >
      {children}
    </CourseWorkspace>
  );
}
