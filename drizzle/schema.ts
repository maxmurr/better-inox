import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  password_hash: text('password_hash'),
  avatar_url: text('avatar_url'),
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
  // DrizzlePostgreSQLAdapter requires a Date-typed column here, unlike the
  // SQLite adapter which stored the expiry as a unix integer.
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const todos = pgTable('todos', {
  // SQLite auto-assigned this via `integer primary key` (rowid alias). Postgres
  // needs an explicit identity so inserts can keep omitting the id.
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  todo: text('todo').notNull(),
  completed: boolean('completed').notNull().default(false),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
});
