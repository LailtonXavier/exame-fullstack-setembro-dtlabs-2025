import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/shared/core/validation';
import { HeartbeatRepository } from '../../domain/repository/heartbeat.repository';
import { NotFoundError } from '@/shared/core/errors/not-found.error';
import { ValidationError } from '@/shared/core/errors/validation.error';

@Injectable()
export class DeleteHeartbeatUseCase {
 constructor(
    private readonly repo: HeartbeatRepository,
  ) {}

  async execute(heartbeatId: string): Promise<Either<NotFoundError, boolean>> {
      try {
        const userExists = await this.repo.findById(heartbeatId);
  
        if (!userExists) {
          return left(new NotFoundError('Heartbeat not found'));
        }
  
        const deleted = await this.repo.delete(heartbeatId);
        if (!deleted) {
          return left(new ValidationError('Failed to delete heartbeat'));
        }
  
        return right(true);
      } catch (error) {
        return left(new ValidationError('Error during heartbeat deletion'));
      }
    }
}