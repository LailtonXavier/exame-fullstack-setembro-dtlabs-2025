import { DeleteUserUseCase } from '@/core/user/application/use-cases/delete-user.use-case';
import { ValidationError } from '@/shared/core/errors/validation.error';
import { createUserTestingModule, userTestData } from '../../../../setup/integration/user-setup';

describe('DeleteUserUseCase (Integration)', () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let deps: Awaited<ReturnType<typeof createUserTestingModule>>;

  beforeEach(async () => {
    deps = await createUserTestingModule([DeleteUserUseCase]);
    deleteUserUseCase = deps.module.get(DeleteUserUseCase);
    
    await deps.prisma.user.deleteMany();
  });

  afterAll(async () => {
    await deps.prisma.$disconnect();
  });

  it('should delete user from real database', async () => {
    const userData = userTestData.createValidUser();
    const createdUser = await deps.prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: await deps.encryptionService.hashPassword(userData.password),
      },
    });

    const result = await deleteUserUseCase.execute(createdUser.id, userData.password);

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(true);
    
    const userInDb = await deps.prisma.user.findUnique({
      where: { id: createdUser.id },
    });
    expect(userInDb).toBeNull();
  });

  it('should return ValidationError for incorrect password', async () => {
    const userData = userTestData.createValidUser();
    const createdUser = await deps.prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: await deps.encryptionService.hashPassword(userData.password),
      },
    });

    const result = await deleteUserUseCase.execute(createdUser.id, 'wrong-password');

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ValidationError);
    
    const userInDb = await deps.prisma.user.findUnique({
      where: { id: createdUser.id },
    });
    expect(userInDb).not.toBeNull();
  });
});