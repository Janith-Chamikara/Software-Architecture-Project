import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripePaymentController } from './stripe-payment.controller';
import { StripePaymentService } from './stripe-payment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [PaymentController, StripePaymentController],
  providers: [PaymentService, StripePaymentService, PrismaService],
})
export class PaymentModule {}
