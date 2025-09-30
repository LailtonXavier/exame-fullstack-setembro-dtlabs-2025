import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '@/core/user/application/use-cases/create-user.use-case';
import { UserRepository } from '@/core/user/domain/repository/user.repository';
import { EncryptionService } from '@/core/auth/application/services/encryption.service';
import { User } from '@/core/user/domain/entities/user.entity';
import { EmailInUseError } from '@/shared/core/errors/email-in-use.error';
import { ValidationError } from '@/shared/core/errors/validation.error';
import { mockUser, mockUserData, mockUserWithoutPassword } from '../../../../fixtures/user.fixtures';

describe('CreateUserUseCase', () => {
  let useCreateUserUseCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let encryptionService: jest.Mocked<EncryptionService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: EncryptionService,
          useValue: {
            hashPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    useCreateUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get(UserRepository);
    encryptionService = module.get(EncryptionService);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      encryptionService.hashPassword.mockResolvedValue('hashedpassword');
      userRepository.create.mockResolvedValue(mockUser);

      const result = await useCreateUserUseCase.execute(mockUserData);

      expect(result.isRight()).toBe(true);
      expect(result.value).toEqual(mockUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith('Lailton@example.com');
      expect(encryptionService.hashPassword).toHaveBeenCalledWith('password123');
      expect(userRepository.create).toHaveBeenCalled();
    });

    it('should return EmailInUseError when email already exists', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await useCreateUserUseCase.execute(mockUserData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(EmailInUseError);
      expect(userRepository.findByEmail).toHaveBeenCalledWith('Lailton@example.com');
      expect(encryptionService.hashPassword).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should return ValidationError when password is missing', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
    
      const result = await useCreateUserUseCase.execute(mockUserWithoutPassword);
    
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as Error).message).toBe('Password is required');
    });
    

    it('should return ValidationError when User.create fails', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      encryptionService.hashPassword.mockResolvedValue('hashedpassword');

      jest.spyOn(User, 'create').mockReturnValueOnce({
        isLeft: () => true,
        isRight: () => false,
        value: new Error('Invalid email format'),
      } as any);

      const result = await useCreateUserUseCase.execute(mockUserData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as Error).message).toBe('Invalid email format');
    });

    it('should handle encryption errors', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      encryptionService.hashPassword.mockRejectedValue(new Error('Hash failed'));

      const result = await useCreateUserUseCase.execute(mockUserData);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as Error).message).toBe('Failed to create user');
    });
  });
});
