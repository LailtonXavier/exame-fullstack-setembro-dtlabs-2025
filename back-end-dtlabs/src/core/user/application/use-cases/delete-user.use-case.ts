import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/shared/core/validation';
import { UserRepository } from '@/core/user/domain/repository/user.repository';
import { ValidationError } from '@/shared/core/errors/validation.error';
import * as bcrypt from 'bcrypt';
import { NotFoundError } from '@/shared/core/errors/not-found.error';
import { EncryptionService } from '@/core/auth/application/services/encryption.service';

@Injectable()
export class DeleteUserUseCase {
 constructor(
    private readonly usersRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async execute(userId: string, password: string): Promise<Either<NotFoundError, boolean>> {
      try {
        const userExists = await this.usersRepository.findById(userId);
  
        if (!userExists) {
          return left(new NotFoundError('User not found'));
        }
  
        if (!await this.encryptionService.comparePassword(password, userExists.password)) {
          return left(new ValidationError('Incorrect password. Please try again.'));
        }
              
        const deleted = await this.usersRepository.delete(userId);
        if (!deleted) {
          return left(new ValidationError('Failed to delete user'));
        }
  
        return right(true);
      } catch (error) {
        return left(new ValidationError('Error during user deletion'));
      }
    }
}