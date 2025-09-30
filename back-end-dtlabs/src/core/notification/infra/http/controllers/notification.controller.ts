import { Controller, Post, Get, Delete, Param, Body, HttpCode, HttpStatus, UseGuards, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '@/core/auth/infra/guards/jwt-auth.guard';
import { CreateNotificationUseCase } from '@/core/notification/application/use-cases/create-notification.use-case';
import { DeleteNotificationUseCase } from '@/core/notification/application/use-cases/delete-notification.use-case';
import { CreateNotificationDto, CreateNotificationDtoType } from '@/core/notification/application/dto/create-notification.dto';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import { getErrorMessage } from '@/shared/core/validation';
import { NotFoundError } from '@/shared/core/errors/not-found.error';
import { FindNotificationByIdUseCase } from '@/core/notification/application/use-cases/find-notification-by-id.use-case';
import { UserPayload } from '@/core/auth/application/types/user-payload';
import { CurrentUser } from '@/core/auth/infra/decorators/current-user.decorator';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly findNotificationByIdUseCase: FindNotificationByIdUseCase,
    private readonly deleteNotificationUseCase: DeleteNotificationUseCase
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(new ZodValidationPipe(CreateNotificationDto)) body: CreateNotificationDtoType) {
    const result = await this.createNotificationUseCase.execute(body);

    if (result.isLeft()) {
      throw new BadRequestException(getErrorMessage(result.value));
    }

    return result.value;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findByUserId(
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.findNotificationByIdUseCase.execute(user.sub);

    if (result.isLeft()) {
      throw new NotFoundException(getErrorMessage(result.value));
    }

    return result.value;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    const result = await this.deleteNotificationUseCase.execute(id);

    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof NotFoundError) throw new NotFoundException(error.message);
      throw new BadRequestException(getErrorMessage(error));
    }

    return { success: true, message: 'Notification deleted successfully' };
  }
}
