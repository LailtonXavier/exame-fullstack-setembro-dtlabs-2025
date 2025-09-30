import { Device } from '@/core/device/domain/entities/device.entity';
import { Notification } from '@/core/notification/domain/entities/notification.entity';
import { Either, left, right } from '@/shared/core/validation';

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly devices: Device[] = [],
    public readonly notifications: Notification[] = []
  ) {}

  public static create(props: {
    id?: string;
    name: string;
    email: string;
    password: string;
    devices?: Device[];
    notifications?: Notification[];
  }): Either<Error, User> {
    if (!props.email.includes('@')) {
      return left(new Error('Email inválido'));
    }

    return right(new User(
      props.id || '',
      props.name,
      props.email,
      props.password,
      props.devices ?? [],
      props.notifications ?? []
    ));
  }
}