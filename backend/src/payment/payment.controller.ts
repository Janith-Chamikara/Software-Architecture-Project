import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Endpoint: POST /payments
   * Processes a transaction and alerts the officer.
   */
  @Post()
  @ApiOperation({ summary: 'Process a traffic fine payment (Driver only)' })
  @ApiResponse({
    status: 201,
    description:
      'The payment was successfully processed and SMS notification sent.',
  })
  @ApiResponse({
    status: 400,
    description: 'Payment amount does not match the fine amount.',
  })
  @ApiResponse({ status: 404, description: 'Fine not found.' })
  @ApiResponse({ status: 409, description: 'This fine has already been paid.' })
  async makePayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @Request() req: any,
  ) {
    // Extract the driver's ID from the JWT payload
    const driverId = req.user.id;
    return this.paymentService.processPayment(driverId, createPaymentDto);
  }
}
