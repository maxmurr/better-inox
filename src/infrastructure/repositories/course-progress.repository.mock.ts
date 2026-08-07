import {
  courseLessonProgressSchema,
  courseQuizResultSchema,
  type CourseLessonProgress,
  type CourseLessonProgressWrite,
  type CourseProgressSnapshot,
  type CourseQuizResult,
  type CourseQuizResultWrite,
} from '@/src/entities/models/course-progress';
import type { ICourseProgressRepository } from '@/src/application/repositories/course-progress.repository.interface';

function sameContent(
  row: { userId: string; courseSlug: string; lessonId: string },
  input: { userId: string; courseSlug: string; lessonId: string }
) {
  return (
    row.userId === input.userId &&
    row.courseSlug === input.courseSlug &&
    row.lessonId === input.lessonId
  );
}

export class MockCourseProgressRepository implements ICourseProgressRepository {
  private lessonProgress: CourseLessonProgress[] = [];
  private quizResults: CourseQuizResult[] = [];

  async getCourseProgress(
    userId: string,
    courseSlug: string
  ): Promise<CourseProgressSnapshot> {
    return {
      lessons: this.lessonProgress.filter(
        (row) => row.userId === userId && row.courseSlug === courseSlug
      ),
      quizResults: this.quizResults.filter(
        (row) => row.userId === userId && row.courseSlug === courseSlug
      ),
    };
  }

  async upsertLessonProgress(
    progress: CourseLessonProgressWrite
  ): Promise<CourseLessonProgress> {
    const saved = courseLessonProgressSchema.parse({
      ...progress,
      updatedAt: new Date(),
    });
    const index = this.lessonProgress.findIndex((row) =>
      sameContent(row, progress)
    );

    if (index === -1) {
      this.lessonProgress.push(saved);
    } else {
      this.lessonProgress[index] = saved;
    }

    return saved;
  }

  async upsertQuizResult(
    result: CourseQuizResultWrite
  ): Promise<CourseQuizResult> {
    const saved = courseQuizResultSchema.parse({
      ...result,
      submittedAt: new Date(),
    });
    const index = this.quizResults.findIndex((row) => sameContent(row, result));

    if (index === -1) {
      this.quizResults.push(saved);
    } else {
      this.quizResults[index] = saved;
    }

    return saved;
  }
}
