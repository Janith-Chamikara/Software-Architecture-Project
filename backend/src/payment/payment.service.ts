import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationService } from 'src/notification/notification.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async processPayment(driverId: string, createPaymentDto: CreatePaymentDto) {
    try {
      // Execute an Interactive Transaction to ensure database atomicity
      const result = await this.prismaService.$transaction(async (prisma) => {
        // 1. Fetch the fine and include the officer's details (for the SMS)
        const fine = await prisma.fine.findUnique({
          where: { referenceNumber: createPaymentDto.fineReference },
          include: { officer: true },
        });

        // 2. Validate the fine's existence and status
        if (!fine) {
          throw new NotFoundException('Fine not found.');
        }
        if (fine.status === 'PAID') {
          throw new ConflictException('This fine has already been paid.');
        }
        if (Number(fine.amount) !== createPaymentDto.amountPaid) {
          throw new BadRequestException(
            'Payment amount does not match the fine amount.',
          );
        }

        // 3. Create the payment record
        const payment = await prisma.payment.create({
          data: {
            fineReference: createPaymentDto.fineReference,
            userId: driverId,
            amountPaid: createPaymentDto.amountPaid,
            paymentMethod: createPaymentDto.paymentMethod,
            transactionId: createPaymentDto.transactionId,
          },
        });

        // 4. Update the fine status to PAID
        await prisma.fine.update({
          where: { referenceNumber: createPaymentDto.fineReference },
          data: { status: 'PAID' },
        });

        return { payment, officerPhone: fine.officer.phoneNumber };
      });

      // 5. Trigger the SMS Notification (outside the transaction lock)
      await this.notificationService.sendPaymentConfirmationSms(
        result.officerPhone,
        createPaymentDto.fineReference,
      );

      return {
        message: 'Payment processed successfully',
        paymentId: result.payment.id,
      };
    } catch (error) {
      // Re-throw known HTTP exceptions so NestJS handles the status codes correctly
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while processing the payment.',
      );
    }
  }
}
