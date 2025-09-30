import { UserRepository } from '@/core/user/domain/repository/user.repository';
import { UpdateUserDtoType } from '@/core/user/application/dto/update-user.dto';
import { Either, left, right, validate } from '@/shared/core/validation';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { ValidationError } from '@/shared/core/errors/validation.error';
import { EncryptionService } from '@/core/auth/application/services/encryption.service';
import { NotFoundError } from '@/shared/core/errors/not-found.error';
import { EmailInUseError } from '@/shared/core/errors/email-in-use.error';

@Injectable()
export class UpdateUserUseCase {
constructor(
    private readonly usersRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async execute(
    userId: string, 
    updateData: UpdateUserDtoType
  ): Promise<Either<Error, User>> {
    const existingUser = await this.usersRepository.findById(userId);
    if (!existingUser) {
      return left(new NotFoundError('User not found'));
    }

    if (updateData.email && updateData.email !== existingUser.email) {
      const emailCheck = await validate(
        !(await this.usersRepository.findByEmail(updateData.email)),
        EmailInUseError
      );
      if (emailCheck.isLeft()) {
        return left(emailCheck.value);
      }
    }

    const hashedPassword = updateData.password 
        ? await this.encryptionService.hashPassword(updateData.password)
        : undefined;

    const updatedUserOrError = User.create({
      ...existingUser,
      ...updateData,
      password: hashedPassword || existingUser.password,
    });

    if (updatedUserOrError.isLeft()) {
      return left(new ValidationError(updatedUserOrError.value.message));
    }

    const updatedUser = await this.usersRepository.update(
      userId,
      updatedUserOrError.value
    );

    return right(updatedUser);
  }
}