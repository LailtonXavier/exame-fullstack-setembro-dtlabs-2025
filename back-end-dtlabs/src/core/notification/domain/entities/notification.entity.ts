import { Either, right } from '@/shared/core/validation';
import { randomUUID } from 'crypto';

export class Notification {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly deviceId: string,
    public readonly metric: string,
    public readonly threshold: number,
    public readonly condition: string,
    public readonly createdAt: Date
  ) {}

  static create(props: {
    id?: string;
    userId: string;
    deviceId: string;
    metric: string;
    threshold: number;
    condition: string;
  }): Either<Error, Notification> {
    return right(new Notification(
      randomUUID(),
      props.userId,
      props.deviceId,
      props.metric,
      props.threshold,
      props.condition,
      new Date()
    ));
  }
}
