import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  MinLength,
} from 'class-validator';

export class SignInDto {
  /**
   * User's email
   * @example "email@example.com"
   */
  @IsEmail()
  email: string;

  /**
   * User's password
   * @example "Password1234"
   */
  @IsNotEmpty()
  @MinLength(10)
  password: string;

  /**
   * Two factor authentication code
   * @example "123456"
   */
  @IsOptional()
  @IsNumberString()
  tfaCode?: string;
}
