import {
  AuthenticationRegistry,
  JwtBearerProvider,
  JwtClaims,
} from '@nestjs/authentication';
import { ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from '../users/users.service';
import { ACCESS_TOKEN_COOKIE } from '../../common/constants/auth.constant';

@Injectable()
export class JwtAuth extends JwtBearerProvider<any> {
  constructor(
    private readonly usersService: UsersService,
    registry: AuthenticationRegistry,
  ) {
    super();
    registry.registerProvider(this);
  }

  // JwtBearerProvider only reads the Authorization header, so when the request
  // has none, lift the token from the httpOnly cookie set at sign-in.
  authenticate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req?.cookies?.[ACCESS_TOKEN_COOKIE];
    if (token && !req.headers.authorization) {
      req.headers.authorization = `Bearer ${token}`;
    }
    return super.authenticate(context);
  }

  protected validate(claims: JwtClaims) {
    return this.usersService.findUserById(claims.sub!);
  }
}
