import { CreateUserDtoType } from '@/core/user/application/dto/create-user.dto';
import { UserRepository } from '@/core/user/domain/repository/user.repository';
import { User } from '@/core/user/domain/entities/user.entity';
import { EmailInUseError } from '@/shared/core/errors/email-in-use.error';
import { Either, getErrorMessage, left, right, validate } from '@/shared/core/validation';
import { Injectable } from '@nestjs/common';
import { ValidationError } from '@/shared/core/errors/validation.error';
import { EncryptionService } from '@/core/auth/application/services/encryption.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async execute(data: CreateUserDtoType): Promise<Either<Error, User>> {
      const emailCheck = await validate(
        !(await this.usersRepository.findByEmail(data.email)),
        EmailInUseError
      );
  
      if (emailCheck.isLeft()) {
        return left(emailCheck.value);
      }
  
      if (!data.password) {
        return left(new ValidationError('Password is required'));
      }
  
      const hashedPasswordOrError = await this.encryptionService
      .hashPassword(data.password)
      .then((hashed) => right<Error, string>(hashed))
      .catch((err) => left<Error, string>(new ValidationError(getErrorMessage(err))));
    
    if (hashedPasswordOrError.isLeft()) {
      return left(new ValidationError('Failed to create user'));
    }
    
    const hashedPassword = hashedPasswordOrError.value;
    
  
      const userOrError = User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
      });
  
      if (userOrError.isLeft()) {
        return left(new ValidationError(userOrError.value.message));
      }
  
      const user = await this.usersRepository.create(userOrError.value);
      return right(user);
    }
  }
