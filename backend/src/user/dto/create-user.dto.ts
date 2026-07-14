import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, MinLength } from 'class-validator';
import { Role } from 'generated/prisma/client';

export class CreateUserDto {
  @ApiProperty({
    example: 'Nimal Perera',
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
    example: Role.OFFICER,
    description: 'The system role (DRIVER, OFFICER, or ADMIN)',
  })
  @IsEnum(Role)
  readonly role: Role;

  @ApiProperty({
    example: 'hashed_password_string',
    description: 'The hashed password for the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  readonly passwordHash: string;
}
