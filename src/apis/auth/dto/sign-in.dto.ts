import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
export class SignInDto {
  @IsEmail()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  email: string;

  @IsString()
  password: string;
}
