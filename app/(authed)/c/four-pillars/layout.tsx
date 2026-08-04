import { cookies } from 'next/headers';

import { COURSE_PANEL_COOKIE } from '@/config';

import { CourseWorkspace } from '@/app/(authed)/c/four-pillars/course-workspace';

import { parseCoursePanelState } from './course-panel-state';
import { FOUR_PILLARS_COURSE_SLUG, FOUR_PILLARS_SECTIONS } from './curriculum';

export default async function Layout({
  children,
}: LayoutProps<'/c/four-pillars'>) {
  const cookieStore = await cookies();
  const panelState = parseCoursePanelState(
    cookieStore.get(COURSE_PANEL_COOKIE)?.value
  );

  return (
    <CourseWorkspace
      courseSlug={FOUR_PILLARS_COURSE_SLUG}
      sections={FOUR_PILLARS_SECTIONS}
      panelState={panelState}
    >
      {children}
    </CourseWorkspace>
  );
}
