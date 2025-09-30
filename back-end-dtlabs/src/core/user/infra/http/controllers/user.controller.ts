import { UserPayload } from '@/core/auth/application/types/user-payload';
import { CurrentUser } from '@/core/auth/infra/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/core/auth/infra/guards/jwt-auth.guard';
import { CreateUserDto, CreateUserDtoType } from '@/core/user/application/dto/create-user.dto';
import { UpdateUserDto, UpdateUserDtoType } from '@/core/user/application/dto/update-user.dto';
import { CreateUserUseCase } from '@/core/user/application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '@/core/user/application/use-cases/delete-user.use-case';
import { FindUserByIdUseCase } from '@/core/user/application/use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from '@/core/user/application/use-cases/update-user.use-case';
import { EmailInUseError } from '@/shared/core/errors/email-in-use.error';
import { getErrorMessage } from '@/shared/core/validation';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import { BadRequestException, Body, ConflictException, Controller, ForbiddenException, Get, HttpCode, NotFoundException, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(CreateUserDto))
  async create(@Body() body: CreateUserDtoType) {
    const result = await this.createUser.execute(body);
    
    if (result.isLeft()) {
      const error = result.value;
      
      if (error instanceof EmailInUseError) {
        throw new ConflictException(error.message);
      }
      
      throw new BadRequestException(getErrorMessage(error));
    }
    
    return result.value;
  }


  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @CurrentUser() currentUser: { sub: string },
    @Body(new ZodValidationPipe(UpdateUserDto)) updateData: UpdateUserDtoType
  ) {
    if (currentUser.sub !== id) {
      throw new ForbiddenException('You can only upgrade your own account');
    }

    const result = await this.updateUserUseCase.execute(id, updateData);

    if (result.isLeft()) throw result.value;

    const { password, ...userWithoutPassword } = result.value;
    return userWithoutPassword;
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  async findById(
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.findUserByIdUseCase.execute(user.sub);
    
    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    return result.value;
  }

  @Post(':id/delete')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async execute(
    @Param('id') id: string,
    @Body('password') password: string,
    @CurrentUser() user: UserPayload
  ) {

    if (user.sub !== id) {
      throw new ForbiddenException('You can only delete your own account');
    }

    const result = await this.deleteUserUseCase.execute(id, password);
    
    if (result.isLeft()) {
      throw result.value;
    }

    return { success: true, message: 'User deleted successfully' };
  }
}
