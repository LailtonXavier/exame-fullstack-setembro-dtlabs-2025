import { DomainHeartbeatProps } from '@/core/heartbeat/domain/types/prisma-heartbeat';
import { DomainNotificationProps } from '@/core/notification/domain/types/prisma-notification.type';

export type DomainDeviceProps = {
  uuid: string;
  name: string;
  location: string;
  sn: string;
  description: string;
  userId: string;
  created_at: Date;
  updated_at: Date;
  heartbeats?: DomainHeartbeatProps[];
  notifications?: DomainNotificationProps[];
};