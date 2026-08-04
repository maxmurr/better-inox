import { createClient, ResultSet } from '@libsql/client';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { SQLiteTransaction } from 'drizzle-orm/sqlite-core';

import { oauthAccounts, sessions, todos, users } from './schema';

const client = createClient({
  url: process.env.DATABASE_URL ?? 'file:sqlite.db',
});
export const db = drizzle(client, {
  schema: { users, sessions, todos, oauthAccounts },
});

export const luciaAdapter = new DrizzleSQLiteAdapter(db, sessions, users);

type Schema = {
  users: typeof users;
  sessions: typeof sessions;
  todos: typeof todos;
  oauthAccounts: typeof oauthAccounts;
};
export type Transaction = SQLiteTransaction<
  'async',
  ResultSet,
  Schema,
  ExtractTablesWithRelations<Schema>
>;
