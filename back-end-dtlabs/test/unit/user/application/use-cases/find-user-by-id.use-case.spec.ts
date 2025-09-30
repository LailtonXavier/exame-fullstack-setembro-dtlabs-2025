import { FindUserByIdUseCase } from '@/core/user/application/use-cases/find-user-by-id.use-case';
import { User } from '@/core/user/domain/entities/user.entity';
import { UserRepository } from '@/core/user/domain/repository/user.repository';
import { NotFoundError } from '@/shared/core/errors/not-found.error';
import { Test, TestingModule } from '@nestjs/testing';

describe('FindUserByIdUseCase', () => {
  let useFindUserByIdUseCase: FindUserByIdUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  const existingUser = new User(
    'user-123',
    'Lailton',
    'lailtond@example.com',
    'password123'
  );

  beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      FindUserByIdUseCase,
      {
        provide: UserRepository,
        useValue: {
          findById: jest.fn(),
        },
      },
    ],
  }).compile();

  useFindUserByIdUseCase = module.get<FindUserByIdUseCase>(FindUserByIdUseCase);
  userRepository = module.get(UserRepository);
});

  it('should return user successfully when user exists', async () => {
    userRepository.findById.mockResolvedValue(existingUser);

    const result = await useFindUserByIdUseCase.execute('user-123');

    expect(result.isRight()).toBe(true);

    expect(result.value.name).toBe('Lailton');
    expect((result.value as User).password).toBe('password123');
  });

  it('should return NotFoundError when user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    const result = await useFindUserByIdUseCase.execute('non-existent-id');

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
    
    if (result.isLeft()) {
      expect(result.value.message).toContain('not found');
    }
  });

  it('should call repository with correct ID', async () => {
    userRepository.findById.mockResolvedValue(existingUser);

    await useFindUserByIdUseCase.execute('user-123');

    expect(userRepository.findById).toHaveBeenCalledWith('user-123');
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
  });
});
