import { JwtRegister, RegisterUserDto } from '@/core/domain/types/user-types';
import { api } from '../../services/api-service';

export async function registerUser(data: RegisterUserDto): Promise<JwtRegister> {
  return await api.post<JwtRegister>('/auth/register', data);
}