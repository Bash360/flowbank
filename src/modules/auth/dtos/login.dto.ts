import { IsEmail, MinLength } from 'class-validator';

export default class LoginDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
