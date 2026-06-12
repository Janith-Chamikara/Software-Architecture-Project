import { IsDefined, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class SignInDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly phoneNumber: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
