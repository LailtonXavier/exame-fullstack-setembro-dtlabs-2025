import { EncryptionService } from '@/core/auth/application/services/encryption.service';
import { UpdateUserUseCase } from '@/core/user/application/use-cases/update-user.use-case';
import { User } from '@/core/user/domain/entities/user.entity';
import { UserRepository } from '@/core/user/domain/repository/user.repository';
import { EmailInUseError } from '@/shared/core/errors/email-in-use.error';
import { NotFoundError } from '@/shared/core/errors/not-found.error';
import { ValidationError } from '@/shared/core/errors/validation.error';
import { Test, TestingModule } from '@nestjs/testing';

describe('UpdateUserUseCase', () => {
  let useUpdateUserUseCase: UpdateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let encryptionService: jest.Mocked<EncryptionService>;

  const existingUser = new User(
    'user-123',
    'Old Name',
    'old@example.com',
    'oldpassword'
  );


  const existingUser2 = new User(
    'user-123',
    'Old Name',
    'new@example.com',
    'oldpassword'
  );

  beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UpdateUserUseCase,
      {
        provide: UserRepository,
        useValue: {
          findById: jest.fn(),
          findByEmail: jest.fn(),
          update: jest.fn(),
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

  useUpdateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
  userRepository = module.get(UserRepository);
  encryptionService = module.get(EncryptionService);
});

  it('should update user successfully', async () => {
    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.findByEmail.mockResolvedValue(null);
    encryptionService.hashPassword.mockResolvedValue('hashedpass');
    
    userRepository.update.mockResolvedValue(
      new User('user-123', 'New Name', 'old@example.com', 'hashedpass')
    );

    const result = await useUpdateUserUseCase.execute('user-123', { 
      name: 'New Name', 
      password: 'newpass' 
    });

    expect(result.isRight()).toBe(true);
    expect(encryptionService.hashPassword).toHaveBeenCalledWith('newpass');
    expect(userRepository.update).toHaveBeenCalledWith(
      'user-123',
      expect.objectContaining({
        name: 'New Name',
        password: 'hashedpass'
      })
    );

    expect(result.value.name).toBe('New Name');
    expect((result.value as User).password).toBe('hashedpass');
  });
  it('should return NotFoundError if user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    const result = await useUpdateUserUseCase.execute('notfound', { name: 'Any' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
  });
  it('should return EmailInUseError if email already exists', async () => {
    const existingUser = new User(
      'John Doe',
      'john@example.com',
      'hashedpassword',
      'user-123'
    );
  
    const existingUser2 = new User(
      'Jane Doe', 
      'jane@example.com',
      'hashedpassword',
      'user-456'
    );
  
    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.findByEmail.mockResolvedValue(existingUser2);
  
    const result = await useUpdateUserUseCase.execute('user-123', { 
      email: 'jane@example.com'
    });
  
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EmailInUseError);
  });
  

  it('should keep old password if password not provided', async () => {
    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.update.mockResolvedValue({ ...existingUser, name: 'Updated' });

    const result = await useUpdateUserUseCase.execute('user-123', { name: 'Updated' });

    
    expect(result.isRight()).toBe(true);
    expect((result.value as User).password).toBe('oldpassword');
    expect(encryptionService.hashPassword).not.toHaveBeenCalled();
  });

  it('should return ValidationError if User.create fails', async () => {
    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.findByEmail.mockResolvedValue(null);
    encryptionService.hashPassword.mockResolvedValue('hashedpass');

    jest.spyOn(User, 'create').mockReturnValueOnce({
      isLeft: () => true,
      isRight: () => false,
      value: new Error('Invalid data'),
    } as any);

    const result = await useUpdateUserUseCase.execute('user-123', { email: 'bad' });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ValidationError);
  });
});
