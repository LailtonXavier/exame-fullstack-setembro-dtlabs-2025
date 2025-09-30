import { CreateUserUseCase } from '@/core/user/application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '@/core/user/application/use-cases/delete-user.use-case';
import { FindUserByEmailUseCase } from '@/core/user/application/use-cases/find-by-email-user.use-case';
import { FindUserByIdUseCase } from '@/core/user/application/use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from '@/core/user/application/use-cases/update-user.use-case';
import { UserController } from '@/core/user/infra/http/controllers/user.controller';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@/core/auth/auth.module';
import { UserRepository } from '@/core/user/domain/repository/user.repository';
import { PrismaUserRepository } from '@/core/user/infra/prisma/repositories/prisma-user.repository';

@Module({
  controllers: [UserController],
  imports: [forwardRef(() => AuthModule)],
  providers: [
    CreateUserUseCase,
    FindUserByEmailUseCase,
    UpdateUserUseCase,
    FindUserByIdUseCase,
    DeleteUserUseCase,
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [
    FindUserByEmailUseCase,
    CreateUserUseCase,
    UserRepository,
  ],
})
export class UserModule {}
