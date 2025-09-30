import { FindUserByIdUseCase } from '@/core/user/application/use-cases/find-user-by-id.use-case';
import { NotFoundError } from '@/shared/core/errors/not-found.error';
import { createUserTestingModule, userTestData } from '../../../../setup/integration/user-setup';
import { randomUUID } from 'crypto';

describe('FindUserByIdUseCase (Integration)', () => {
  let findUserByIdUseCase: FindUserByIdUseCase;
  let deps: Awaited<ReturnType<typeof createUserTestingModule>>;

  beforeEach(async () => {
    deps = await createUserTestingModule([FindUserByIdUseCase]);
    findUserByIdUseCase = deps.module.get(FindUserByIdUseCase);
    
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

    const result = await findUserByIdUseCase.execute(userId);

    expect(result.isRight()).toBe(true);

    const updatedUserInDb = await deps.prisma.user.findUnique({
      where: { id: userId },
    });

    expect(updatedUserInDb).not.toBeNull();
    expect(updatedUserInDb?.name).toBe('Lailton');
    expect(updatedUserInDb?.email).toBe('lailton@example.com');
  });

  it('should return NotFoundError when user does not exist', async () => {
    const userData = userTestData.createValidUser();
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

    const result = await findUserByIdUseCase.execute(userId2);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
  });
});
