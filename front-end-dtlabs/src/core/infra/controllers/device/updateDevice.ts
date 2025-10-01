import { Device } from '@/core/domain/entities/device';
import { UpdateDeviceDto } from '@/core/domain/types/device-types';
import { api } from '../../services/api-service';

export async function updateDevice(deviceId: string, data: UpdateDeviceDto): Promise<Device> {
  return await api.put<Device>(`/devices/${deviceId}`, data);
}