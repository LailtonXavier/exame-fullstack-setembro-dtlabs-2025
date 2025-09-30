import { forwardRef, Module } from '@nestjs/common';
import { HeartbeatController } from './infra/http/controllers/heartbeat.controller';
import { AuthModule } from '@/core/auth/auth.module';
import { CreateHeartbeatUseCase } from '@/core/heartbeat/application/use-cases/create-hearbeat.use-case';
import { PrismaHeartbeatRepository } from '@/core/heartbeat/infra/database/prisma/repositories/prisma-heartbeat.repository';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {HeartbeatRepository} from '@/core/heartbeat/domain/repository/heartbeat.repository'
import { GetHeartbeatsUseCase } from '@/core/heartbeat/application/use-cases/get-hearbeat.use-case';
import { NotificationModule } from '../notification/notification.module';
import { DeleteHeartbeatUseCase } from './application/use-cases/delete-heartbeat.use-case';

@Module({
  controllers: [HeartbeatController],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => NotificationModule),
  ],
  providers: [
    DeleteHeartbeatUseCase,
    CreateHeartbeatUseCase,
    GetHeartbeatsUseCase,
    PrismaHeartbeatRepository,
    PrismaService,
    {
      provide: HeartbeatRepository,
      useClass: PrismaHeartbeatRepository,
    },
  ],
  exports: [
    DeleteHeartbeatUseCase,
    CreateHeartbeatUseCase,
    GetHeartbeatsUseCase,
  ],
})
export class HeartbeatModule {}