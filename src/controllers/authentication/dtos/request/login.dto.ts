import {
  IsAlphanumeric,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @MaxLength(50)
  @MinLength(1)
  @IsAlphanumeric()
  userName: string;

  @IsStrongPassword({
    minLength: 10,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
