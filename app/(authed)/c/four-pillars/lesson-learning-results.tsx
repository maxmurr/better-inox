import { UsersIcon } from 'lucide-react';

import { Badge } from '@/app/_components/ui/badge';
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
import type { LessonLearningResultsData } from '@/app/_lib/adapters/course-progress.adapters';

const percentageFormatter = new Intl.NumberFormat('en', {
  style: 'percent',
  maximumFractionDigits: 0,
});

type LessonLearner = LessonLearningResultsData['learners'][number];

function formatPercentage(value: number) {
  return percentageFormatter.format(value);
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
          <div className="flex min-w-0 flex-col gap-1 py-4 @sm:py-5 @sm:pr-5">
            <dt className="truncate text-base font-medium text-foreground sm:text-sm">
              Started
            </dt>
            <dd className="font-heading text-2xl font-semibold text-foreground tabular-nums">
              {summary.startedCount}
            </dd>
            <dd className="text-base text-pretty text-muted-foreground sm:text-sm">
              Learners with recorded activity.
            </dd>
          </div>
          <div className="flex min-w-0 flex-col gap-1 py-4 @sm:p-5">
            <dt className="truncate text-base font-medium text-foreground sm:text-sm">
              Completed
            </dt>
            <dd className="font-heading text-2xl font-semibold text-foreground tabular-nums">
              {summary.completedCount} of {summary.startedCount}
            </dd>
            <dd className="text-base text-pretty text-muted-foreground sm:text-sm">
              {formatPercentage(summary.completionRate)} completion.
            </dd>
          </div>
          <div className="flex min-w-0 flex-col gap-1 py-4 @sm:py-5 @sm:pl-5">
            <dt className="truncate text-base font-medium text-foreground sm:text-sm">
              {hasQuiz ? 'Average quiz score' : 'Understanding signal'}
            </dt>
            <dd className="font-heading text-2xl font-semibold text-foreground tabular-nums">
              {hasQuiz && summary.averageQuizScore !== null
                ? formatPercentage(summary.averageQuizScore)
                : '—'}
            </dd>
            <dd className="text-base text-pretty text-muted-foreground sm:text-sm">
              {hasQuiz
                ? `${summary.quizSubmissionCount} quiz ${summary.quizSubmissionCount === 1 ? 'submission' : 'submissions'}.`
                : 'This lesson uses completion only.'}
            </dd>
          </div>
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
                    <p className="max-w-56 min-w-0 truncate font-medium text-foreground">
                      {learner.username}
                    </p>
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

/** Shows minimal lesson summary plus one result row per recorded learner. */
export function LessonLearningResults({
  results,
  hasQuiz,
}: {
  results: LessonLearningResultsData;
  hasQuiz: boolean;
}) {
  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <LessonResultsSummary results={results} hasQuiz={hasQuiz} />

      <section
        aria-labelledby="lesson-learners-title"
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2
              id="lesson-learners-title"
              className="font-heading text-xl font-semibold text-balance text-foreground"
            >
              Learners
            </h2>
            <p className="text-base text-muted-foreground tabular-nums sm:text-sm">
              {results.learners.length} started
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
          <CompactLearnerResultsTable
            learners={results.learners}
            hasQuiz={hasQuiz}
          />
        )}
      </section>
    </div>
  );
}
