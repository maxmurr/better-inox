'use client';

import type { ReactNode } from 'react';

import { ListChecksIcon, MessageSquareTextIcon } from 'lucide-react';

import { Button } from '@/app/_components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/app/_components/ui/tooltip';
import {
  COURSE_PANEL_ID,
  useCoursePanel,
} from '@/app/(authed)/c/four-pillars/course-panel-context';
import type { CoursePanelId } from '@/app/(authed)/c/four-pillars/course-panel-state';

function PanelToggle({
  panel,
  label,
  children,
}: {
  panel: CoursePanelId;
  label: string;
  children: ReactNode;
}) {
  const { panel: activePanel, isOpen, toggle } = useCoursePanel();
  const isActive = isOpen && activePanel === panel;

  return (
    <Tooltip>
      <TooltipTrigger
        onClick={(event) => toggle(panel, event.currentTarget)}
        render={
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={label}
            aria-expanded={isActive}
            aria-controls={COURSE_PANEL_ID}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function CourseHeaderActions() {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <PanelToggle panel="comments" label="Comments">
        <MessageSquareTextIcon aria-hidden />
      </PanelToggle>
      <PanelToggle panel="lessons" label="Lessons">
        <ListChecksIcon aria-hidden />
      </PanelToggle>
    </div>
  );
}
