import { api } from '../../services/api-service';

export async function deleteHeartbeat(heartbeat: string): Promise<void> {
  return await api.post(`/heartbeats/${heartbeat}/delete`);
}