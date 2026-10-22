import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { UserStatus } from '../../common/enums/user.enum';
import { PasswordHasher, TokenService } from '@nestjs/authentication';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async signIn({ email, password }: SignInDto) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User account is not active');
    }
    const isPasswordValid = await this.passwordHasher.verify(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const tokenInfo = await this.tokenService.issue(
      user._id.toString() as string,
      {
        method: 'password',
        claims: {
          email: user.email,
          name: user.name,
          status: user.status,
        },
      },
    );
    return { user, token: tokenInfo.accessToken };
  }
}
