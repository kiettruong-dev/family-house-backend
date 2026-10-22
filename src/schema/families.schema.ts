import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import {
  FamilyStatus,
  type FamilyStatusType,
} from '../common/enums/family.enum';
import { UserSchema } from './user.schema';

export class Settings {
  @Prop({ type: String, required: true })
  currency: string;

  @Prop({ type: String, required: true })
  timezone: string;
}
@Schema({ timestamps: true })
export class FamilySchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserSchema' })
  createdBy: UserSchema;

  @Prop({ type: String, enum: FamilyStatus, default: FamilyStatus.ACTIVE })
  status: FamilyStatusType;

  @Prop({ type: Object, required: true })
  settings: Settings;
}

export const Family = SchemaFactory.createForClass(FamilySchema);
