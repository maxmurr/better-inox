'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  ArrowUpIcon,
  CircleCheckIcon,
  CircleIcon,
  MessageCircleIcon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/_components/ui/accordion';
import { Button } from '@/app/_components/ui/button';
import { cn } from '@/app/_components/utils';
import { lessonHref } from '@/app/(authed)/c/four-pillars/course-href';
import type { CourseSection } from '@/app/(authed)/c/four-pillars/course-outline';
import {
  COURSE_PANEL_ID,
  useCoursePanel,
} from '@/app/(authed)/c/four-pillars/course-panel-context';

const PANEL_TITLES = { comments: 'Comments', lessons: 'Lessons' } as const;

export function CoursePanel({
  courseSlug,
  sections,
}: {
  courseSlug: string;
  sections: readonly CourseSection[];
}) {
  const { panel, isOpen, panelRef, close } = useCoursePanel();
  const title = PANEL_TITLES[panel];

  return (
    <aside
      ref={panelRef}
      id={COURSE_PANEL_ID}
      aria-label={title}
      tabIndex={-1}
      inert={!isOpen}
      data-open={isOpen}
      className="fixed inset-y-0 right-0 z-30 flex w-full flex-col border-l border-border bg-background transition-transform duration-250 ease-out-quart outline-none data-[open=false]:translate-x-full data-[open=false]:duration-200 motion-reduce:transition-none lg:w-(--course-panel-width)"
    >
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-3 sm:px-4">
        <h2 className="min-w-0 truncate font-heading text-base leading-snug font-semibold tracking-tight text-foreground sm:text-lg">
          {title}
        </h2>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={`Close ${title.toLowerCase()}`}
          onClick={close}
        >
          <XIcon aria-hidden />
        </Button>
      </div>

      {panel === 'comments' ? (
        <CommentsPanel />
      ) : (
        <LessonsPanel courseSlug={courseSlug} sections={sections} />
      )}
    </aside>
  );
}

function activeSectionSlug(
  courseSlug: string,
  sections: readonly CourseSection[],
  pathname: string
) {
  return sections.find((section) =>
    section.lessons.some(
      (lesson) => lessonHref(courseSlug, section.slug, lesson.slug) === pathname
    )
  )?.slug;
}

function LessonsPanel({
  courseSlug,
  sections,
}: {
  courseSlug: string;
  sections: readonly CourseSection[];
}) {
  const { isOpen } = useCoursePanel();
  const pathname = usePathname();
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const activeSlug = activeSectionSlug(courseSlug, sections, pathname);

  const [openSections, setOpenSections] = useState<string[]>(() =>
    sections.map((section) => section.slug)
  );

  const [lastActiveSlug, setLastActiveSlug] = useState(activeSlug);

  if (activeSlug !== lastActiveSlug) {
    setLastActiveSlug(activeSlug);

    if (activeSlug && !openSections.includes(activeSlug)) {
      setOpenSections([...openSections, activeSlug]);
    }
  }

  useEffect(() => {
    if (isOpen) {
      activeLinkRef.current?.scrollIntoView({ block: 'center' });
    }
  }, [isOpen]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 sm:px-3">
      <Accordion
        multiple
        value={openSections}
        onValueChange={(value: string[]) => setOpenSections(value)}
        className="gap-1"
      >
        {sections.map((section) => (
          <AccordionItem
            key={section.slug}
            value={section.slug}
            className="not-last:border-b-0"
          >
            <AccordionTrigger
              indicator="start"
              className="min-h-9 gap-2 px-2 py-1.5 text-[13px] font-semibold hover:bg-muted/40 focus-visible:ring-inset pointer-coarse:min-h-11"
            >
              <span className="min-w-0 flex-1 text-pretty">
                {section.title}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-1 [&_a]:no-underline">
              <ul className="flex flex-col">
                {section.lessons.map((lesson) => {
                  const href = lessonHref(
                    courseSlug,
                    section.slug,
                    lesson.slug
                  );
                  const isActive = href === pathname;

                  return (
                    <li key={lesson.slug}>
                      <Link
                        ref={isActive ? activeLinkRef : undefined}
                        href={href}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'flex min-h-9 touch-manipulation items-center gap-3 rounded-lg border border-transparent px-2 py-1 text-sm transition-colors outline-none hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 pointer-coarse:min-h-11',
                          isActive && 'bg-muted'
                        )}
                      >
                        {lesson.completed ? (
                          <CircleCheckIcon
                            aria-hidden
                            className="size-4 shrink-0 text-success"
                          />
                        ) : (
                          <CircleIcon
                            aria-hidden
                            className="size-4 shrink-0 text-muted-foreground"
                          />
                        )}
                        <span
                          className={cn(
                            'min-w-0 flex-1 truncate',
                            isActive
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          )}
                        >
                          {lesson.title}
                        </span>
                        <span className="sr-only">
                          {lesson.completed ? 'Completed' : 'Not started'}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function CommentsPanel() {
  const [message, setMessage] = useState('');
  const canSend = message.trim().length > 0;

  function send() {
    if (!canSend) {
      return;
    }

    // TODO: post the comment once lesson comments have a backend.
    toast('Comments are not available yet.');
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
          <MessageCircleIcon aria-hidden className="size-5 text-foreground" />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="font-heading text-base font-semibold text-foreground">
            Say hi!
          </p>
          <p className="text-sm text-pretty text-muted-foreground">
            Be the first to comment on this lesson
          </p>
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
        className="shrink-0 border-t border-border p-3"
      >
        <div className="relative rounded-xl border border-input bg-muted/40 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            rows={3}
            placeholder="Type a message…"
            aria-label="Comment"
            className="w-full resize-none bg-transparent px-3 pt-2.5 pb-11 text-base outline-none placeholder:text-muted-foreground sm:text-sm"
          />
          <Button
            type="submit"
            size="icon"
            variant="secondary"
            disabled={!canSend}
            aria-label="Send comment"
            className="absolute right-2 bottom-2 rounded-full"
          >
            <ArrowUpIcon aria-hidden />
          </Button>
        </div>
      </form>
    </>
  );
}
