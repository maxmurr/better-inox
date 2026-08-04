// Applies pending Drizzle migrations, then exits. Runs as part of the Railway
// start command so it uses the same private-network DATABASE_URL as the app.
//
// Deliberately uses runtime dependencies only (drizzle-orm, pg) so it keeps
// working if the deploy image prunes devDependencies like drizzle-kit.
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

await migrate(drizzle(pool), { migrationsFolder: './drizzle/migrations' });

await pool.end();
