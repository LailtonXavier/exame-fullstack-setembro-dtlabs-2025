import { BadRequestException, Body, ConflictException, Controller, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserPayload } from '@/core/auth/application/types/user-payload';
import { CurrentUser } from '@/core/auth/infra/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/core/auth/infra/guards/jwt-auth.guard';
import { CreateDeviceDto, CreateDeviceDtoType } from '@/core/device/application/dto/create-device.dto';
import { UpdateDeviceDto, UpdateDeviceDtoType } from '@/core/device/application/dto/update-device.dto';
import { CreateDeviceUseCase } from '@/core/device/application/use-cases/create-device.use-case';
import { DeleteDeviceUseCase } from '@/core/device/application/use-cases/delete-device.use-case';
import { UpdateDeviceUseCase } from '@/core/device/application/use-cases/update-device.use-case';
import { EmailInUseError } from '@/shared/core/errors/email-in-use.error';
import { NotFoundError } from '@/shared/core/errors/not-found.error';
import { ValidationError } from '@/shared/core/errors/validation.error';
import { getErrorMessage } from '@/shared/core/validation';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';

@Controller('devices')
export class DeviceController {
  constructor(
    private readonly createDevice: CreateDeviceUseCase,
    private readonly updateDeviceUseCase: UpdateDeviceUseCase,
    private readonly deleteDeviceUseCase: DeleteDeviceUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(CreateDeviceDto)) body: CreateDeviceDtoType
    ) {
    const result = await this.createDevice.execute(body, user.sub);
    
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
    @Body(new ZodValidationPipe(UpdateDeviceDto)) updateData: UpdateDeviceDtoType
  ) {
    const result = await this.updateDeviceUseCase.execute(id, updateData);

    if (result.isLeft()) throw result.value;

    return result.value;
  }

  @Post(':id/delete')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async execute(@Param('id') id: string) {
    const result = await this.deleteDeviceUseCase.execute(id);

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof ValidationError) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(error.message);
    }

    return { success: true, message: 'Device deleted successfully' };
  }
}
