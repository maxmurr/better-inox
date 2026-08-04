import { eq } from 'drizzle-orm';

import { DatabaseOperationError } from '@/src/entities/errors/common';
import { Todo, TodoInsert } from '@/src/entities/models/todo';
import { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import type { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

import { db, Transaction } from '@/drizzle';
import { todos } from '@/drizzle/schema';

export class TodosRepository implements ITodosRepository {
  constructor(
    private readonly instrumentationService: IInstrumentationService,
    private readonly crashReporterService: ICrashReporterService
  ) {}

  async createTodo(todo: TodoInsert, tx?: Transaction): Promise<Todo> {
    const invoker = tx ?? db;

    return await this.instrumentationService.startSpan(
      { name: 'TodosRepository > createTodo' },
      async () => {
        try {
          const query = invoker.insert(todos).values(todo).returning();

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
            throw new DatabaseOperationError('Cannot create todo');
          }
        } catch (err) {
          this.crashReporterService.report(err);
          if (err instanceof DatabaseOperationError) {
            throw err;
          }
          throw new DatabaseOperationError('Cannot create todo.', {
            cause: err,
          });
        }
      }
    );
  }

  async getTodo(id: number): Promise<Todo | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'TodosRepository > getTodo' },
      async () => {
        try {
          const query = db.query.todos.findFirst({
            where: eq(todos.id, id),
          });

          const todo = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          return todo;
        } catch (err) {
          this.crashReporterService.report(err);
          if (err instanceof DatabaseOperationError) {
            throw err;
          }
          throw new DatabaseOperationError('Cannot get todo.', { cause: err });
        }
      }
    );
  }

  async getTodosForUser(userId: string): Promise<Todo[]> {
    return await this.instrumentationService.startSpan(
      { name: 'TodosRepository > getTodosForUser' },
      async () => {
        try {
          const query = db.query.todos.findMany({
            where: eq(todos.userId, userId),
          });

          const usersTodos = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );
          return usersTodos;
        } catch (err) {
          this.crashReporterService.report(err);
          if (err instanceof DatabaseOperationError) {
            throw err;
          }
          throw new DatabaseOperationError('Cannot get todos for user.', {
            cause: err,
          });
        }
      }
    );
  }

  async updateTodo(id: number, input: Partial<TodoInsert>): Promise<Todo> {
    return await this.instrumentationService.startSpan(
      { name: 'TodosRepository > updateTodo' },
      async () => {
        try {
          const query = db
            .update(todos)
            .set(input)
            .where(eq(todos.id, id))
            .returning();

          const [updated] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          return updated;
        } catch (err) {
          this.crashReporterService.report(err);
          if (err instanceof DatabaseOperationError) {
            throw err;
          }
          throw new DatabaseOperationError('Cannot update todo.', {
            cause: err,
          });
        }
      }
    );
  }

  async deleteTodo(id: number, tx?: Transaction): Promise<void> {
    const invoker = tx ?? db;

    await this.instrumentationService.startSpan(
      { name: 'TodosRepository > deleteTodo' },
      async () => {
        try {
          const query = invoker
            .delete(todos)
            .where(eq(todos.id, id))
            .returning();

          await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );
        } catch (err) {
          this.crashReporterService.report(err);
          if (err instanceof DatabaseOperationError) {
            throw err;
          }
          throw new DatabaseOperationError('Cannot delete todo.', {
            cause: err,
          });
        }
      }
    );
  }
}
