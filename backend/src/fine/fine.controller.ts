import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { FineService } from './fine.service';
import { CreateFineDto } from './dto/create-fine.dto';

@ApiTags('Fines')
@Controller('fines')
export class FineController {
  constructor(private readonly fineService: FineService) {}

  /**
   * Endpoint: POST /fines
   * Used by the officer to log a new ticket.
   */
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Issue a new traffic fine (Officer only)' })
  @ApiResponse({
    status: 201,
    description: 'The fine was successfully issued.',
  })
  @ApiResponse({
    status: 409,
    description: 'A fine with this reference number already exists.',
  })
  async issueFine(@Body() createFineDto: CreateFineDto, @Request() req: any) {
    // Assuming the JWT payload attaches the user ID to req.user.id
    const officerId = req.user.id;
    return this.fineService.issueFine(officerId, createFineDto);
  }

  /**
   * Endpoint: GET /fines/lookup?ref=123&cat=SPEEDING
   * Used by the Driver's mobile app or web portal to fetch fine details.
   */
  @Get('lookup')
  @ApiOperation({ summary: 'Look up fine details before payment' })
  @ApiQuery({
    name: 'ref',
    description: 'The unique fine reference number',
    example: 'REF-2026-001',
  })
  @ApiQuery({
    name: 'cat',
    description: 'The traffic violation category identifier',
    example: 'SPEEDING',
  })
  @ApiResponse({ status: 200, description: 'Returns the details of the fine.' })
  @ApiResponse({
    status: 404,
    description: 'No fine found matching these details.',
  })
  async lookupFine(
    @Query('ref') referenceNumber: string,
    @Query('cat') categoryIdentifier: string,
  ) {
    return this.fineService.lookupFine(referenceNumber, categoryIdentifier);
  }

  /**
   * Endpoint: GET /fines/officer/:id
   * Fetch history of fines issued by a specific officer.
   */
  @Get('officer/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all fines issued by a specific officer' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of fines issued by the officer.',
  })
  async getOfficerFines(@Param('id') officerId: string) {
    return this.fineService.getFinesByOfficer(officerId);
  }
}
