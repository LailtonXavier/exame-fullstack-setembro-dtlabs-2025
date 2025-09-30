import { DeviceRepository } from '@/core/device/domain/repository/device.repository';
import { Device } from '@/core/device/domain/entities/device.entity';
import { UpdateDeviceDtoType } from '@/core/device/application/dto/update-device.dto';
import { Either, left, right } from '@/shared/core/validation';
import { NotFoundError } from '@/shared/core/errors/not-found.error';
import { DeviceInUseError } from '@/shared/core/errors/device-in-use.error';
import { ValidationError } from '@/shared/core/errors/validation.error';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateDeviceUseCase {
  constructor(private readonly repo: DeviceRepository) {}

  async execute(
    uuid: string, 
    updateData: UpdateDeviceDtoType
  ): Promise<Either<Error, Device>> {
    
    const existingDevice = await this.repo.findById(uuid);
    if (!existingDevice) {
      return left(new NotFoundError(`Device with ID ${uuid} not found`));
    }

    if (updateData.sn && updateData.sn !== existingDevice.sn) {
      const deviceWithSn = await this.repo.findBySn(updateData.sn);
      
      if (deviceWithSn && deviceWithSn.uuid !== uuid) {
        return left(new DeviceInUseError);
      }
    }

    const updatedDeviceOrError = Device.create({
      ...existingDevice,
      ...updateData,
      userId: existingDevice.userId,
    })

    if (updatedDeviceOrError.isLeft()) {
      return left(new ValidationError(updatedDeviceOrError.value.message));
    }

    const updatedDevice = await this.repo.update(uuid, updatedDeviceOrError.value);

    return right(updatedDevice);
   
  }
}