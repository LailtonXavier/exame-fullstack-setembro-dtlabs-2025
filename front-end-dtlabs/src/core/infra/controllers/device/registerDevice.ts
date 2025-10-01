import { Device } from '@/core/domain/entities/device';
import { RegisterDeviceDto } from '@/core/domain/types/device-types';
import { api } from '../../services/api-service';

export async function registerDevice(data: RegisterDeviceDto): Promise<Device> {
  return await api.post<Device>('/devices', data);
}