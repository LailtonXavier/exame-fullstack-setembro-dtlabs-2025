import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/infra/server/app.module';
import { JwtService } from '@nestjs/jwt';
import { JwtSocketAdapter } from '@/infra/socket/jwt-socket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
  });

  app.useWebSocketAdapter(new JwtSocketAdapter(app, app.get(JwtService)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
