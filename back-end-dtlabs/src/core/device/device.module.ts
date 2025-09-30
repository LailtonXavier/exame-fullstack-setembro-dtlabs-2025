import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@/core/auth/auth.module';
import { DeviceController } from '@/core/device/infra/http/controllers/device.controller';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { DeviceRepository } from '@/core/device/domain/repository/device.repository';
import { CreateDeviceUseCase } from '@/core/device/application/use-cases/create-device.use-case';
import { GetDeviceByIdUseCase } from '@/core/device/application/use-cases/get-device-by-id.use-case';
import { UpdateDeviceUseCase } from '@/core/device/application/use-cases/update-device.use-case';
import { DeleteDeviceUseCase } from '@/core/device/application/use-cases/delete-device.use-case';
import { PrismaDeviceRepository } from '@/core/device/infra/prisma/repository/prisma-device.repository';

@Module({
  controllers: [DeviceController],
  imports: [forwardRef(() => AuthModule)],
  providers: [
    CreateDeviceUseCase,
    UpdateDeviceUseCase,
    DeleteDeviceUseCase,
    GetDeviceByIdUseCase,
    PrismaDeviceRepository,
    PrismaService,
    {
      provide: DeviceRepository,
      useClass: PrismaDeviceRepository,
    },
  ],
  exports: [
    CreateDeviceUseCase,
  ],
})
export class DeviceModule {}