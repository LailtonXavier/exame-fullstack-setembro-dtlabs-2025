import { api } from '../../services/api-service';
import { Heartbeat } from '@/core/domain/entities/heartbeat';
import { RegisterHeartbeatDto } from '@/core/domain/types/heartbeat-types';

export async function registerHeartbeat(data: RegisterHeartbeatDto): Promise<Heartbeat> {
  return await api.post<Heartbeat>('/heartbeats', data);
}