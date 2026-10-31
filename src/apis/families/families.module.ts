import { Module } from '@nestjs/common';
import { FamiliesService } from './families.service.js';
import { FamiliesController } from './families.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Family, FamilySchema } from '../../schema/families.schema.js';
import {
  FamiliesMember,
  FamiliesMemberSchema,
} from '../../schema/families_member.schema.js';
import { FamiliesPolicy } from './families.policy.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FamilySchema.name, schema: Family },
      { name: FamiliesMemberSchema.name, schema: FamiliesMember },
    ]),
  ],
  controllers: [FamiliesController],
  providers: [FamiliesService, FamiliesPolicy],
  exports: [FamiliesService, FamiliesPolicy],
})
export class FamiliesModule {}
