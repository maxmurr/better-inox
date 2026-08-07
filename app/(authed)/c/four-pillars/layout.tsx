import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';

import { COURSE_PANEL_COOKIE, SESSION_COOKIE } from '@/config';

import { getCourseProgressAdapter } from '@/app/_lib/adapters/course-progress.adapters';
import {
  reportAppErrorAdapter,
  startAppSpanAdapter,
} from '@/app/_lib/adapters/monitoring.adapters';
import { CourseWorkspace } from '@/app/(authed)/c/four-pillars/course-workspace';

import { parseCoursePanelState } from './course-panel-state';
import { FOUR_PILLARS_COURSE_SLUG, FOUR_PILLARS_SECTIONS } from './curriculum';

async function loadCourseProgress(sessionId: string | undefined) {
  return await startAppSpanAdapter(
    { name: 'loadFourPillarsProgress', op: 'function.nextjs' },
    async () => {
      try {
        return await getCourseProgressAdapter(
          FOUR_PILLARS_COURSE_SLUG,
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

export default async function Layout({
  children,
}: LayoutProps<'/c/four-pillars'>) {
  const cookieStore = await cookies();
  const panelState = parseCoursePanelState(
    cookieStore.get(COURSE_PANEL_COOKIE)?.value
  );
  const progress = await loadCourseProgress(
    cookieStore.get(SESSION_COOKIE)?.value
  );

  return (
    <CourseWorkspace
      courseSlug={FOUR_PILLARS_COURSE_SLUG}
      sections={FOUR_PILLARS_SECTIONS}
      panelState={panelState}
      initialProgress={progress}
    >
      {children}
    </CourseWorkspace>
  );
}
