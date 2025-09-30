import { UserRepository } from '@/core/user/domain/repository/user.repository';
import { Either, left, right } from '@/shared/core/validation';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { NotFoundError } from '@/shared/core/errors/not-found.error';
import { EmailInUseError } from '@/shared/core/errors/email-in-use.error';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    private readonly usersRepository: UserRepository,
  ) {}

  async findByEmail(email: string): Promise<Either<NotFoundError, User>> {
    const user = await this.usersRepository.findByEmail(email);
    
    if (!user) {
      return left(new EmailInUseError());
    }

    return right(user);
  }
}