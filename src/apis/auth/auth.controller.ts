import { Body, Controller, Post, Res } from '@nestjs/common';
import { Public } from '@nestjs/authentication';
import { SignInDto } from './dto/sign-in.dto.js';
import { AuthService } from './auth.service.js';
import type { Response } from 'express';
import { ACCESS_TOKEN_COOKIE } from '../../common/constants/auth.constant.js';
import { RegisterDto } from './dto/register.dto.js';
import { Can } from '@nestjs/authorization';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  async signIn(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.authService.signIn(body);
    res.cookie(ACCESS_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    });
    return {
      user: {
        _id: user._id,
        email: user.email,
      },
      message: 'Sign-in successful',
    };
  }

  @Public()
  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.authService.register(body);
    res.cookie(ACCESS_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    });
    return {
      user: {
        userId: user.userId,
        email: user.email,
      },
      message: 'Sign-up successful',
    };
  }

  @Can.Anyone()
  @Post('sign-out')
  async signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(ACCESS_TOKEN_COOKIE);
    return { message: 'Sign-out successful' };
  }
}
