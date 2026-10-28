import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto.js';
import { FamilyStatus } from '../../../common/enums/family.enum.js';

export class QueryFamilyDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsEnum(FamilyStatus, {
    message: `Invalid status, should be one of ${Object.values(FamilyStatus).join(', ')}`,
  })
  status: FamilyStatus;
}
