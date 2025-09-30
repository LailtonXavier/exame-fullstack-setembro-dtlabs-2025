import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from '../database/env/env.module';
import { UserModule } from '@/core/user/user.module';
import { PrismaModule } from '../database/prisma/prisma.module';
import { AuthModule } from '@/core/auth/auth.module';
import { DeviceModule } from '@/core/device/device.module';
import { HeartbeatModule } from '@/core/heartbeat/heartbeat.module';
import { NotificationModule } from '@/core/notification/notification.module';

@Module({
  imports: [PrismaModule, EnvModule, AuthModule, UserModule, DeviceModule, HeartbeatModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
