import { Heartbeat } from './heartbeat';
import { Notification } from './notification';

export interface Device {
  uuid: string,
  name: string,
  location: string,
  sn: string,
  description: string | null,
  userId: string,
  created_at: Date,
  updated_at: Date,
  heartbeats: Heartbeat[];
  notifications: Notification[];
}

export interface DeviceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  temperature: number;
  lastUpdate: string;
}
