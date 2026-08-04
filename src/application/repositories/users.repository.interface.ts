import type { ITransaction } from '@/src/entities/models/transaction.interface';
import type {
  CreateOAuthUser,
  CreateUser,
  User,
} from '@/src/entities/models/user';

export interface IUsersRepository {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(input: CreateUser, tx?: ITransaction): Promise<User>;
  createOAuthUser(input: CreateOAuthUser, tx?: ITransaction): Promise<User>;
  updateAvatarUrl(
    id: string,
    avatarUrl: string | null,
    tx?: ITransaction
  ): Promise<User>;
}
