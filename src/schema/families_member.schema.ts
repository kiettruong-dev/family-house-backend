import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { UserSchema } from './user.schema.js';
import { FamilySchema } from './families.schema.js';
import {
  FamilyMemberStatus,
  FamilyRole,
  type FamilyMemberStatusType,
  type FamilyRoleType,
} from '../common/enums/family.enum.js';

@Schema({ timestamps: true })
export class FamiliesMemberSchema {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserSchema' })
  user: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'FamilySchema' })
  familyId: Types.ObjectId;

  @Prop({ type: String, enum: FamilyRole, default: FamilyRole.MEMBER })
  role: FamilyRoleType;

  @Prop({
    type: String,
    enum: FamilyMemberStatus,
    default: FamilyMemberStatus.ACTIVE,
  })
  status: FamilyMemberStatusType;

  @Prop({ type: Date, default: Date.now })
  joinDate: Date;
}

export const FamiliesMember =
  SchemaFactory.createForClass(FamiliesMemberSchema);
