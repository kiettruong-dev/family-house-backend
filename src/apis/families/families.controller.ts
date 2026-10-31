import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FamiliesService } from './families.service.js';
import { CreateFamilyDto } from './dto/create-family.dto.js';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { type CurrentUserType } from '../auth/jwt-auth.provider.js';
import { QueryFamilyDto } from './dto/query-famify.dto.js';
import { Types } from 'mongoose';
import {
  UpdateFamilyDto,
  UpdateFamilySatusDto,
} from './dto/update-family.dto.js';
import { FamiliesPolicy } from './families.policy.js';

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

  @Can(FamiliesPolicy, 'read', (context) => [
    context.switchToHttp().getRequest().params.id,
  ])
  @Get(':id')
  getById(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
    return this.familiesService.getFamilyById(id);
  }

  @Can(FamiliesPolicy, 'update', (context) => [
    context.switchToHttp().getRequest().params.id,
  ])
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateFamilyDto) {
    return this.familiesService.updateFamily(id, body);
  }

  @Can(FamiliesPolicy, 'update', (context) => [
    context.switchToHttp().getRequest().params.id,
  ])
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: UpdateFamilySatusDto) {
    return this.familiesService.updateFamilyStatus(id, body);
  }
}
