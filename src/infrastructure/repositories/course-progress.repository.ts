import { and, eq, sql } from 'drizzle-orm';

import { DatabaseOperationError } from '@/src/entities/errors/common';
import {
  courseLessonProgressSchema,
  courseProgressSnapshotSchema,
  courseQuizResultSchema,
  lessonLearningResultsSnapshotSchema,
  type CourseLessonProgress,
  type CourseLessonProgressWrite,
  type CourseProgressSnapshot,
  type CourseQuizResult,
  type CourseQuizResultWrite,
  type LessonLearningResultsSnapshot,
} from '@/src/entities/models/course-progress';
import type { ICourseProgressRepository } from '@/src/application/repositories/course-progress.repository.interface';
import type { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

import { db } from '@/drizzle';
import {
  courseLessonProgress,
  courseQuizResults,
  users,
} from '@/drizzle/schema';

export class CourseProgressRepository implements ICourseProgressRepository {
  constructor(
    private readonly instrumentationService: IInstrumentationService,
    private readonly crashReporterService: ICrashReporterService
  ) {}

  async getCourseProgress(
    userId: string,
    courseSlug: string
  ): Promise<CourseProgressSnapshot> {
    return await this.instrumentationService.startSpan(
      { name: 'CourseProgressRepository > getCourseProgress' },
      async () => {
        try {
          const lessonsQuery = db.query.courseLessonProgress.findMany({
            where: and(
              eq(courseLessonProgress.userId, userId),
              eq(courseLessonProgress.courseSlug, courseSlug)
            ),
          });
          const quizResultsQuery = db.query.courseQuizResults.findMany({
            where: and(
              eq(courseQuizResults.userId, userId),
              eq(courseQuizResults.courseSlug, courseSlug)
            ),
          });

          const [lessons, quizResults] = await Promise.all([
            this.instrumentationService.startSpan(
              {
                name: lessonsQuery.toSQL().sql,
                op: 'db.query',
                attributes: { 'db.system': 'postgresql' },
              },
              () => lessonsQuery.execute()
            ),
            this.instrumentationService.startSpan(
              {
                name: quizResultsQuery.toSQL().sql,
                op: 'db.query',
                attributes: { 'db.system': 'postgresql' },
              },
              () => quizResultsQuery.execute()
            ),
          ]);

          return courseProgressSnapshotSchema.parse({ lessons, quizResults });
        } catch (err) {
          this.crashReporterService.report(err);
          throw new DatabaseOperationError('Cannot load course progress.', {
            cause: err,
          });
        }
      }
    );
  }

  async getLessonLearningResults(
    courseSlug: string,
    lessonId: string
  ): Promise<LessonLearningResultsSnapshot> {
    return await this.instrumentationService.startSpan(
      { name: 'CourseProgressRepository > getLessonLearningResults' },
      async () => {
        try {
          const lessonProgressQuery = db
            .select({
              learnerId: users.id,
              username: users.username,
              avatarUrl: users.avatar_url,
              completed: courseLessonProgress.completed,
              updatedAt: courseLessonProgress.updatedAt,
            })
            .from(courseLessonProgress)
            .innerJoin(users, eq(courseLessonProgress.userId, users.id))
            .where(
              and(
                eq(courseLessonProgress.courseSlug, courseSlug),
                eq(courseLessonProgress.lessonId, lessonId)
              )
            );
          const quizResultsQuery = db
            .select({
              learnerId: users.id,
              username: users.username,
              avatarUrl: users.avatar_url,
              correct: courseQuizResults.correct,
              total: courseQuizResults.total,
              passed: courseQuizResults.passed,
              submittedAt: courseQuizResults.submittedAt,
            })
            .from(courseQuizResults)
            .innerJoin(users, eq(courseQuizResults.userId, users.id))
            .where(
              and(
                eq(courseQuizResults.courseSlug, courseSlug),
                eq(courseQuizResults.lessonId, lessonId)
              )
            );

          const [lessonProgress, quizResults] = await Promise.all([
            this.instrumentationService.startSpan(
              {
                name: lessonProgressQuery.toSQL().sql,
                op: 'db.query',
                attributes: { 'db.system': 'postgresql' },
              },
              () => lessonProgressQuery.execute()
            ),
            this.instrumentationService.startSpan(
              {
                name: quizResultsQuery.toSQL().sql,
                op: 'db.query',
                attributes: { 'db.system': 'postgresql' },
              },
              () => quizResultsQuery.execute()
            ),
          ]);

          return lessonLearningResultsSnapshotSchema.parse({
            lessonProgress,
            quizResults,
          });
        } catch (err) {
          this.crashReporterService.report(err);
          throw new DatabaseOperationError('Cannot load lesson results.', {
            cause: err,
          });
        }
      }
    );
  }

  async upsertLessonProgress(
    progress: CourseLessonProgressWrite
  ): Promise<CourseLessonProgress> {
    return await this.instrumentationService.startSpan(
      { name: 'CourseProgressRepository > upsertLessonProgress' },
      async () => {
        try {
          const query = db
            .insert(courseLessonProgress)
            .values(progress)
            .onConflictDoUpdate({
              target: [
                courseLessonProgress.userId,
                courseLessonProgress.courseSlug,
                courseLessonProgress.lessonId,
              ],
              set: {
                completed: progress.completed,
                updatedAt: sql`now()`,
              },
            })
            .returning();

          const [saved] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'postgresql' },
            },
            () => query.execute()
          );

          if (!saved) {
            throw new DatabaseOperationError('Cannot save lesson completion.');
          }

          return courseLessonProgressSchema.parse(saved);
        } catch (err) {
          this.crashReporterService.report(err);
          if (err instanceof DatabaseOperationError) {
            throw err;
          }
          throw new DatabaseOperationError('Cannot save lesson completion.', {
            cause: err,
          });
        }
      }
    );
  }

  async upsertQuizResult(
    result: CourseQuizResultWrite
  ): Promise<CourseQuizResult> {
    return await this.instrumentationService.startSpan(
      { name: 'CourseProgressRepository > upsertQuizResult' },
      async () => {
        try {
          const query = db
            .insert(courseQuizResults)
            .values(result)
            .onConflictDoUpdate({
              target: [
                courseQuizResults.userId,
                courseQuizResults.courseSlug,
                courseQuizResults.lessonId,
              ],
              set: {
                outcomes: result.outcomes,
                correct: result.correct,
                total: result.total,
                passed: result.passed,
                submittedAt: sql`now()`,
              },
            })
            .returning();

          const [saved] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'postgresql' },
            },
            () => query.execute()
          );

          if (!saved) {
            throw new DatabaseOperationError('Cannot save quiz result.');
          }

          return courseQuizResultSchema.parse(saved);
        } catch (err) {
          this.crashReporterService.report(err);
          if (err instanceof DatabaseOperationError) {
            throw err;
          }
          throw new DatabaseOperationError('Cannot save quiz result.', {
            cause: err,
          });
        }
      }
    );
  }
}
