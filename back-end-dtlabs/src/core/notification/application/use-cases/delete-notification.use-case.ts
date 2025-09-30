
import { Either, left, right } from '@/shared/core/validation';
import { NotFoundError } from '@/shared/core/errors/not-found.error';
import { ValidationError } from '@/shared/core/errors/validation.error';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NotificationRepository } from '../../domain/repository/notification.repository';

@Injectable()
export class DeleteNotificationUseCase {
  constructor(private readonly repo: NotificationRepository) {}

  async execute(id: string): Promise<Either<NotFoundError | InternalServerErrorException | ValidationError, boolean>> {
    const existingNotification = await this.repo.findById(id);

    if (!existingNotification) {
      return left(new NotFoundError(`Notification with ID ${id} not found`));
    }

    const deleted = await this.repo.delete(id);
    if (!deleted) {
      return left(new ValidationError('Failed to delete Notification'));
    }
    
    return right(true);
  }
}
