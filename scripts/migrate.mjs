// Applies pending Drizzle migrations, then exits. Runs as part of the Railway
// start command rather than the pre-deploy command, because volumes are only
// mounted once the service container starts.
//
// Deliberately uses runtime dependencies only (drizzle-orm, @libsql/client) so
// it keeps working if the deploy image prunes devDependencies like drizzle-kit.
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

const client = createClient({
  url: process.env.DATABASE_URL ?? 'file:sqlite.db',
});

await migrate(drizzle(client), { migrationsFolder: './drizzle/migrations' });

client.close();
