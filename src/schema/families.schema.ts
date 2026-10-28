import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import {
  FamilyStatus,
  type FamilyStatusType,
} from '../common/enums/family.enum.js';

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

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSchema',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({ type: String, enum: FamilyStatus, default: FamilyStatus.ACTIVE })
  status: FamilyStatusType;

  @Prop({ type: Object, required: true })
  settings: Settings;
}
export const Family = SchemaFactory.createForClass(FamilySchema);
Family.index({ name: 1, createdBy: 1 }, { unique: true });
