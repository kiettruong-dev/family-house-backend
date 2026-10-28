import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { FamilySchema } from '../../schema/families.schema.js';
import mongoose, { Model, Types } from 'mongoose';
import { FamiliesMemberSchema } from '../../schema/families_member.schema.js';
import { CreateFamilyDto } from './dto/create-family.dto.js';
import {
  FamilyMemberStatus,
  FamilyRole,
  FamilyStatus,
} from '../../common/enums/family.enum.js';
import { QueryFamilyDto } from './dto/query-famify.dto.js';
import { calulateSkip } from '../../utils/helper.util.js';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectConnection()
    private readonly connection: mongoose.Connection,
    @InjectModel(FamilySchema.name)
    private readonly familyModel: Model<FamilySchema>,
    @InjectModel(FamiliesMemberSchema.name)
    private readonly familiesMemberModel: Model<FamiliesMemberSchema>,
  ) {}

  async createFamily(createFamilyDto: CreateFamilyDto, userId: Types.ObjectId) {
    const session = await this.connection.startSession();

    try {
      let createdFamily: FamilySchema | null = null;
      await session.withTransaction(async () => {
        const familyExist = await this.familyModel
          .findOne({
            name: createFamilyDto.name,
            createdBy: userId,
          })
          .session(session)
          .lean()
          .exec();
        if (familyExist) {
          throw new ConflictException({
            errorCode: 300,
            message: 'Family already exists',
          });
        }

        const [family] = await this.familyModel.create(
          [
            {
              name: createFamilyDto.name,
              createdBy: userId,
              status: FamilyStatus.ACTIVE,
              settings: {
                currency: createFamilyDto.currency,
                timezone: createFamilyDto.timezone,
              },
            },
          ],
          {
            session,
          },
        );

        createdFamily = family;
        await this.familiesMemberModel.create(
          [
            {
              user: userId,
              familyId: family._id,
              role: FamilyRole.OWNER,
              status: FamilyMemberStatus.ACTIVE,
              joinDate: new Date(),
            },
          ],
          {
            session,
          },
        );
      });
      if (!createdFamily) {
        throw new InternalServerErrorException('Failed to create family');
      }

      return createdFamily;
    } catch (error) {
      console.error('Error creating family:', error);
      if (error instanceof Error && 'code' in error && error.code === 11000) {
        throw new ConflictException('Family name already exists');
      }
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getAllFamilyByUserId(userId: Types.ObjectId, query: QueryFamilyDto) {
    try {
      const { name, status, page, pageSize } = query;
      const skip = calulateSkip(page, pageSize);
      const pipeline = [
        {
          $match: {
            $and: [
              { createdBy: userId },
              name ? { name: { $regex: name, $options: 'i' } } : {},
              status ? { status } : {},
            ],
          },
        },
        { $skip: skip },
        { $limit: Number(pageSize) },
      ];

      const [families, total] = await Promise.all([
        this.familyModel.aggregate(pipeline),
        this.familyModel.countDocuments({ createdBy: userId }),
      ]);
      return {
        families,
        pagination: {
          page,
          pageSize,
          total,
        },
      };
    } catch (error) {
      console.error('Error fetching families:', error);
      throw error;
    }
  }

  async getFamilyById(familyId: string, userId: Types.ObjectId) {
    try {
      const family = await this.familyModel
        .findOne({ _id: familyId, createdBy: userId })
        .lean()
        .exec();
      if (!family) {
        throw new NotFoundException(
          'Family not found or you are not the owner of this family',
        );
      }
      const members = await this.familiesMemberModel
        .find({ familyId: new mongoose.Types.ObjectId(familyId) })
        .select('user role status joinDate')
        .populate({ path: 'user', select: 'name email userId' })
        .lean()
        .exec();
      return { family, familyMembers: members };
    } catch (error) {
      console.error('Error fetching family by ID:', error);
      throw error;
    }
  }
}
