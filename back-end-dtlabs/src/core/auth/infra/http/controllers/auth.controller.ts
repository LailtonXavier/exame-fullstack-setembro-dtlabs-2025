import { LoginDto, LoginSchema } from '@/core/auth/application/dto/login.dto';
import { RegisterDto, RegisterSchema } from '@/core/auth/application/dto/register.dto';
import { JwtApplicationService } from '@/core/auth/application/services/jwt-application.service';
import { EmailInUseError } from '@/shared/core/errors/email-in-use.error';
import { getErrorMessage } from '@/shared/core/validation';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import { BadRequestException, Body, ConflictException, Controller, HttpCode, HttpStatus, Post, UsePipes } from '@nestjs/common';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: JwtApplicationService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  @HttpCode(HttpStatus.OK)
  async login(@Body()  loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    return this.authService.login(user);
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);

    if (result.isLeft()) {
      const error = result.value;
      
      if (error instanceof EmailInUseError) {
        throw new ConflictException(error.message);
      }
      
      throw new BadRequestException(getErrorMessage(error));
    }

    console.log('00000000000', result.value)

    return result.value
  }
}