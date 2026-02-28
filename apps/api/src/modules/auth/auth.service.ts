import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

import type { User } from '@event-management/database';
import type { AuthResponse } from '@event-management/shared';

import { getEnv } from '@/common/config/env.validation';
import { UsersService } from '@/modules/users/users.service';

const COOKIE_NAME = 'access_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function getCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax';
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: getEnv().NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    data: { email: string; password: string; name?: string },
    res: Response,
  ): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmail(data.email);

    if (existingUser) {
      this.logger.warn(`Registration failed - email already exists: ${data.email}`);
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });

    return this.buildAuthResponse(user, res);
  }

  async login(email: string, password: string, res: Response): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.warn(`Login failed - user not found: ${email}`);
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Login failed - invalid password for user: ${user.id}`);
      throw new UnauthorizedException();
    }

    return this.buildAuthResponse(user, res);
  }

  async getProfile(userId: string): Promise<AuthResponse> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      this.logger.warn(`Profile fetch failed - user not found: ${userId}`);
      throw new UnauthorizedException();
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }

  logout(res: Response): { message: string } {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: getEnv().NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    });

    return { message: 'Logged out' };
  }

  private buildAuthResponse(user: User, res: Response): AuthResponse {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    res.cookie(COOKIE_NAME, accessToken, getCookieOptions());

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }
}
