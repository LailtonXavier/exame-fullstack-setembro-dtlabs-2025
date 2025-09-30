import { Heartbeat } from '@/core/heartbeat/domain/entities/heartbeat.entity';

export abstract class HeartbeatRepository {
  abstract create(heartbeat: Heartbeat): Promise<Heartbeat>;
  abstract findByDeviceAndDateRange(deviceId, from, to): Promise<Heartbeat[]>;
  abstract delete(heartbeatId: string): Promise<boolean>;
  abstract findById(heartbeatId: string): Promise<Heartbeat | null>;
}
