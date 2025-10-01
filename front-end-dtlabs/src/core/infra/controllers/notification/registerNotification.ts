import { Notification } from '@/core/domain/entities/notification';
import { RegisterNotificationDto } from '@/core/domain/types/notification-types';
import { api } from '../../services/api-service';

export async function registerNotification(data: RegisterNotificationDto): Promise<Notification> {
  return await api.post<Notification>('/notifications', data);
}