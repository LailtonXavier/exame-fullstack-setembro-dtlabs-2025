import {User} from  '@/core/user/domain/entities/user.entity'
import { ReturnUser } from '../types/prisma-user.type';

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;
  abstract update(id: string, user: User): Promise<User>;
  abstract delete(userId: string): Promise<boolean>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<ReturnUser | null>;
}
