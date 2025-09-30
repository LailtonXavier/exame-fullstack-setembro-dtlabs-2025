import { EnvModule } from '@/infra/database/env/env.module';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './infra/http/controllers/auth.controller';
import { JwtStrategy } from './infra/strategies/jwt.strategy';
import { JwtApplicationService } from './application/services/jwt-application.service';
import { EncryptionService } from './application/services/encryption.service';
import { jwtConstants } from './infra/constants/jwt.constants';
import { JwtService } from './application/services/jwt.service';

@Module({
  imports: [
    EnvModule,
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    EncryptionService,
    JwtModule,
    JwtApplicationService,
    JwtService,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [
    JwtService,
    JwtModule,
    EncryptionService,
  ],
})
export class AuthModule {}