import { UserPayload } from '@/core/auth/application/types/user-payload';
import { CurrentUser } from '@/core/auth/infra/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/core/auth/infra/guards/jwt-auth.guard';
import { CreateHeartbeatDto, CreateHeartbeatDtoType } from '@/core/heartbeat/application/dto/create-heartbeat.dto';
import { CreateHeartbeatUseCase } from '@/core/heartbeat/application/use-cases/create-hearbeat.use-case';
import { DeleteHeartbeatUseCase } from '@/core/heartbeat/application/use-cases/delete-heartbeat.use-case';
import { GetHeartbeatsUseCase } from '@/core/heartbeat/application/use-cases/get-hearbeat.use-case';
import { getErrorMessage } from '@/shared/core/validation';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';

@Controller('heartbeats')
export class HeartbeatController {
  constructor(
    private readonly createHeartbeat: CreateHeartbeatUseCase,
    private readonly getHeartbeats: GetHeartbeatsUseCase,
    private readonly deleteHeartbeat: DeleteHeartbeatUseCase,
  ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(
      @CurrentUser() user: UserPayload,
      @Body(new ZodValidationPipe(CreateHeartbeatDto)) body: CreateHeartbeatDtoType
      ) {
      const result = await this.createHeartbeat.execute(body, user.sub);
      
      if (result.isLeft()) {
        const error = result.value;
                
        throw new BadRequestException(getErrorMessage(error));
      }
      
      return result.value;
    }

    @Get(':deviceId')
    @UseGuards(JwtAuthGuard)
    async findByDateRange(
      @Param('deviceId') deviceId: string,
      @Query('from') from?: string,
      @Query('to') to?: string,
    ) {
      const result = await this.getHeartbeats.execute(deviceId, from, to);

      if (result.isLeft()) {
        const error = result.value;
                
        throw new BadRequestException(getErrorMessage(error));
      }
    
      return result.value;
    }

    @Post(':id/delete')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async execute(
      @Param('id') id: string,
    ) {
      const result = await this.deleteHeartbeat.execute(id);
      
      if (result.isLeft()) {
        const error = result.value;
                
        throw new BadRequestException(getErrorMessage(error));
      }

      return { success: true, message: 'User deleted successfully' };
    }
}
