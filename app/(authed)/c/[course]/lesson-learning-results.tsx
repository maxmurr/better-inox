import Link from 'next/link';

import { UsersIcon } from 'lucide-react';

import { Badge } from '@/app/_components/ui/badge';
import { Button, buttonVariants } from '@/app/_components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/app/_components/ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/ui/table';
import { UserAvatar } from '@/app/_components/user-avatar';
import { cn } from '@/app/_components/utils';
import type { LessonLearningResultsData } from '@/app/_lib/adapters/course-progress.adapters';
import type { LessonResultsHref } from '@/app/(authed)/c/[course]/course-href';
import {
  LEARNERS_PAGE_SIZE,
  learnersPage,
} from '@/app/(authed)/c/[course]/learner-pages';

const percentageFormatter = new Intl.NumberFormat('en', {
  style: 'percent',
  maximumFractionDigits: 0,
});

type LessonLearner = LessonLearningResultsData['learners'][number];

const LEARNERS_HEADING_ID = 'lesson-learners-title';

const countFormatter = new Intl.NumberFormat('en');

function formatCount(value: number) {
  return countFormatter.format(value);
}

function formatPercentage(value: number) {
  return percentageFormatter.format(value);
}

function LessonResultMetric({
  className,
  description,
  label,
  value,
}: {
  className?: string;
  description: React.ReactNode;
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1', className)}>
      <dt className="truncate text-base font-medium text-foreground sm:text-sm">
        {label}
      </dt>
      <dd className="font-heading text-2xl font-semibold text-foreground tabular-nums">
        {value}
      </dd>
      <dd className="text-base text-pretty text-muted-foreground sm:text-sm">
        {description}
      </dd>
    </div>
  );
}

// Usernames that collide differ only in their suffix (`name2`, `name1b2c3`), so
// the end stays visible and the middle is elided.
function MiddleTruncatedName({ name }: { name: string }) {
  const tail = name.slice(-6);

  return (
    <p title={name} className="max-w-56 min-w-0 font-medium text-foreground">
      <span aria-hidden className="flex">
        <span className="overflow-hidden text-ellipsis whitespace-pre">
          {name.slice(0, -tail.length)}
        </span>
        <span className="shrink-0 whitespace-pre">{tail}</span>
      </span>
      <span className="sr-only">{name}</span>
    </p>
  );
}

function CompletionBadge({ completed }: { completed: boolean }) {
  return (
    <Badge variant={completed ? 'secondary' : 'outline'}>
      {completed ? 'Completed' : 'In progress'}
    </Badge>
  );
}

function QuizStatusBadge({
  learner,
  hasQuiz,
}: {
  learner: LessonLearner;
  hasQuiz: boolean;
}) {
  if (!hasQuiz) {
    return <Badge variant="outline">Completion only</Badge>;
  }
  if (!learner.quizResult) {
    return <Badge variant="outline">Not submitted</Badge>;
  }
  return (
    <Badge variant={learner.quizResult.passed ? 'secondary' : 'destructive'}>
      {learner.quizResult.passed ? 'Passed' : 'Needs review'}
    </Badge>
  );
}

function LessonResultsSummary({
  results,
  hasQuiz,
}: {
  results: LessonLearningResultsData;
  hasQuiz: boolean;
}) {
  const { summary } = results;

  return (
    <section aria-labelledby="lesson-results-summary-title">
      <h2 id="lesson-results-summary-title" className="sr-only">
        Results summary
      </h2>
      <div className="@container">
        <dl className="grid divide-y divide-border border-y border-border @sm:grid-cols-3 @sm:divide-x @sm:divide-y-0">
          <LessonResultMetric
            label="Started"
            value={formatCount(summary.startedCount)}
            description="Learners with recorded activity."
            className="py-4 @sm:py-5 @sm:pr-5"
          />
          <LessonResultMetric
            label="Completed"
            value={`${formatCount(summary.completedCount)} of ${formatCount(summary.startedCount)}`}
            description={`${formatPercentage(summary.completionRate)} completion.`}
            className="py-4 @sm:p-5"
          />
          <LessonResultMetric
            label={hasQuiz ? 'Average quiz score' : 'Understanding signal'}
            value={
              hasQuiz && summary.averageQuizScore !== null
                ? formatPercentage(summary.averageQuizScore)
                : '—'
            }
            description={
              hasQuiz
                ? `${formatCount(summary.quizSubmissionCount)} quiz ${summary.quizSubmissionCount === 1 ? 'submission' : 'submissions'}.`
                : 'This lesson uses completion only.'
            }
            className="py-4 @sm:py-5 @sm:pl-5"
          />
        </dl>
      </div>
    </section>
  );
}

