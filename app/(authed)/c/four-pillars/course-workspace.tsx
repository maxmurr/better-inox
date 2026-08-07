'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import type { LearnerCourseProgress } from '@/src/entities/models/course-progress';

import { CourseProvider } from '@/app/_components/course-provider';
import { lessonHref } from '@/app/(authed)/c/four-pillars/course-href';
import type { CourseSection } from '@/app/(authed)/c/four-pillars/course-outline';
import { CoursePanel } from '@/app/(authed)/c/four-pillars/course-panel';
import {
  CoursePanelProvider,
  useCoursePanel,
} from '@/app/(authed)/c/four-pillars/course-panel-context';
import type { CoursePanelState } from '@/app/(authed)/c/four-pillars/course-panel-state';

export function CourseWorkspace({
  courseSlug,
  sections,
  panelState,
  initialProgress,
  children,
}: {
  courseSlug: string;
  sections: readonly CourseSection[];
  panelState: CoursePanelState;
  initialProgress: LearnerCourseProgress;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const showsCoursePanel = sections.some((section) =>
    section.lessons.some(
      (lesson) => lessonHref(courseSlug, section.slug, lesson.slug) === pathname
    )
  );

  return (
    <CoursePanelProvider initialState={panelState}>
      <CourseProvider initialProgress={initialProgress}>
        <div className="fixed inset-0 flex overflow-hidden pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)] [--course-panel-width:22rem]">
          <CourseMain showsCoursePanel={showsCoursePanel}>
            {children}
          </CourseMain>
          {showsCoursePanel ? (
            <CoursePanel courseSlug={courseSlug} sections={sections} />
          ) : null}
        </div>
      </CourseProvider>
    </CoursePanelProvider>
  );
}

function CourseMain({
  showsCoursePanel,
  children,
}: {
  showsCoursePanel: boolean;
  children: ReactNode;
}) {
  const { isOpen, isModal } = useCoursePanel();
  const isCoursePanelOpen = showsCoursePanel && isOpen;

  return (
    <div
      data-panel-open={isCoursePanelOpen}
      inert={showsCoursePanel && isModal}
      className="flex min-w-0 flex-1 flex-col transition-[padding-right] duration-250 ease-out-quart data-[panel-open=false]:duration-200 motion-reduce:transition-none lg:data-[panel-open=true]:pr-(--course-panel-width)"
    >
      {children}
    </div>
  );
}
