import { JwtApplicationService } from '@/core/auth/application/services/jwt-application.service';
import { JwtService } from '@/core/auth/application/services/jwt.service';
import { CreateUserUseCase } from '@/core/user/application/use-cases/create-user.use-case';
import { FindUserByEmailUseCase } from '@/core/user/application/use-cases/find-by-email-user.use-case';
import { User } from '@/core/user/domain/entities/user.entity';
import { EmailInUseError } from '@/shared/core/errors/email-in-use.error';
import { ValidationError } from '@/shared/core/errors/validation.error';
import { left, right } from '@/shared/core/validation';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('JwtApplicationService', () => {
  let service: JwtApplicationService;
  let findUserByEmailUseCase: jest.Mocked<FindUserByEmailUseCase>;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: User = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedpassword',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtApplicationService,
        {
          provide: FindUserByEmailUseCase,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: CreateUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAccessToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JwtApplicationService>(JwtApplicationService);
    findUserByEmailUseCase = module.get(FindUserByEmailUseCase);
    createUserUseCase = module.get(CreateUserUseCase);
    jwtService = module.get(JwtService);
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      findUserByEmailUseCase.findByEmail.mockResolvedValue(right(mockUser));
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true);

      const result = await service.validateUser('john@example.com', 'password123');

      expect(result).toEqual(mockUser);
      expect(findUserByEmailUseCase.findByEmail).toHaveBeenCalledWith('john@example.com');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      findUserByEmailUseCase.findByEmail.mockResolvedValue(
        left(new Error('User not found'))
      );

      await expect(
        service.validateUser('nonexistent@example.com', 'password123')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      findUserByEmailUseCase.findByEmail.mockResolvedValue(right(mockUser));
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(false);

      await expect(
        service.validateUser('john@example.com', 'wrongpassword')
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const user = { id: 'user-123', email: 'john@example.com' };
      const mockToken = 'mock-access-token';
      jwtService.signAccessToken.mockResolvedValue(mockToken);

      const result = await service.login(user);

      expect(result).toEqual({ accessToken: mockToken });
      expect(jwtService.signAccessToken).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
    });
  });

  describe('register', () => {
    const registerDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should return user and tokens when registration is successful', async () => {
      createUserUseCase.execute.mockResolvedValue(right(mockUser));
      jwtService.signAccessToken.mockResolvedValue('mock-token');

      const result = await service.register(registerDto);

      expect(result.value).toEqual({
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          password: "hashedpassword",
        },
        tokens: { accessToken: 'mock-token' },
      });
      expect(createUserUseCase.execute).toHaveBeenCalledWith(registerDto);
    });

    it('should return error when user creation fails', async () => {
      const error = new EmailInUseError();
      createUserUseCase.execute.mockResolvedValue(left(error));

      const result = await service.register(registerDto);

      expect(result).toEqual(left(error));
    });

    it('should handle validation errors during registration', async () => {
      const error = new ValidationError('Invalid data');
      createUserUseCase.execute.mockResolvedValue(left(error));

      const result = await service.register(registerDto);

      expect(result).toEqual(left(error));
    });
  });
});