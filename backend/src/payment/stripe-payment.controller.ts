import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StripePaymentService } from './stripe-payment.service';
import { CreatePaymentIntentDto, ConfirmPaymentDto } from './dto/stripe.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Stripe Payments')
@Controller('payment')
export class StripePaymentController {
  constructor(private readonly stripePaymentService: StripePaymentService) {}

  /**
   * Called by the web portal when the driver views the fine details.
   * Creates a Stripe PaymentIntent and returns the clientSecret required
   * to mount the Stripe card form on the frontend.
   */
  @Post('create-intent')
  @Public()
  @ApiOperation({ summary: 'Create a Stripe PaymentIntent for a fine (no auth required)' })
  @ApiResponse({ status: 201, description: 'Returns clientSecret and fine details.' })
  @ApiResponse({ status: 404, description: 'Fine not found.' })
  @ApiResponse({ status: 409, description: 'Fine already paid.' })
  async createPaymentIntent(@Body() dto: CreatePaymentIntentDto) {
    return this.stripePaymentService.createPaymentIntent(
      dto.fineReference,
      dto.categoryIdentifier,
    );
  }

  /**
   * Called by the web portal after stripe.confirmCardPayment() succeeds on the frontend.
   * Verifies the payment with Stripe, marks the fine as PAID, and triggers SMS to officer.
   */
  @Post('confirm')
  @Public()
  @ApiOperation({ summary: 'Confirm Stripe payment and update fine status (no auth required)' })
  @ApiResponse({ status: 201, description: 'Fine marked as PAID, officer notified.' })
  @ApiResponse({ status: 400, description: 'Payment not yet completed.' })
  @ApiResponse({ status: 404, description: 'Fine not found.' })
  async confirmPayment(@Body() dto: ConfirmPaymentDto) {
    return this.stripePaymentService.confirmPayment(
      dto.paymentIntentId,
      dto.fineReference,
    );
  }
}
