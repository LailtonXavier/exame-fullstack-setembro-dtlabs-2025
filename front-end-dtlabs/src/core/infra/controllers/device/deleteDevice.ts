import { api } from '../../services/api-service';

export async function deleteDevice(deviceId: string): Promise<void> {
  return await api.post(`/devices/${deviceId}/delete`);
}