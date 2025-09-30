import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/shared/core/validation';
import { ValidationError } from '@/shared/core/errors/validation.error';
import { HeartbeatRepository } from '@/core/heartbeat/domain/repository/heartbeat.repository';
import { Heartbeat } from '@/core/heartbeat/domain/entities/heartbeat.entity';
import { CreateHeartbeatDtoType } from '../dto/create-heartbeat.dto';
import { NotificationEngineService } from '@/core/notification/application/services/notification-engine.service';

@Injectable()
export class CreateHeartbeatUseCase {
  constructor(
    private readonly repo: HeartbeatRepository,
    private readonly notificationEngineService: NotificationEngineService,
  ) {}

  async execute(
    dto: CreateHeartbeatDtoType,
    userId: string,
  ): Promise<Either<Error, Heartbeat>> {
    if (!dto.deviceId) {
      return left(new ValidationError('DeviceId is required'));
    }

    const heartbeatOrError = Heartbeat.create({
      deviceId: dto.deviceId,
      bootTime: dto.bootTime,
      connectivity: dto.connectivity,
      cpuUsage: dto.cpuUsage,
      diskFree: dto.diskFree,
      latencyDns: dto.latencyDns,
      ramUsage: dto.ramUsage,
      temperature: dto.temperature,
    });

    if (heartbeatOrError.isLeft()) {
      return left(heartbeatOrError.value);
    }

    await this.notificationEngineService.processHeartbeat(heartbeatOrError.value, userId);

    const heartbeat = await this.repo.create(heartbeatOrError.value);
    return right(heartbeat);
  }
}
