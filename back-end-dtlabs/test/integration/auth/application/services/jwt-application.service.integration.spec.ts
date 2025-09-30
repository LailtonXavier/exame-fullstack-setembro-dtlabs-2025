import { createAuthTestingModule, authTestData } from '../../../../setup/integration/auth-setup';
import { JwtRegister } from '@/core/auth/application/types/tokens.type';
import { EmailInUseError } from '@/shared/core/errors/email-in-use.error';
import { ValidationError } from '@/shared/core/errors/validation.error';

describe('JwtApplicationService (Integration)', () => {
  let deps: Awaited<ReturnType<typeof createAuthTestingModule>>;

  beforeAll(async () => {
    deps = await createAuthTestingModule();
    await deps.prisma.user.deleteMany();
  });

  afterAll(async () => {
    await deps.prisma.$disconnect();
  });

  beforeEach(async () => {
    await deps.prisma.user.deleteMany();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = authTestData.validRegister();

      const result = await deps.jwtApplicationService.register(registerDto);

      expect(result.isRight()).toBe(true);
      
      const jwtRegister = result.value as JwtRegister;
      expect(jwtRegister.user.name).toBe(registerDto.name);
      expect(jwtRegister.user.email).toBe(registerDto.email);
      expect(jwtRegister.tokens.accessToken).toBeDefined();
      expect(jwtRegister.tokens.accessToken.length).toBeGreaterThan(20);

      const userInDb = await deps.prisma.user.findUnique({
        where: { email: registerDto.email },
      });
      
      expect(userInDb).not.toBeNull();
      expect(userInDb?.name).toBe(registerDto.name);
      expect(userInDb?.email).toBe(registerDto.email);
      
      expect(userInDb?.password).not.toBe(registerDto.password);
      const isPasswordValid = await deps.encryptionService.comparePassword(
        registerDto.password,
        userInDb!.password
      );
      expect(isPasswordValid).toBe(true);
    });

    it('should return EmailInUseError when email already exists', async () => {
      const registerDto = authTestData.validRegister();
      
      const firstResult = await deps.jwtApplicationService.register(registerDto);
      expect(firstResult.isRight()).toBe(true);

      const secondResult = await deps.jwtApplicationService.register(registerDto);

      expect(secondResult.isLeft()).toBe(true);
      expect(secondResult.value).toBeInstanceOf(EmailInUseError);
      expect((secondResult.value as Error).message).toContain('Email is already in use');
    });

    it('should return ValidationError for invalid registration data', async () => {
      const invalidRegisterDto = {
        name: 'La',
        email: 'invalid-email',
        password: '123',
      };

      const result = await deps.jwtApplicationService.register(invalidRegisterDto);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const registerDto = authTestData.validRegister();
      await deps.jwtApplicationService.register(registerDto);

      const result = await deps.jwtApplicationService.login({
        id: 'mock-user-id',
        email: registerDto.email,
      });

      expect(result).toHaveProperty('accessToken');
      expect(typeof result.accessToken).toBe('string');
      expect(result.accessToken.length).toBeGreaterThan(20);
    });
  });

  describe('validateUser', () => {
    it('should validate user credentials against real database', async () => {
      const registerDto = authTestData.validRegister();
      await deps.jwtApplicationService.register(registerDto);

      const user = await deps.jwtApplicationService.validateUser(
        registerDto.email,
        registerDto.password
      );

      expect(user.email).toBe(registerDto.email);
      expect(user.name).toBe(registerDto.name);
      expect(user.id).toBeDefined();
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      await expect(
        deps.jwtApplicationService.validateUser('nonexistent@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const registerDto = authTestData.validRegister();
      await deps.jwtApplicationService.register(registerDto);

      await expect(
        deps.jwtApplicationService.validateUser(registerDto.email, 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('integration between register and login', () => {
    it('should allow user to login immediately after registration', async () => {
      const registerDto = authTestData.validRegister();

      const registerResult = await deps.jwtApplicationService.register(registerDto);
      expect(registerResult.isRight()).toBe(true);

      const user = (registerResult.value as JwtRegister).user;

      const validatedUser = await deps.jwtApplicationService.validateUser(
        registerDto.email,
        registerDto.password
      );

      expect(validatedUser.id).toBe(user.id);
      expect(validatedUser.email).toBe(user.email);

      const loginResult = await deps.jwtApplicationService.login({
        id: validatedUser.id,
        email: validatedUser.email,
      });

      expect(loginResult.accessToken).toBeDefined();
    });
  });
});