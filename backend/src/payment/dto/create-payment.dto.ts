import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    example: 'REF-2026-001',
    description: 'The unique reference number of the fine to be paid',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly fineReference: string;

  @ApiProperty({
    example: 3500.0,
    description: 'The exact amount paid by the driver',
  })
  @IsDefined()
  @IsNumber()
  @IsPositive()
  readonly amountPaid: number;

  @ApiProperty({
    example: 'VISA',
    description: 'The payment method used (e.g., VISA, MASTERCARD)',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly paymentMethod: string;

  @ApiProperty({
    example: 'txn_1N9bQ...',
    description: 'The receipt ID or token from your external Payment Gateway',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly transactionId: string;
}
