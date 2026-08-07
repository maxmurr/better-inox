import type {
  CourseLessonProgress,
  CourseLessonProgressWrite,
  CourseProgressSnapshot,
  CourseQuizResult,
  CourseQuizResultWrite,
} from '@/src/entities/models/course-progress';

export interface ICourseProgressRepository {
  getCourseProgress(
    userId: string,
    courseSlug: string
  ): Promise<CourseProgressSnapshot>;
  upsertLessonProgress(
    progress: CourseLessonProgressWrite
  ): Promise<CourseLessonProgress>;
  upsertQuizResult(result: CourseQuizResultWrite): Promise<CourseQuizResult>;
}
