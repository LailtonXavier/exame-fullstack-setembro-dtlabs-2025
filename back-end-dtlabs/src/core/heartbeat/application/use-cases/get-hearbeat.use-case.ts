import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Either, left, right } from '@/shared/core/validation';
import { Heartbeat } from '@/core/heartbeat/domain/entities/heartbeat.entity';
import { HeartbeatRepository } from '@/core/heartbeat/domain/repository/heartbeat.repository';

@Injectable()
export class GetHeartbeatsUseCase {
  constructor(private readonly repo: HeartbeatRepository) {}

  async execute(
    deviceId: string,
    fromStr?: string,
    toStr?: string
  ): Promise<Either<Error | BadRequestException | NotFoundException, Heartbeat[]>> {

    if (!deviceId) {
      return left(new BadRequestException('DeviceId is required'));
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(deviceId)) {
      return left(new BadRequestException('DeviceId must be a valid UUID'));
    }

    let from: Date | undefined;
    let to: Date | undefined;

    try {
      if (fromStr) {
        from = new Date(fromStr);
        if (isNaN(from.getTime())) throw new Error('Invalid from date');
        from.setHours(0, 0, 0, 0);
      }
      if (toStr) {
        to = new Date(toStr);
        if (isNaN(to.getTime())) throw new Error('Invalid to date');
        to.setHours(23, 59, 59, 999);
      }
    } catch (err) {
      return left(new BadRequestException(err.message));
    }

    if (from && to && from > to) {
      return left(new BadRequestException('From date cannot be after To date'));
    }

    const heartbeats = await this.repo.findByDeviceAndDateRange(deviceId, from, to);

    if (heartbeats.length === 0) return left(new NotFoundException('No heartbeats found'));

    return right(heartbeats);
  }
}
