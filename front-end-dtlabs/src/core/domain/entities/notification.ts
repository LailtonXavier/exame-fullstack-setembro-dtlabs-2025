import { Heartbeat } from './heartbeat';

export interface Notification {
  id: string,
  userId: string,
  deviceId: string,
  metric: keyof Omit<Heartbeat, 'id' | 'deviceId' | 'bootTime' | 'createdAt'>;
  threshold: number;
  condition: '>' | '<' | '==';
  createdAt: string;
}