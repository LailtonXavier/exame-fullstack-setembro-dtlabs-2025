import { NotFoundError } from '@/shared/core/errors/not-found.error';
import { Either, left, right } from '@/shared/core/validation';
import { Injectable } from '@nestjs/common';
import { HeartbeatRepository } from '../../domain/repository/heartbeat.repository';
import { Heartbeat } from '../../domain/entities/heartbeat.entity';

@Injectable()
export class FindHeartbeatByIdUseCase {
  constructor(private readonly repo: HeartbeatRepository) {}

  async execute(id: string): Promise<Either<Error, Heartbeat>> {
    const user = await this.repo.findById(id);

    if (!user) {
      return left(new NotFoundError('Heartbeat not found'));
    }

    return right(user);
  }
}