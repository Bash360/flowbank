import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export default class SignupDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;
}
