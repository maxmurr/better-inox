import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { drizzle, NodePgTransaction } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { oauthAccounts, sessions, todos, users } from './schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

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
