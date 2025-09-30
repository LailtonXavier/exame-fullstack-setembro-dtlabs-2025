import { FindUserByEmailUseCase } from '@/core/user/application/use-cases/find-by-email-user.use-case';
import { User } from '@/core/user/domain/entities/user.entity';
import { UserRepository } from '@/core/user/domain/repository/user.repository';
import { EmailInUseError } from '@/shared/core/errors/email-in-use.error';
import { Test, TestingModule } from '@nestjs/testing';

describe('FindUserByEmailUseCase', () => {
  let useFindUserByEmailUseCase: FindUserByEmailUseCase;
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
      FindUserByEmailUseCase,
      {
        provide: UserRepository,
        useValue: {
          findByEmail: jest.fn(),
        },
      },
    ],
  }).compile();

  useFindUserByEmailUseCase = module.get<FindUserByEmailUseCase>(FindUserByEmailUseCase);
  userRepository = module.get(UserRepository);
});

  it('should return user successfully when user exists', async () => {
    userRepository.findByEmail.mockResolvedValue(existingUser);

    const result = await useFindUserByEmailUseCase.findByEmail('lailtond@example.com');

    expect(result.isRight()).toBe(true);

    expect(result.value.name).toBe('Lailton');
    expect((result.value as User).email).toBe('lailtond@example.com');
    expect((result.value as User).password).toBe('password123');
  });

  it('should return EmailInUseError when user does not exist', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    const result = await useFindUserByEmailUseCase.findByEmail('lailtonxavier@example');

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EmailInUseError);
  });

  it('should call repository with correct Email', async () => {
    userRepository.findByEmail.mockResolvedValue(existingUser);

    await useFindUserByEmailUseCase.findByEmail('lailtonxavier@example');

    expect(userRepository.findByEmail).toHaveBeenCalledWith('lailtonxavier@example');
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
  });
});
