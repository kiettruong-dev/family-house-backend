import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserStatus, type UserStatusType } from '../common/enums/user.enum.js';

@Schema({ timestamps: true })
export class UserSchema {
  @Prop({ type: String, required: true, unique: true })
  userId: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, select: false })
  passwordHash: string;

  @Prop({ type: String, default: '' })
  phone: string;

  @Prop({ type: String, default: '' })
  avatarUrl: string;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatusType;
}

export const User = SchemaFactory.createForClass(UserSchema);
