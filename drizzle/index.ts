import * as Sentry from '@sentry/nextjs';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { drizzle, NodePgTransaction } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { env } from '@/env';

import {
  courseLessonProgress,
  courseQuizResults,
  oauthAccounts,
  sessions,
  todos,
  users,
} from './schema';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.DATABASE_POOL_MAX,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (err) => {
  console.error('postgres pool error', err);
  Sentry.captureException(err);
});

export const db = drizzle(pool, {
  schema: {
    users,
    sessions,
    todos,
    oauthAccounts,
    courseLessonProgress,
    courseQuizResults,
  },
});

export const luciaAdapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

type Schema = {
  users: typeof users;
  sessions: typeof sessions;
  todos: typeof todos;
  oauthAccounts: typeof oauthAccounts;
  courseLessonProgress: typeof courseLessonProgress;
  courseQuizResults: typeof courseQuizResults;
};
export type Transaction = NodePgTransaction<
  Schema,
  ExtractTablesWithRelations<Schema>
>;
