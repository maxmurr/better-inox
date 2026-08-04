'use client';

import type { ReactNode } from 'react';

import { CourseProvider } from '@/app/_components/course-provider';
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
  children,
}: {
  courseSlug: string;
  sections: readonly CourseSection[];
  panelState: CoursePanelState;
  children: ReactNode;
}) {
  return (
    <CoursePanelProvider initialState={panelState}>
      <CourseProvider>
        <div className="fixed inset-0 flex overflow-hidden [--course-panel-width:22rem]">
          <CourseMain>{children}</CourseMain>
          <CoursePanel courseSlug={courseSlug} sections={sections} />
        </div>
      </CourseProvider>
    </CoursePanelProvider>
  );
}

function CourseMain({ children }: { children: ReactNode }) {
  const { isOpen } = useCoursePanel();

  return (
    <div
      data-panel-open={isOpen}
      className="flex min-w-0 flex-1 flex-col transition-[padding-right] duration-250 ease-out-quart data-[panel-open=false]:duration-200 motion-reduce:transition-none lg:data-[panel-open=true]:pr-(--course-panel-width)"
    >
      {children}
    </div>
  );
}
