import { FindUserByEmailUseCase } from '@/core/user/application/use-cases/find-by-email-user.use-case';
import { createUserTestingModule, userTestData } from '../../../../setup/integration/user-setup';
import { EmailInUseError } from '@/shared/core/errors/email-in-use.error';

describe('FindUserByEmailUseCase (Integration)', () => {
  let findUserByEmailUseCase: FindUserByEmailUseCase;
  let deps: Awaited<ReturnType<typeof createUserTestingModule>>;

  beforeEach(async () => {
    deps = await createUserTestingModule([FindUserByEmailUseCase]);
    findUserByEmailUseCase = deps.module.get(FindUserByEmailUseCase);
    
    await deps.prisma.user.deleteMany();
  });

  afterAll(async () => {
    await deps.prisma.$disconnect();
  });

  it('should find user by email successfully', async () => {
    const userData = userTestData.createValidUser();
    const hashedPassword = await deps.encryptionService.hashPassword(userData.password);
    
    await deps.prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });

    const result = await findUserByEmailUseCase.findByEmail(userData.email);

    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      email: userData.email,
      name: userData.name,
    });
  });

  it('should return EmailInUseError when user does not exist', async () => {
    const userData = userTestData.createValidUser();
    const hashedPassword = await deps.encryptionService.hashPassword(userData.password);

    await deps.prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });

    const result = await findUserByEmailUseCase.findByEmail('wrong-email');

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EmailInUseError);
  });
});