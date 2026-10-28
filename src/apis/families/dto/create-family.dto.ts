import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateFamilyDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50, { message: 'Name must be at least 1 characters long' })
  name: string;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsString()
  timezone: string;
}
