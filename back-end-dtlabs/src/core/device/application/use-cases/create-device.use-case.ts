import { CreateDeviceDtoType } from '@/core/device/application/dto/create-device.dto';
import { Device } from '@/core/device/domain/entities/device.entity';
import { DeviceRepository } from '@/core/device/domain/repository/device.repository';
import { ValidationError } from '@/shared/core/errors/validation.error';
import { Either, left, right } from '@/shared/core/validation';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateDeviceUseCase {
  constructor(private readonly repo: DeviceRepository) {}

  async execute(
    dto: CreateDeviceDtoType, 
    userId: string
  ): Promise<Either<Error, Device>> {
    const existingDevice = await this.repo.findBySn(dto.sn);
    
    if (existingDevice) {
      return left(new ValidationError(`Device with SN ${dto.sn} already exists`));
    }

    const deviceOrError = Device.create({
      name: dto.name,
      location: dto.location,
      sn: dto.sn,
      description: dto.description ?? null,
      userId,
    });

    if (deviceOrError.isLeft()) {
      return left(new ValidationError(deviceOrError.value.message));
    }

    const device = await this.repo.create(deviceOrError.value);
    return right(device);    
  }
}