import { UserMenu } from '@/app/_components/user-menu';
import { CourseContinueLink } from '@/app/(authed)/c/four-pillars/course-continue-link';
import { CourseOutline } from '@/app/(authed)/c/four-pillars/course-outline';

import { getCurrentUser } from '../../auth';
import { FOUR_PILLARS_COURSE_SLUG, FOUR_PILLARS_SECTIONS } from './curriculum';

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-3 sm:px-4">
        <h1 className="min-w-0 font-heading text-base/snug font-semibold tracking-tight text-balance text-foreground sm:text-lg">
          The 4 Pillars of Automated Tests
        </h1>
        <UserMenu username={user.username} avatarUrl={user.avatarUrl} />
      </header>

      <main
        id="main-content"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-5 py-8 sm:gap-10 sm:px-8 sm:py-10">
          <section
            aria-labelledby="four-pillars-welcome"
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3"
          >
            <h2
              id="four-pillars-welcome"
              className="min-w-0 flex-1 font-heading text-2xl font-bold tracking-tight text-balance wrap-break-word text-foreground sm:text-3xl"
            >
              Welcome, {user.username}.
            </h2>
            <CourseContinueLink />
          </section>

          <section
            aria-labelledby="four-pillars-content"
            className="flex flex-col gap-4"
          >
            <h2
              id="four-pillars-content"
              className="font-heading text-lg/snug font-medium tracking-tight text-balance text-foreground"
            >
              Content
            </h2>
            <CourseOutline
              courseSlug={FOUR_PILLARS_COURSE_SLUG}
              sections={FOUR_PILLARS_SECTIONS}
            />
          </section>
        </div>
      </main>
    </>
  );
}
