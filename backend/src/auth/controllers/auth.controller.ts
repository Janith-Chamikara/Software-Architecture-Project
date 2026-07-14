import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local.auth.guard';
import { Public } from '../decorators/public.decorator';
import { SignInDto } from '../dto/sign-in.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created and tokens returned.',
  })
  @ApiResponse({ status: 409, description: 'Phone number already in use.' })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiOperation({ summary: 'Log in with phone number and password' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully authenticated, returns JWT tokens.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid phone number or password.',
  })
  async signIn(@Body() signInDto: SignInDto, @Request() req: any) {
    return await this.authService.signIn(req.user);
  }

  @Public()
  @Get('refresh')
  @ApiOperation({
    summary: 'Refresh access tokens using a valid refresh token cookie',
  })
  @ApiResponse({
    status: 200,
    description: 'New access and refresh tokens generated.',
  })
  @ApiResponse({
    status: 401,
    description: 'Missing or invalid refresh token.',
  })
  async refresh(@Request() req: any) {
    const refreshToken = this.authService.extractRefreshToken(req);
    return (
      refreshToken && (await this.authService.refreshAccessToken(refreshToken))
    );
  }
}
