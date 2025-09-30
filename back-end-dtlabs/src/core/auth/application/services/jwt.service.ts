import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(private readonly nestJwtService: NestJwtService) {}

  async signAccessToken(payload: { sub: string; email: string }): Promise<string> {
    return this.nestJwtService.sign(payload, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET || 'default_secret',
    });
  }
}