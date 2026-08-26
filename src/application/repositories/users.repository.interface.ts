import type { ITransaction } from '@/src/entities/models/transaction.interface';
import type { CreateOAuthUser, User } from '@/src/entities/models/user';

export interface IUsersRepository {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createOAuthUser(input: CreateOAuthUser, tx?: ITransaction): Promise<User>;
  updateAvatarUrl(
    id: string,
    avatarUrl: string | null,
    tx?: ITransaction
  ): Promise<User>;
}
