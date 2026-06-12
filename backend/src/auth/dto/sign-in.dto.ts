import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: '0712345678',
    description: 'The registered phone number of the user',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly phoneNumber: string;

  @ApiProperty({
    example: 'strongpassword123',
    description: 'The user password (minimum 8 characters)',
  })
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
