import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('admin/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Endpoint: GET /admin/analytics/dashboard
   * Returns all aggregated data required for the senior official oversight portal.
   */
  @Get('dashboard')
  @ApiOperation({
    summary: 'Get nationwide traffic fine statistics (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the aggregated dashboard statistics.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User lacks Admin privileges.',
  })
  async getDashboardData() {
    return this.analyticsService.getDashboardStats();
  }
}
