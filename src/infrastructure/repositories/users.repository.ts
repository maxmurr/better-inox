import { hash } from 'bcrypt-ts';
import { eq } from 'drizzle-orm';

import { DatabaseOperationError } from '@/src/entities/errors/common';
import type {
  CreateOAuthUser,
  CreateUser,
  User,
} from '@/src/entities/models/user';
import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

import { PASSWORD_SALT_ROUNDS } from '@/config';
import { db, Transaction } from '@/drizzle';
import { users } from '@/drizzle/schema';

export class UsersRepository implements IUsersRepository {
  constructor(
    private readonly instrumentationService: IInstrumentationService,
    private readonly crashReporterService: ICrashReporterService
  ) {}
  async getUser(id: string): Promise<User | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > getUser' },
      async () => {
        try {
          const query = db.query.users.findFirst({
            where: eq(users.id, id),
          });

          const user = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          return user;
        } catch (err) {
          this.crashReporterService.report(err);
          if (err instanceof DatabaseOperationError) {
            throw err;
          }
          throw new DatabaseOperationError('Cannot get user.', { cause: err });
        }
      }
    );
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > getUserByUsername' },
      async () => {
        try {
          const query = db.query.users.findFirst({
            where: eq(users.username, username),
          });

          const user = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          return user;
        } catch (err) {
          this.crashReporterService.report(err);
          if (err instanceof DatabaseOperationError) {
            throw err;
          }
          throw new DatabaseOperationError('Cannot get user by username.', {
            cause: err,
          });
        }
      }
    );
  }
  async createUser(input: CreateUser): Promise<User> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > createUser' },
      async () => {
        try {
          const password_hash = await this.instrumentationService.startSpan(
            { name: 'hash password', op: 'function' },
            () => hash(input.password, PASSWORD_SALT_ROUNDS)
          );

          const newUser: User = {
            id: input.id,
            username: input.username,
            password_hash,
            avatar_url: null,
          };
          const query = db.insert(users).values(newUser).returning();

          const [created] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          if (created) {
            return created;
          } else {
            throw new DatabaseOperationError('Cannot create user.');
          }
        } catch (err) {
          this.crashReporterService.report(err);
          if (err instanceof DatabaseOperationError) {
            throw err;
          }
          throw new DatabaseOperationError('Cannot create user.', {
            cause: err,
          });
        }
      }
    );
  }
  async createOAuthUser(
    input: CreateOAuthUser,
    tx?: Transaction
  ): Promise<User> {
    const invoker = tx ?? db;

    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > createOAuthUser' },
      async () => {
        try {
          const newUser: User = {
            id: input.id,
            username: input.username,
            password_hash: null,
            avatar_url: input.avatar_url ?? null,
          };
          const query = invoker.insert(users).values(newUser).returning();

          const [created] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          if (created) {
            return created;
          } else {
            throw new DatabaseOperationError('Cannot create user.');
          }
        } catch (err) {
          this.crashReporterService.report(err);
          if (err instanceof DatabaseOperationError) {
            throw err;
          }
          throw new DatabaseOperationError('Cannot create OAuth user.', {
            cause: err,
          });
        }
      }
    );
  }
  async updateAvatarUrl(
    id: string,
    avatarUrl: string | null,
    tx?: Transaction
  ): Promise<User> {
    const invoker = tx ?? db;

    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > updateAvatarUrl' },
      async () => {
        try {
          const query = invoker
            .update(users)
            .set({ avatar_url: avatarUrl })
            .where(eq(users.id, id))
            .returning();

          const [updated] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          if (updated) {
            return updated;
          } else {
            throw new DatabaseOperationError('Cannot update user avatar.');
          }
        } catch (err) {
          this.crashReporterService.report(err);
          if (err instanceof DatabaseOperationError) {
            throw err;
          }
          throw new DatabaseOperationError('Cannot update user avatar.', {
            cause: err,
          });
        }
      }
    );
  }
}
