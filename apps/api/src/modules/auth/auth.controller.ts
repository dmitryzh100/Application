import { Body, Controller, Get, Post, Res, UseGuards, UsePipes } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import type { User } from '@event-management/database';
import {
  loginSchema,
  registerSchema,
  type AuthResponse,
  type UserLoginRequest,
  type UserRegisterRequest,
} from '@event-management/shared';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '@/common/guards/optional-jwt-auth.guard';
import { YupValidationPipe } from '@/common/pipes/yup-validation.pipe';

import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @UsePipes(new YupValidationPipe(registerSchema))
  async register(
    @Body() body: UserRegisterRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    return this.authService.register(body, res);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @UsePipes(new YupValidationPipe(loginSchema))
  async login(
    @Body() body: UserLoginRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    return this.authService.login(body.email, body.password, res);
  }

  @Get('me')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  async me(@CurrentUser() user: User | null): Promise<{ user: AuthResponse['user'] | null }> {
    if (!user) {
      return { user: null };
    }

    return this.authService.getProfile(user.id);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout and clear auth cookie' })
  logout(@Res({ passthrough: true }) res: Response): { message: string } {
    return this.authService.logout(res);
  }
}
