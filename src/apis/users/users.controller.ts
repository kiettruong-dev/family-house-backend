import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Can.Anyone()
  async getMe(@CurrentUser() user: any) {
    return user;
  }
}
