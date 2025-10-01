import { Heartbeat } from '@/core/domain/entities/heartbeat';
import { api } from '../../services/api-service';
import { getHeartbeatProps } from '@/core/domain/types/heartbeat-types';

export async function getHeartbeat({deviceId, from, to}: getHeartbeatProps): Promise<Heartbeat[]> {
  return await api.get<Heartbeat[]>(`/heartbeats/${deviceId}?from=${from}&to=${to}`);
}