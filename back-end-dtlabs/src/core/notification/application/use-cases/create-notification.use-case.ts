import { ValidationError } from '@/shared/core/errors/validation.error';
import { Either, left, right } from '@/shared/core/validation';
import { Injectable } from '@nestjs/common';
import { CreateNotificationDtoType } from '../dto/create-notification.dto';
import { Notification } from '@/core/notification/domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/repository/notification.repository';

@Injectable()
export class CreateNotificationUseCase {
  constructor(private readonly repo: NotificationRepository) {}

  async execute(
    dto: CreateNotificationDtoType, 
  ): Promise<Either<Error | ValidationError, Notification>> {
    const notificationOrError = Notification.create({
      condition: dto.condition,
      metric: dto.metric,
      threshold: dto.threshold,
      userId: dto.userId,
      deviceId: dto.deviceId,
    });

    if (notificationOrError.isLeft()) {
      return left(new ValidationError(notificationOrError.value.message));
    }

    const notificationCreated = await this.repo.create(notificationOrError.value);
    return right(notificationCreated);    
  }
}
