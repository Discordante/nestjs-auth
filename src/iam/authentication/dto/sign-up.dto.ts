import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpDto {
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
}
