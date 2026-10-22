import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Public, SignInService } from '@nestjs/authentication';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ACCESS_TOKEN_COOKIE } from '../../common/constants/auth.constant';

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
}
