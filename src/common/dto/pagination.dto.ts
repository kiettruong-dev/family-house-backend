import { Transform } from 'class-transformer';
import { IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => parseInt(value) || 1)
  page: number = 1;

  @IsOptional()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value) || 10)
  pageSize: number = 10;
}
