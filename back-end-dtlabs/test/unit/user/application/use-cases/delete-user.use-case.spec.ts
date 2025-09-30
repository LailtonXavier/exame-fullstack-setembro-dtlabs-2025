import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserUseCase } from '@/core/user/application/use-cases/delete-user.use-case';
import { UserRepository } from '@/core/user/domain/repository/user.repository';
import { EncryptionService } from '@/core/auth/application/services/encryption.service';
import { NotFoundError } from '@/shared/core/errors/not-found.error';
import { ValidationError } from '@/shared/core/errors/validation.error';
import { User } from '@/core/user/domain/entities/user.entity';

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let encryptionService: jest.Mocked<EncryptionService>;

  const mockUser: User = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedpassword',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: EncryptionService,
          useValue: {
            comparePassword: jest.fn(),
          },
        },
      ],
    }).compile();

    deleteUserUseCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
    userRepository = module.get(UserRepository);
    encryptionService = module.get(EncryptionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete user successfully when credentials are valid', async () => {
      const userId = 'user-123';
      const password = 'hashedpassword';
      
      userRepository.findById.mockResolvedValue(mockUser);
      encryptionService.comparePassword.mockResolvedValue(true);
      userRepository.delete.mockResolvedValue(true);

      const result = await deleteUserUseCase.execute(userId, password);

      expect(result.isRight()).toBe(true);
      expect(result.value).toBe(true);
      
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(encryptionService.comparePassword).toHaveBeenCalledWith(
        password, 
        mockUser.password
      );
      expect(userRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('should return NotFoundError when user does not exist', async () => {
      const userId = 'non-existent-id';
      const password = 'anypassword';
      
      userRepository.findById.mockResolvedValue(null);

      const result = await deleteUserUseCase.execute(userId, password);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotFoundError);
      
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(encryptionService.comparePassword).not.toHaveBeenCalled();
      expect(userRepository.delete).not.toHaveBeenCalled();
    });

    it('should return ValidationError when password is incorrect', async () => {
      const userId = 'user-123';
      const password = 'wrongpassword';
      
      userRepository.findById.mockResolvedValue(mockUser);
      encryptionService.comparePassword.mockResolvedValue(false);

      const result = await deleteUserUseCase.execute(userId, password);

      console.log('resresr', result)
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as Error).message).toBe('Incorrect password. Please try again.');
      
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(encryptionService.comparePassword).toHaveBeenCalledWith(
        password, 
        mockUser.password
      );
      expect(userRepository.delete).not.toHaveBeenCalled();
    });

    it('should return ValidationError when deletion fails', async () => {
      const userId = 'user-123';
      const password = 'correctpassword';
      
      userRepository.findById.mockResolvedValue(mockUser);
      encryptionService.comparePassword.mockResolvedValue(true);
      userRepository.delete.mockResolvedValue(false);

      const result = await deleteUserUseCase.execute(userId, password);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as Error).message).toBe('Failed to delete user');
      
      expect(userRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('should return ValidationError when repository throws an error', async () => {
      const userId = 'user-123';
      const password = 'correctpassword';
      
      userRepository.findById.mockResolvedValue(mockUser);
      encryptionService.comparePassword.mockResolvedValue(true);
      userRepository.delete.mockRejectedValue(new Error('Database error'));

      const result = await deleteUserUseCase.execute(userId, password);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as Error).message).toBe('Error during user deletion');
    });
  });
});