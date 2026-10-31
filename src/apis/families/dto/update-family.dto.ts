import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { FamilyStatus } from '../../../common/enums/family.enum.js';

export class UpdateFamilyDto {
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'Name must be at least 1 characters long' })
  name?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  timezone?: string;
}

export class UpdateFamilySatusDto {
  @IsNotEmpty()
  @IsEnum(FamilyStatus, {
    message: `Invalid status, should be one of ${Object.values(
      FamilyStatus,
    ).join(', ')}`,
  })
  status: FamilyStatus;
}
