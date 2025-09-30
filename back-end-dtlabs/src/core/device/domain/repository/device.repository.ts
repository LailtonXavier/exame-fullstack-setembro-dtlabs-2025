import { CreateDeviceDtoType } from '../../application/dto/create-device.dto';
import { Device } from '../entities/device.entity';

export abstract class DeviceRepository {
  abstract create(device: CreateDeviceDtoType & { userId: string }): Promise<Device>;
  abstract findBySn(sn: string): Promise<Device | null>;
  abstract findById(id: string): Promise<Device | null>;
  abstract findByUserId(userId: string): Promise<Device[]>;
  abstract update(id: string, device: Partial<Device>): Promise<Device>;
  abstract delete(id: string): Promise<boolean>;
}