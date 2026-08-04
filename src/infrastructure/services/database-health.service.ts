import { sql } from 'drizzle-orm';

import { IDatabaseHealthService } from '@/src/application/services/database-health.service.interface';

import { db } from '@/drizzle';

export class DatabaseHealthService implements IDatabaseHealthService {
  public async ping(): Promise<void> {
    await db.execute(sql`select 1`);
  }
}
