import { UpdateUserUseCase } from '@/core/user/application/use-cases/update-user.use-case';
import { createUserTestingModule, userTestData } from '../../../../setup/integration/user-setup';
import { randomUUID } from 'crypto';

describe('UpdateUserUseCase (Integration)', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let deps: Awaited<ReturnType<typeof createUserTestingModule>>;

  beforeEach(async () => {
    deps = await createUserTestingModule([UpdateUserUseCase]);
    updateUserUseCase = deps.module.get(UpdateUserUseCase);
    
    await deps.prisma.user.deleteMany();
  });

  afterAll(async () => {
    await deps.prisma.$disconnect();
  });

  it('should update a user in the database', async () => {
    const userData = userTestData.createValidUser();
    const userId = randomUUID();
    
    const hashedPassword = await deps.encryptionService.hashPassword(userData.password);
    await deps.prisma.user.create({
      data: {
        ...userData,
        id: userId,
        password: hashedPassword,
      },
    });

    const result = await updateUserUseCase.execute(userId, { 
      name: 'Updated Name' 
    });

    expect(result.isRight()).toBe(true);

    const updatedUserInDb = await deps.prisma.user.findUnique({
      where: { id: userId },
    });

    expect(updatedUserInDb).not.toBeNull();
    expect(updatedUserInDb?.name).toBe('Updated Name');
    expect(updatedUserInDb?.email).toBe('lailton@example.com');
  });

  it('should update user email when new email is available', async () => {
    const userData = userTestData.createValidUser();
    const userId = randomUUID();
    
    const hashedPassword = await deps.encryptionService.hashPassword(userData.password);
    await deps.prisma.user.create({
      data: {
        ...userData,
        id: userId,
        password: hashedPassword,
      },
    });

    const result = await updateUserUseCase.execute(userId, {
      email: 'john.new@example.com'
    });

    expect(result.isRight()).toBe(true);

    const updatedUser = await deps.prisma.user.findUnique({
      where: { id: userId },
    });

    expect(updatedUser?.email).toBe('john.new@example.com');
  });

  it('should return error when updating to an email that already exists', async () => {
    const userData = userTestData.createValidUser();
    const userAnotherData = userTestData.createAnotherUser();
    const userId = randomUUID();
    const userId2 = randomUUID();
    
    const hashedPassword = await deps.encryptionService.hashPassword(userData.password);
    await deps.prisma.user.create({
      data: {
        ...userData,
        id: userId,
        password: hashedPassword,
      },
    });

    await deps.prisma.user.create({
      data: {
        ...userAnotherData,
        id: userId2,
        password: hashedPassword,
      },
    });

    const result = await updateUserUseCase.execute(userId, {
      email: 'another@example.com'
    });

    expect(result.isLeft()).toBe(true);
    expect((result.value as Error).message).toContain('Email is already in use');
  });

  it('should update user password correctly', async () => {
    const originalPassword = 'original123';
    const newPassword = 'newpassword456';

    const userData = userTestData.createValidUser();
    const userId = randomUUID();
    
    const hashedPassword = await deps.encryptionService.hashPassword(userData.password);
    await deps.prisma.user.create({
      data: {
        ...userData,
        id: userId,
        password: hashedPassword,
      },
    });

    const result = await updateUserUseCase.execute(userId, {
      password: newPassword
    });

    expect(result.isRight()).toBe(true);

    const updatedUser = await deps.prisma.user.findUnique({
      where: { id: userId },
    });

    const isNewPasswordValid = await deps.encryptionService.comparePassword(
      newPassword, 
      updatedUser!.password
    );
    
    expect(isNewPasswordValid).toBe(true);
  });
});