import { User } from '@/core/user/domain/entities/user.entity';

export const mockUser: User = {
  id: 'user-123',
  name: 'Lailton Xavier',
  email: 'Lailton@example.com',
  password: 'hashedpassword',
};

export const mockUserData = {
  name: 'Lailton Xavier',
  email: 'Lailton@example.com',
  password: 'password123',
};

export const mockUserWithoutPassword = {
  name: 'Lailton Xavier',
  email: 'Lailton@example.com',
  password: '',
};

export const validCreateUserDto = {
  name: 'Maria',
  email: 'maria@example.com',
  password: 'password123',
};

export const invalidCreateUserDto = {
  name: '',
  email: 'not-an-email',
  password: '',
};

export const userExistsInDb = {
  id: 'user-123',
  name: 'Maria',
  email: 'maria@example.com',
  password: 'hashedpassword',
};
