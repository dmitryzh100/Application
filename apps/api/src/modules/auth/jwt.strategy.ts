import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import type { User } from '@event-management/database';

import { getEnv } from '@/common/config/env.validation';
import { UsersService } from '@/modules/users/users.service';

interface JwtPayload {
  sub: string;
  email: string;
}

function extractJwtFromCookie(req: Request): string | null {
  const token = req.cookies?.access_token;

  if (typeof token === 'string' && token.length > 0) {
    return token;
  }

  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: getEnv().JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      this.logger.warn(`JWT validation failed - user not found: ${payload.sub}`);
      throw new UnauthorizedException();
    }

    return user;
  }
}
