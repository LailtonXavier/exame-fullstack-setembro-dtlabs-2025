import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@/core/auth/auth.module';
import { NotificationController } from '@/core/notification/infra/http/controllers/notification.controller';
import { CreateNotificationUseCase } from '@/core/notification/application/use-cases/create-notification.use-case';
import { NotificationRepository } from '@/core/notification/domain/repository/notification.repository';
import { PrismaNotificationRepository } from '@/core/notification/infra/prisma/prisma-notification-repository';
import { FindNotificationByIdUseCase } from '@/core/notification/application/use-cases/find-notification-by-id.use-case';
import { DeleteNotificationUseCase } from '@/core/notification/application/use-cases/delete-notification.use-case';
import { NotificationEngineService } from '@/core/notification/application/services/notification-engine.service';
import { NotificationGateway } from '@/core/notification/infra/gateways/notification.gateway';

@Module({
  controllers: [NotificationController],
  imports: [forwardRef(() => AuthModule)],
  providers: [
    NotificationEngineService,
    NotificationGateway,
    CreateNotificationUseCase,
    FindNotificationByIdUseCase,
    DeleteNotificationUseCase,
    PrismaService,
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [
    NotificationEngineService,
    NotificationGateway,
    CreateNotificationUseCase,
    DeleteNotificationUseCase,
    FindNotificationByIdUseCase,
    NotificationRepository,
  ],
})
export class NotificationModule {}
