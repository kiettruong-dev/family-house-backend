import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FamiliesService } from './families.service.js';
import { CreateFamilyDto } from './dto/create-family.dto.js';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { UserSchema } from '../../schema/user.schema.js';
import { type CurrentUserType } from '../auth/jwt-auth.provider.js';
import { QueryFamilyDto } from './dto/query-famify.dto.js';
import { Types } from 'mongoose';

@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Can.Anyone()
  @Post()
  create(@Body() body: CreateFamilyDto, @CurrentUser() user: CurrentUserType) {
    return this.familiesService.createFamily(body, user._id);
  }

  @Can.Anyone()
  @Get()
  getAll(@CurrentUser() user: CurrentUserType, @Query() query: QueryFamilyDto) {
    return this.familiesService.getAllFamilyByUserId(user._id, query);
  }

  @Can.Anyone()
  @Get(':id')
  getById(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
    return this.familiesService.getFamilyById(id, user._id);
  }
}
