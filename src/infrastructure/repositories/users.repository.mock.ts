import { NotFoundError } from '@/src/entities/errors/common';
import type { CreateOAuthUser, User } from '@/src/entities/models/user';
import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';

const SEEDED_AT = new Date('2026-01-01T00:00:00.000Z');

export class MockUsersRepository implements IUsersRepository {
  private _users: User[];

  constructor() {
    this._users = [
      {
        id: '1',
        username: 'one',
        avatar_url: null,
        created_at: SEEDED_AT,
        updated_at: SEEDED_AT,
      },
      {
        id: '2',
        username: 'two',
        avatar_url: null,
        created_at: SEEDED_AT,
        updated_at: SEEDED_AT,
      },
      {
        id: '3',
        username: 'three',
        avatar_url: null,
        created_at: SEEDED_AT,
        updated_at: SEEDED_AT,
      },
    ];
  }

  async getUser(id: string): Promise<User | undefined> {
    const user = this._users.find((u) => u.id === id);
    return user;
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = this._users.find((u) => u.username === username);
    return user;
  }
  async createOAuthUser(input: CreateOAuthUser): Promise<User> {
    const createdAt = new Date();
    const newUser: User = {
      id: input.id,
      username: input.username,
      avatar_url: input.avatar_url ?? null,
      created_at: createdAt,
      updated_at: createdAt,
    };
    this._users.push(newUser);
    return newUser;
  }
  async updateAvatarUrl(id: string, avatarUrl: string | null): Promise<User> {
    const user = this._users.find((u) => u.id === id);

    if (!user) {
      throw new NotFoundError('User does not exist.');
    }

    user.avatar_url = avatarUrl;
    user.updated_at = new Date();
    return user;
  }
}
