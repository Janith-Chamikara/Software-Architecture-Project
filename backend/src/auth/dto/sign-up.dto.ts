import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  MinLength,
  IsString,
  IsEnum,
} from 'class-validator';
import { Role } from 'generated/prisma/enums';

export class SignUpDto {
  @ApiProperty({
    example: 'Janith Chamikara',
    description: 'The full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  readonly fullName: string;

  @ApiProperty({
    example: '0712345678',
    description: 'A unique phone number for the account',
  })
  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;

  @ApiProperty({
    enum: Role,
    example: Role.DRIVER,
    description: 'The system role of the user (DRIVER, OFFICER, or ADMIN)',
  })
  @IsEnum(Role)
  @IsDefined()
  readonly role: Role;

  @ApiProperty({
    example: 'strongpassword123',
    description: 'Password must be at least 8 characters long',
  })
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
