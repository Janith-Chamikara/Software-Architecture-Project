import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateFineDto {
  @ApiProperty({
    example: 'REF-2026-001',
    description: 'The unique reference number from the physical fine ticket',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly referenceNumber: string;

  @ApiProperty({
    example: 'SPEEDING',
    description: 'The category code of the traffic violation',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly categoryIdentifier: string;

  @ApiProperty({
    example: 3500.0,
    description: 'The exact fine amount to be paid',
  })
  @IsDefined()
  @IsNumber()
  @IsPositive()
  readonly amount: number;

  @ApiProperty({
    example: 'Colombo',
    description: 'The district where the fine was issued',
  })
  @IsString()
  @IsNotEmpty()
  readonly district: string;

  @ApiPropertyOptional({
    example: '199812345678',
    description:
      'The National Identity Card (NIC) number of the driver (optional)',
  })
  @IsString()
  @IsOptional()
  readonly driverNic?: string;
}