function CompactLearnerResultsTable({
  learners,
  hasQuiz,
}: {
  learners: LessonLearningResultsData['learners'];
  hasQuiz: boolean;
}) {
  return (
    <div className="-mx-5 -my-2 overflow-x-auto whitespace-nowrap sm:-mx-8">
      <div className="inline-block min-w-full px-5 py-2 align-middle sm:px-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Learner</TableHead>
              <TableHead className="px-6 text-center">Completion</TableHead>
              <TableHead className="px-6">Score</TableHead>
              <TableHead className="px-6 text-center">Understanding</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {learners.map((learner) => (
              <TableRow key={learner.learnerId}>
                <TableCell className="py-3.5 pr-6 pl-0">
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar
                      username={learner.username}
                      avatarUrl={learner.avatarUrl}
                    />
                    <MiddleTruncatedName name={learner.username} />
                  </div>
                </TableCell>
                <TableCell className="px-6 py-3.5 text-center">
                  <CompletionBadge completed={learner.completed} />
                </TableCell>
                <TableCell className="px-6 py-3.5">
                  <p className="text-muted-foreground tabular-nums">
                    {learner.quizResult
                      ? `${formatPercentage(learner.quizResult.score)} · ${learner.quizResult.correct}/${learner.quizResult.total}`
                      : '—'}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-3.5 text-center">
                  <QuizStatusBadge learner={learner} hasQuiz={hasQuiz} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function LearnerPageLink({
  href,
  label,
}: {
  href:
    | `${LessonResultsHref}${'' | `?page=${number}`}#${typeof LEARNERS_HEADING_ID}`
    | undefined;
  label: string;
}) {
  if (!href) {
    return (
      <Button type="button" size="sm" variant="outline" disabled>
        {label}
      </Button>
    );
  }

  return (
    <Link
      href={href}
      className={buttonVariants({ size: 'sm', variant: 'outline' })}
    >
      {label}
    </Link>
  );
}

function LearnerPagination({
  page,
  pageCount,
  start,
  total,
  resultsHref,
}: {
  page: number;
  pageCount: number;
  start: number;
  total: number;
  resultsHref: LessonResultsHref;
}) {
  // The heading anchor scrolls the nested <main> back to the top of the list.
  const pageHref = (target: number) =>
    target === 1
      ? (`${resultsHref}#${LEARNERS_HEADING_ID}` as const)
      : (`${resultsHref}?page=${target}#${LEARNERS_HEADING_ID}` as const);

  return (
    <nav
      aria-label="Learner pages"
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-base text-muted-foreground tabular-nums sm:text-sm">
        Showing {formatCount(start + 1)}–
        {formatCount(Math.min(start + LEARNERS_PAGE_SIZE, total))} of{' '}
        {formatCount(total)}
      </p>
      <div className="flex gap-2">
        <LearnerPageLink
          label="Previous"
          href={page > 1 ? pageHref(page - 1) : undefined}
        />
        <LearnerPageLink
          label="Next"
          href={page < pageCount ? pageHref(page + 1) : undefined}
        />
      </div>
    </nav>
  );
}

/** Shows minimal lesson summary plus one page of learner result rows. */
export function LessonLearningResults({
  results,
  hasQuiz,
  requestedPage,
  resultsHref,
}: {
  results: LessonLearningResultsData;
  hasQuiz: boolean;
  requestedPage: number;
  resultsHref: LessonResultsHref;
}) {
  const { learners, page, pageCount, start } = learnersPage(
    results.learners,
    requestedPage
  );

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <LessonResultsSummary results={results} hasQuiz={hasQuiz} />

      <section
        aria-labelledby={LEARNERS_HEADING_ID}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2
              id={LEARNERS_HEADING_ID}
              className="font-heading text-xl font-semibold text-balance text-foreground"
            >
              Learners
            </h2>
            <p className="text-base text-muted-foreground tabular-nums sm:text-sm">
              {formatCount(results.learners.length)} started
            </p>
          </div>
          <p className="max-w-[56ch] text-base text-pretty text-muted-foreground sm:text-sm">
            Latest recorded completion
            {hasQuiz ? ' and quiz result' : ''} for each learner.
          </p>
        </div>

        {results.learners.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <UsersIcon className="size-4 shrink-0" aria-hidden />
              <EmptyTitle>No learner activity yet</EmptyTitle>
              <EmptyDescription>
                Results will appear after learners complete this lesson or
                submit its quiz.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <CompactLearnerResultsTable learners={learners} hasQuiz={hasQuiz} />
            {pageCount > 1 ? (
              <LearnerPagination
                page={page}
                pageCount={pageCount}
                start={start}
                total={results.learners.length}
                resultsHref={resultsHref}
              />
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
