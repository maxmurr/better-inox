import { z } from 'zod';

import {
  questionOutcomeSchema,
  quizAttemptResultSchema,
  type QuestionOutcome,
} from '@/src/entities/models/quiz';

export { questionOutcomeSchema, type QuestionOutcome };

const contentIdSchema = z.string().trim().min(1);

export const courseLessonProgressSchema = z.object({
  userId: contentIdSchema,
  courseSlug: contentIdSchema,
  lessonId: contentIdSchema,
  completed: z.boolean(),
  updatedAt: z.date(),
});
export type CourseLessonProgress = z.infer<typeof courseLessonProgressSchema>;

export const courseQuizResultSchema = z
  .object({
    userId: contentIdSchema,
    courseSlug: contentIdSchema,
    lessonId: contentIdSchema,
    outcomes: z.array(questionOutcomeSchema).min(1),
    correct: z.number().int().nonnegative(),
    total: z.number().int().positive(),
    passed: z.boolean(),
    submittedAt: z.date(),
  })
  .refine(({ correct, total }) => correct <= total, {
    message: 'Correct answers cannot exceed total questions',
    path: ['correct'],
  });
export type CourseQuizResult = z.infer<typeof courseQuizResultSchema>;

export const courseProgressSnapshotSchema = z.object({
  lessons: z.array(courseLessonProgressSchema),
  quizResults: z.array(courseQuizResultSchema),
});
export type CourseProgressSnapshot = z.infer<
  typeof courseProgressSnapshotSchema
>;

export const learnerCourseProgressSchema = z.object({
  completedLessonIds: z.array(contentIdSchema),
  quizResults: z.array(
    z.object({
      lessonId: contentIdSchema,
      result: quizAttemptResultSchema,
    })
  ),
});
export type LearnerCourseProgress = z.infer<typeof learnerCourseProgressSchema>;

export type CourseLessonProgressWrite = Pick<
  CourseLessonProgress,
  'userId' | 'courseSlug' | 'lessonId' | 'completed'
>;

export type CourseQuizResultWrite = Pick<
  CourseQuizResult,
  | 'userId'
  | 'courseSlug'
  | 'lessonId'
  | 'outcomes'
  | 'correct'
  | 'total'
  | 'passed'
>;

export function quizScore(result: Pick<CourseQuizResult, 'correct' | 'total'>) {
  return result.total === 0 ? 0 : result.correct / result.total;
}
