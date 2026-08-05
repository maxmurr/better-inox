import * as Sentry from '@sentry/nextjs';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { drizzle, NodePgTransaction } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { oauthAccounts, sessions, todos, users } from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DATABASE_POOL_MAX) || 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

// Postgres drops idle clients on restart or failover. Without a listener that
// arrives as an uncaught 'error' event and takes the whole process down; the
// pool discards the client on its own, so reporting is all that is needed.
pool.on('error', (err) => {
  console.error('postgres pool error', err);
  Sentry.captureException(err);
});

export const db = drizzle(pool, {
  schema: { users, sessions, todos, oauthAccounts },
});

export const luciaAdapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

type Schema = {
  users: typeof users;
  sessions: typeof sessions;
  todos: typeof todos;
  oauthAccounts: typeof oauthAccounts;
};
export type Transaction = NodePgTransaction<
  Schema,
  ExtractTablesWithRelations<Schema>
>;
