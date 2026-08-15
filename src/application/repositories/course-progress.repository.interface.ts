import type {
  CourseLessonProgress,
  CourseLessonProgressWrite,
  CourseProgressSnapshot,
  CourseQuizResult,
  CourseQuizResultWrite,
  LessonLearningResultsSnapshot,
} from '@/src/entities/models/course-progress';

export interface ICourseProgressRepository {
  getCourseProgress(
    userId: string,
    courseSlug: string
  ): Promise<CourseProgressSnapshot>;
  getLessonLearningResults(
    courseSlug: string,
    lessonId: string
  ): Promise<LessonLearningResultsSnapshot>;
  upsertLessonProgress(
    progress: CourseLessonProgressWrite
  ): Promise<CourseLessonProgress>;
  upsertQuizResult(result: CourseQuizResultWrite): Promise<CourseQuizResult>;
}
