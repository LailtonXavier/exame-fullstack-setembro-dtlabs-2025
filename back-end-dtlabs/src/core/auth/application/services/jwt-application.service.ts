import { CreateUserUseCase } from '@/core/user/application/use-cases/create-user.use-case';
import { FindUserByEmailUseCase } from '@/core/user/application/use-cases/find-by-email-user.use-case';
import { User } from '@/core/user/domain/entities/user.entity';
import { Either, left, right } from '@/shared/core/validation';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { JwtService } from './jwt.service';
import { JwtRegister } from '../types/tokens.type';

@Injectable()
export class JwtApplicationService {
  constructor(
    private findUserByEmailUseCase: FindUserByEmailUseCase,
    private createUserUseCase: CreateUserUseCase,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const result = await this.findUserByEmailUseCase.findByEmail(email);
    
    if (result.isLeft()) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = result.value;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }


  async login(user: { id: string; email: string }): Promise<{
    accessToken: string;
}> {
    const accessToken = await this.jwtService.signAccessToken({
      sub: user.id,
      email: user.email,
    });

    return { accessToken };
  }

  async register(
    registerDto: RegisterDto
  ): Promise<
    Either<Error, JwtRegister>
  > {
    const result = await this.createUserUseCase.execute(registerDto);
  
    if (result.isLeft()) {
      return left(result.value);
    }
  
    const user = result.value;
    const tokens = await this.login(user);
    
    return right({
      user,
      tokens
    });
  }
  
}