import { User } from '@/core/domain/entities/user';
import { api } from '../../services/api-service';

export async function getUser(): Promise<User> {
  return await api.get<User>('/users');
}