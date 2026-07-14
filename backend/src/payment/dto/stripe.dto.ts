import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty({ example: 'REF-2026-001', description: 'Fine reference number from the ticket' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly fineReference: string;

  @ApiProperty({ example: 'SPEEDING', description: 'Fine category identifier from the ticket' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly categoryIdentifier: string;
}

export class ConfirmPaymentDto {
  @ApiProperty({ example: 'pi_3ABC...', description: 'Stripe PaymentIntent ID returned after card confirmation' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly paymentIntentId: string;

  @ApiProperty({ example: 'REF-2026-001', description: 'Fine reference number to mark as PAID' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly fineReference: string;
}
