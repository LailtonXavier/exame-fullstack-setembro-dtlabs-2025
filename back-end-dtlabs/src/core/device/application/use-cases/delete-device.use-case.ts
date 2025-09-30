import { DeviceRepository } from '@/core/device/domain/repository/device.repository'
import { Either, left, right } from '@/shared/core/validation';
import { NotFoundError } from '@/shared/core/errors/not-found.error';
import { ValidationError } from '@/shared/core/errors/validation.error';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class DeleteDeviceUseCase {
  constructor(private readonly repo: DeviceRepository) {}

  async execute(uuid: string): Promise<Either<NotFoundError | InternalServerErrorException | ValidationError, boolean>> {
    const existingDevice = await this.repo.findById(uuid);

    if (!existingDevice) {
      return left(new NotFoundError(`Device with ID ${uuid} not found`));
    }

    const deleted = await this.repo.delete(uuid);
    if (!deleted) {
      return left(new ValidationError('Failed to delete device'));
    }
    
    return right(true);
  }
}
