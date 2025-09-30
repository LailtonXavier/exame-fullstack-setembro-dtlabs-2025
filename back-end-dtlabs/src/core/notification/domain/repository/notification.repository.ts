import { Notification } from '@/core/notification/domain/entities/notification.entity';

export abstract class NotificationRepository {
  abstract create(notification: Notification): Promise<Notification>;
  abstract findByUserId(id: string): Promise<Notification[] | null>;
  abstract findById(id: string): Promise<Notification | null>;
  abstract delete(id: string): Promise<boolean>;
}