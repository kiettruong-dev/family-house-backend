import { Policy } from '@nestjs/authorization';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { type CurrentUserType } from '../auth/jwt-auth.provider.js';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FamilySchema } from '../../schema/families.schema.js';
import {
  FamiliesMember,
  FamiliesMemberSchema,
} from '../../schema/families_member.schema.js';
import {
  FamilyMemberStatus,
  FamilyRole,
} from '../../common/enums/family.enum.js';

@Policy()
@Injectable()
export class FamiliesPolicy {
  constructor(
    @InjectModel(FamilySchema.name)
    private readonly familyModel: Model<FamilySchema>,
    @InjectModel(FamiliesMemberSchema.name)
    private readonly familyMemberModel: Model<FamiliesMemberSchema>,
  ) {}

  private getUserId(user: CurrentUserType | null): Types.ObjectId | null {
    if (!user) {
      return null;
    }

    const userId = user.id ?? user._id;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return null;
    }

    return new Types.ObjectId(userId);
  }

  private getFamilyId(familyId: string): Types.ObjectId | null {
    if (!familyId || !Types.ObjectId.isValid(familyId)) {
      return null;
    }

    return new Types.ObjectId(familyId);
  }
  private async isOwner(user: CurrentUserType | null, familyId: string) {
    const userId = this.getUserId(user);
    const familyObjId = this.getFamilyId(familyId);
    if (!userId || !familyObjId) {
      return false;
    }

    const member = await this.familyMemberModel
      .findOne({
        user: userId,
        familyId: familyObjId,
        status: FamilyMemberStatus.ACTIVE,
        role: FamilyRole.OWNER,
      })
      .lean()
      .exec();
    if (!member) {
      throw new ForbiddenException('You are not the owner of this family');
    }
    return !!member;
  }

  private async isMember(user: CurrentUserType | null, familyId: string) {
    const userId = this.getUserId(user);
    const familyObjId = this.getFamilyId(familyId);
    if (!userId || !familyObjId) {
      return false;
    }

    const member = await this.familyMemberModel
      .findOne({
        user: userId,
        familyId: familyObjId,
        status: FamilyMemberStatus.ACTIVE,
      })
      .lean()
      .exec();
    if (!member) {
      throw new ForbiddenException('You are not a member of this family');
    }
    return !!member;
  }

  read(user: CurrentUserType | null, familyId: string) {
    return this.isMember(user, familyId).then((isMember) => {
      if (isMember) {
        return true;
      } else {
        return this.isOwner(user, familyId);
      }
    });
  }
  create(user: CurrentUserType | null) {
    return this.getUserId(user) !== null;
  }

  update(user: CurrentUserType | null, familyId: string) {
    return this.isOwner(user, familyId);
  }
}
