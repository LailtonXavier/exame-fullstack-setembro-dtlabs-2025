import {DeviceRepository} from '@/core/device/domain/repository/device.repository'
import {Device} from '@/core/device/domain/entities/device.entity'
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetDeviceByIdUseCase {
  constructor(private readonly repo: DeviceRepository) {}

  async execute(sn: string): Promise<Device | null> {
    return this.repo.findBySn(sn);
  }
}
