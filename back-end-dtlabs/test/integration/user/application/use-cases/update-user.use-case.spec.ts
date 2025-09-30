import { UpdateUserUseCase } from '@/core/user/application/use-cases/update-user.use-case';
import { createUserTestingModule, userTestData } from '../../../../setup/integration/user-setup';

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
    const hashedPassword = await deps.encryptionService.hashPassword(userData.password);
    await deps.prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });

    const result = await updateUserUseCase.execute('user-123', { 
      name: 'Updated Name' 
    });

    expect(result.isRight()).toBe(true);

    const updatedUserInDb = await deps.prisma.user.findUnique({
      where: { id: 'user-123' },
    });

    expect(updatedUserInDb).not.toBeNull();
    expect(updatedUserInDb?.name).toBe('Updated Name');
    expect(updatedUserInDb?.email).toBe('lailton@example.com');
  });

  it('should update user email when new email is available', async () => {
    const userData = userTestData.createValidUser();
    const hashedPassword = await deps.encryptionService.hashPassword(userData.password);
    await deps.prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });

    const result = await updateUserUseCase.execute('user-123', {
      email: 'john.new@example.com'
    });

    expect(result.isRight()).toBe(true);

    const updatedUser = await deps.prisma.user.findUnique({
      where: { id: 'user-123' },
    });

    expect(updatedUser?.email).toBe('john.new@example.com');
  });

  it('should return error when updating to an email that already exists', async () => {
    const userData = userTestData.createValidUser();
    const userAnotherData = userTestData.createAnotherUser();
    const hashedPassword = await deps.encryptionService.hashPassword(userData.password);

    await deps.prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });

    await deps.prisma.user.create({
      data: { ...userAnotherData, password: hashedPassword },
    });

    const result = await updateUserUseCase.execute('user-123', {
      email: 'another@example.com'
    });

    expect(result.isLeft()).toBe(true);
    expect((result.value as Error).message).toContain('Email is already in use');
  });

  it('should update user password correctly', async () => {
    const originalPassword = 'original123';
    const newPassword = 'newpassword456';

    const userData = userTestData.createValidUser();
    const hashedPassword = await deps.encryptionService.hashPassword(userData.password);
    await deps.prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });

    const result = await updateUserUseCase.execute('user-123', {
      password: newPassword
    });

    expect(result.isRight()).toBe(true);

    const updatedUser = await deps.prisma.user.findUnique({
      where: { id: 'user-123' },
    });

    const isNewPasswordValid = await deps.encryptionService.comparePassword(
      newPassword, 
      updatedUser!.password
    );
    
    expect(isNewPasswordValid).toBe(true);
  });
});