import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFineDto } from './dto/create-fine.dto';
import { Fine } from 'generated/prisma/client';

@Injectable()
export class FineService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * For Officers: Issue a new traffic fine
   */
  async issueFine(
    officerId: string,
    createFineDto: CreateFineDto,
  ): Promise<Fine> {
    // Check if a fine with this reference number already exists to prevent duplicates
    const existingFine = await this.prismaService.fine.findUnique({
      where: { referenceNumber: createFineDto.referenceNumber },
    });

    if (existingFine) {
      throw new ConflictException(
        'A fine with this reference number already exists.',
      );
    }

    try {
      return await this.prismaService.fine.create({
        data: {
          ...createFineDto,
          officerId,
          status: 'PENDING',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to issue the fine.');
    }
  }

  /**
   * For Drivers: Look up a specific fine to check details before payment
   */
  async lookupFine(
    referenceNumber: string,
    categoryIdentifier: string,
  ): Promise<Fine> {
    const fine = await this.prismaService.fine.findFirst({
      where: {
        referenceNumber,
        categoryIdentifier,
      },
    });

    if (!fine) {
      throw new NotFoundException(
        'No fine found matching these details. Please check your ticket and try again.',
      );
    }

    return fine;
  }

  /**
   * For Admin/Officers: Get all fines issued by a specific officer
   */
  async getFinesByOfficer(officerId: string): Promise<Fine[]> {
    return this.prismaService.fine.findMany({
      where: { officerId },
      orderBy: { issuedAt: 'desc' },
    });
  }
}
