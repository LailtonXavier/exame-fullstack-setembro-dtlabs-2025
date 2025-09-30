import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/shared/core/validation';
import { NotificationRepository } from '../../domain/repository/notification.repository';
import { Notification } from '../../domain/entities/notification.entity';
import { ValidationError } from '@/shared/core/errors/validation.error';

@Injectable()
export class FindNotificationByIdUseCase {
  constructor(private readonly repo: NotificationRepository) {}

  async execute(id: string): Promise<Either<ValidationError, Notification[]>> {
    const allNotifications = await this.repo.findByUserId(id);

    if (!allNotifications) {
      return left(new ValidationError('No notifications found'));
    }

    return right(allNotifications);
  }
}
