import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import type { QuestionOutcome } from '@/src/entities/models/quiz';

export const users = pgTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  password_hash: text('password_hash'),
  avatar_url: text('avatar_url'),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const oauthAccounts = pgTable(
  'oauth_account',
  {
    providerId: text('provider_id').notNull(),
    providerUserId: text('provider_user_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
  },
  (t) => [primaryKey({ columns: [t.providerId, t.providerUserId] })]
);

export const sessions = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const todos = pgTable('todos', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  todo: text('todo').notNull(),
  completed: boolean('completed').notNull().default(false),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
});

export const courseLessonProgress = pgTable(
  'course_lesson_progress',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    courseSlug: text('course_slug').notNull(),
    lessonId: text('lesson_id').notNull(),
    completed: boolean('completed').notNull().default(false),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.courseSlug, t.lessonId] })]
);

export const courseQuizResults = pgTable(
  'course_quiz_result',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    courseSlug: text('course_slug').notNull(),
    lessonId: text('lesson_id').notNull(),
    outcomes: jsonb('question_outcomes')
      .$type<QuestionOutcome[]>()
      .notNull(),
    correct: integer('correct').notNull(),
    total: integer('total').notNull(),
    passed: boolean('passed').notNull(),
    submittedAt: timestamp('submitted_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.courseSlug, t.lessonId] }),
    check('course_quiz_result_correct_nonnegative', sql`${t.correct} >= 0`),
    check('course_quiz_result_total_positive', sql`${t.total} > 0`),
    check(
      'course_quiz_result_correct_not_over_total',
      sql`${t.correct} <= ${t.total}`
    ),
  ]
);
