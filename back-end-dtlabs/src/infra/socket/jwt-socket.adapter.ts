import { IoAdapter } from '@nestjs/platform-socket.io';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';
import { ServerOptions } from 'socket.io';

export class JwtSocketAdapter extends IoAdapter {
  constructor(
    private app: INestApplication, 
    private jwtService: JwtService) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);

    server.use((socket, next) => {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Unauthorized'));

      try {
        const payload = this.jwtService.verify(token);
        socket.data.user = payload;
        next();
      } catch (err) {
        next(new Error('Unauthorized'));
      }
    });

    return server;
  }
}
