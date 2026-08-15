import {
  courseLessonProgressSchema,
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
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';

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

  constructor(private readonly usersRepository: IUsersRepository) {}

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

  async getLessonLearningResults(
    courseSlug: string,
    lessonId: string
  ): Promise<LessonLearningResultsSnapshot> {
    const lessonProgress = await Promise.all(
      this.lessonProgress
        .filter(
          (row) => row.courseSlug === courseSlug && row.lessonId === lessonId
        )
        .map(async (row) => ({
          ...(await this.getLearnerIdentity(row.userId)),
          completed: row.completed,
          updatedAt: row.updatedAt,
        }))
    );
    const quizResults = await Promise.all(
      this.quizResults
        .filter(
          (row) => row.courseSlug === courseSlug && row.lessonId === lessonId
        )
        .map(async (row) => ({
          ...(await this.getLearnerIdentity(row.userId)),
          correct: row.correct,
          total: row.total,
          passed: row.passed,
          submittedAt: row.submittedAt,
        }))
    );

    return lessonLearningResultsSnapshotSchema.parse({
      lessonProgress,
      quizResults,
    });
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

  private async getLearnerIdentity(userId: string) {
    const user = await this.usersRepository.getUser(userId);
    return {
      learnerId: userId,
      username: user?.username ?? userId,
      avatarUrl: user?.avatar_url ?? null,
    };
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
