import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDashboardStats() {
    try {
      // 1. Calculate Total Nationwide Revenue
      const totalRevenue = await this.prismaService.payment.aggregate({
        _sum: { amountPaid: true },
      });

      // 2. Group revenue by District (Only counting PAID fines)
      const districtData = await this.prismaService.fine.groupBy({
        by: ['district'],
        where: { status: 'PAID' },
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } }, // Highest collecting districts first
      });

      // 3. Group revenue by Traffic Fine Category
      const categoryData = await this.prismaService.fine.groupBy({
        by: ['categoryIdentifier'],
        where: { status: 'PAID' },
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
      });

      // 4. Overall System Status (Total Fines Paid vs Pending)
      const statusOverview = await this.prismaService.fine.groupBy({
        by: ['status'],
        _count: { referenceNumber: true },
      });

      // Format and return a clean payload for the Admin Portal
      return {
        totalRevenue: totalRevenue._sum.amountPaid || 0,
        districtCollections: districtData.map((d) => ({
          district: d.district,
          totalAmount: d._sum.amount,
        })),
        categoryCollections: categoryData.map((c) => ({
          category: c.categoryIdentifier,
          totalAmount: c._sum.amount,
        })),
        overview: statusOverview.map((s) => ({
          status: s.status,
          count: s._count.referenceNumber,
        })),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to aggregate dashboard analytics.',
      );
    }
  }
}
