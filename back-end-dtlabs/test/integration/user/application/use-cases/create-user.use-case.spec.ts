import { CreateUserUseCase } from '@/core/user/application/use-cases/create-user.use-case';
import { createUserTestingModule, userTestData } from '../../../../setup/integration/user-setup';
import { EmailInUseError } from '@/shared/core/errors/email-in-use.error';
import { ValidationError } from '@/shared/core/errors/validation.error';

describe('CreateUserUseCase (Integration)', () => {
  let createUserUseCase: CreateUserUseCase;
  let deps: Awaited<ReturnType<typeof createUserTestingModule>>;

  beforeEach(async () => {
    deps = await createUserTestingModule([CreateUserUseCase]);
    createUserUseCase = deps.module.get(CreateUserUseCase);
    
    await deps.prisma.user.deleteMany();
  });

  afterAll(async () => {
    await deps.prisma.$disconnect();
  });

  it('should create a user in the database successfully', async () => {
    const userData = userTestData.createDataUser();

    const result = await createUserUseCase.execute(userData);
userData
    expect(result.isRight()).toBe(true);
    
    const userInDb = await deps.prisma.user.findUnique({
      where: { email: userData.email },
    });

    expect(userInDb).not.toBeNull();
    expect(userInDb?.name).toBe(userData.name);
    expect(userInDb?.email).toBe(userData.email);
    
    const isPasswordHashed = await deps.encryptionService.comparePassword(
      userData.password,
      userInDb!.password
    );
    expect(isPasswordHashed).toBe(true);
  });

  it('should return ValidationError when password is empty', async () => {
    const invalidUserData = {
      name: 'Lailton Xavier',
      email: 'lailton@example.com',
      password: '',
    };

    const result = await createUserUseCase.execute(invalidUserData);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ValidationError);
    expect((result.value as Error).message).toContain('Password is required');
    
    const userInDb = await deps.prisma.user.findUnique({
      where: { email: invalidUserData.email },
    });
    expect(userInDb).toBeNull();
  });

  it('should return EmailInUseError when email already exists in database', async () => {
    const userData = userTestData.createDataUser();
    
    await deps.prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: await deps.encryptionService.hashPassword(userData.password),
      },
    });

    const result = await createUserUseCase.execute(userData);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EmailInUseError);
    expect((result.value as Error).message).toContain('Email is already in use');
    
    const usersWithEmail = await deps.prisma.user.findMany({
      where: { email: userData.email },
    });
    expect(usersWithEmail).toHaveLength(1);
  });

  it('should handle database constraints violations', async () => {
    const userData = userTestData.createDataUser();
    
    const firstResult = await createUserUseCase.execute(userData);
    expect(firstResult.isRight()).toBe(true);
    
    const secondResult = await createUserUseCase.execute(userData);
    expect(secondResult.isLeft()).toBe(true);
  });

  it('should persist user with correct timestamps', async () => {
    const userData = userTestData.createDataUser();
    const beforeCreation = new Date();

    const result = await createUserUseCase.execute(userData);

    expect(result.isRight()).toBe(true);
    
    const userInDb = await deps.prisma.user.findUnique({
      where: { email: userData.email },
    });

    expect(userInDb?.createdAt).toBeInstanceOf(Date);
    expect(userInDb?.updatedAt).toBeInstanceOf(Date);
    expect(userInDb?.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
  });
});