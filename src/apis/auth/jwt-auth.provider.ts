import {
  AuthenticationRegistry,
  JwtBearerProvider,
  JwtClaims,
} from '@nestjs/authentication';
import { ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from '../users/users.service.js';
import { ACCESS_TOKEN_COOKIE } from '../../common/constants/auth.constant.js';

export type CurrentUserType = Awaited<ReturnType<JwtAuth['validate']>> | any;
@Injectable()
export class JwtAuth extends JwtBearerProvider<any> {
  constructor(
    private readonly usersService: UsersService,
    registry: AuthenticationRegistry,
  ) {
    super();
    registry.registerProvider(this);
  }

  authenticate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req?.cookies?.[ACCESS_TOKEN_COOKIE];
    if (token && !req.headers.authorization) {
      req.headers.authorization = `Bearer ${token}`;
    }
    return super.authenticate(context);
  }

  protected async validate(claims: JwtClaims) {
    const user = await this.usersService.findUserById(claims.sub!);
    // add user to request (req.user)
    return user;
  }
}
