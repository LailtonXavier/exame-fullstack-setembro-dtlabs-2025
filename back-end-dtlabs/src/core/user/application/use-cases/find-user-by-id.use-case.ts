import { User } from '@/core/user/domain/entities/user.entity';
import { UserRepository } from '@/core/user/domain/repository/user.repository';
import { NotFoundError } from '@/shared/core/errors/not-found.error';
import { Either, left, right } from '@/shared/core/validation';
import { Injectable } from '@nestjs/common';
import { ReturnUser } from '../../domain/types/prisma-user.type';

@Injectable()
export class FindUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<Either<Error, ReturnUser>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return left(new NotFoundError('User not found'));
    }

    return right(user);
  }
}