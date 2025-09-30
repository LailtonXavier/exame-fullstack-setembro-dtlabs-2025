import { DomainHeartbeatProps } from '@/core/heartbeat/domain/types/prisma-heartbeat';
import { DomainNotificationProps } from '@/core/notification/domain/types/prisma-notification.type';
import { Either, right } from '@/shared/core/validation';
import { randomUUID } from 'crypto';

export class Device {
  constructor(
    public readonly uuid: string,
    public readonly name: string,
    public readonly location: string,
    public readonly sn: string,
    public readonly description: string | null,
    public readonly userId: string,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public readonly heartbeats: DomainHeartbeatProps[] = [],
    public readonly notifications: DomainNotificationProps[] = []
  ) {}

  static create(props: {
    name: string;
    location: string;
    sn: string;
    description?: string;
    userId: string;
  }): Either<Error, Device> {
    return right(new Device(
      randomUUID(),
      props.name,
      props.location,
      props.sn,
      props.description || null,
      props.userId,
      new Date(),
      new Date()
    ));
  }
}