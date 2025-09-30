import { FindUserByIdUseCase } from '@/core/user/application/use-cases/find-user-by-id.use-case';
import { NotFoundError } from '@/shared/core/errors/not-found.error';
import { createUserTestingModule, userTestData } from '../../../../setup/integration/user-setup';

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
    const hashedPassword = await deps.encryptionService.hashPassword(userData.password);
    await deps.prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });

    const result = await findUserByIdUseCase.execute('user-123');

    expect(result.isRight()).toBe(true);

    const updatedUserInDb = await deps.prisma.user.findUnique({
      where: { id: 'user-123' },
    });

    expect(updatedUserInDb).not.toBeNull();
    expect(updatedUserInDb?.name).toBe('Lailton');
    expect(updatedUserInDb?.email).toBe('lailton@example.com');
  });

  it('should return NotFoundError when user does not exist', async () => {
    const userData = userTestData.createValidUser();
    const hashedPassword = await deps.encryptionService.hashPassword(userData.password);
    await deps.prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });

    const result = await findUserByIdUseCase.execute('wrong-id');

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
  });
});
