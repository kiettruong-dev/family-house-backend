import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSchema } from '../../schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserSchema.name) private readonly userModel: Model<UserSchema>,
  ) {}

  async findUserByEmail(email: string) {
    try {
      const user = await this.userModel
        .findOne({ email })
        .select('+passwordHash')
        .exec();
      return user;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error}`);
    }
  }

  async findUserById(_id: string) {
    try {
      const user = await this.userModel.findById(_id).exec();
      return user;
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error}`);
    }
  }
}
