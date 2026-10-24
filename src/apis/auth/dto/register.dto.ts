import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50, { message: 'Name must be at least 1 characters long' })
  @Transform(({ value }: { value: string }) => value.trim())
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email' })
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  email: string;

  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol',
    },
  )
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  phone: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  avatarUrl: string;
}
