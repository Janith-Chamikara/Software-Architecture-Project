import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationService } from 'src/notification/notification.service';
import Stripe from 'stripe';

@Injectable()
export class StripePaymentService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private stripe: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not set in .env');
    }
    this.stripe = new Stripe(secretKey);
  }

  /**
   * Step 1: Look up the fine and create a Stripe PaymentIntent.
   * Returns the clientSecret the frontend needs to render the card form.
   *
   * Note on currency: Stripe requires amounts in the smallest currency unit (cents).
   * This system stores amounts in LKR. For demo/test mode we use USD and treat the
   * LKR amount directly as cents (e.g., LKR 3500 → $35.00 USD). In production you
   * would use a Stripe-supported local currency or convert properly.
   */
  async createPaymentIntent(fineReference: string, categoryIdentifier: string) {
    const fine = await this.prismaService.fine.findFirst({
      where: { referenceNumber: fineReference, categoryIdentifier },
    });

    if (!fine) {
      throw new NotFoundException(
        'No fine found matching these details. Please check your ticket.',
      );
    }
    if (fine.status === 'PAID') {
      throw new ConflictException('This fine has already been paid.');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(Number(fine.amount)), // LKR amount used as cents for demo
      currency: 'usd',
      metadata: { fineReference: fine.referenceNumber },
    });

    if (!paymentIntent.client_secret) {
      throw new InternalServerErrorException('Failed to create Stripe payment session.');
    }

    return {
      clientSecret: paymentIntent.client_secret,
      fine: {
        referenceNumber: fine.referenceNumber,
        categoryIdentifier: fine.categoryIdentifier,
        amount: Number(fine.amount),
        district: fine.district,
        status: fine.status,
        issuedAt: fine.issuedAt,
      },
    };
  }

  /**
   * Step 2: Verify with Stripe that the payment actually succeeded, then:
   *  - Mark the fine as PAID in the database
   *  - Send an SMS notification to the issuing officer
   */
  async confirmPayment(paymentIntentId: string, fineReference: string) {
    // Retrieve the PaymentIntent from Stripe to verify its status
    let paymentIntent: any;
    try {
      paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch {
      throw new BadRequestException('Invalid payment intent ID.');
    }

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException(
        `Payment not completed. Current status: ${paymentIntent.status}`,
      );
    }

    // Fetch the fine along with the officer's details (needed for the SMS)
    const fine = await this.prismaService.fine.findUnique({
      where: { referenceNumber: fineReference },
      include: { officer: true },
    });

    if (!fine) {
      throw new NotFoundException('Fine not found.');
    }

    // Guard against double-processing (e.g. user refreshes the success page)
    if (fine.status === 'PAID') {
      return { success: true, message: 'Fine was already recorded as paid.' };
    }

    // Mark the fine as PAID
    await this.prismaService.fine.update({
      where: { referenceNumber: fineReference },
      data: { status: 'PAID' },
    });

    // Notify the officer via SMS
    await this.notificationService.sendPaymentConfirmationSms(
      fine.officer.phoneNumber,
      fineReference,
    );

    return {
      success: true,
      message: 'Payment confirmed. The officer has been notified via SMS.',
    };
  }
}
