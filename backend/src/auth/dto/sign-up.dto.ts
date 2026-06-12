import {
  IsDefined,
  IsNotEmpty,
  MinLength,
  IsString,
  IsEnum,
} from 'class-validator';
import { Role } from 'generated/prisma/enums';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  readonly fullName: string;

  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsEnum(Role)
  @IsDefined()
  readonly role: Role;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
