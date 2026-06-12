import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from '../dto/sign-up.dto';
import {
  fifteenMinutesFromNow,
  getHashedPassword,
  thirtyDaysFromNow,
  threeHourFromNow,
  comparePassword,
} from 'src/utils/utils';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role, User } from 'generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { password, phoneNumber, fullName, role } = signUpDto;
    const hashedPassword = await getHashedPassword(password);

    if (!hashedPassword) {
      throw new BadRequestException('Cannot hash the given password');
    }

    const isUserExists = await this.prismaService.user.findUnique({
      where: { phoneNumber },
    });

    if (isUserExists) {
      throw new ConflictException(
        'The phone number provided is already in use. Try again with another number.',
      );
    }

    const user = await this.prismaService.user.create({
      data: {
        fullName,
        phoneNumber,
        role,
        passwordHash: hashedPassword,
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Error occurred while creating your account. Try again later.',
      );
    }

    return this.signIn(user);
  }

  async signIn(user: Omit<User, 'passwordHash'>) {
    const payload = { ...user };
    return {
      message: 'Success!',
      user: payload,
      accessToken: this.generateAccessToken(payload),
      accessTokenExpiresIn: fifteenMinutesFromNow(),
      refreshToken: this.generateRefreshToken(payload),
      refreshTokenExpiresIn: thirtyDaysFromNow(),
    };
  }

  async validateUser(phoneNumber: string, password: string): Promise<any> {
    const isUserExists = await this.prismaService.user.findUnique({
      where: { phoneNumber },
    });

    if (!isUserExists) {
      throw new BadRequestException('Invalid phone number.');
    }

    const isPasswordCorrect = await comparePassword(
      password,
      isUserExists.passwordHash,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid password');
    }

    const { passwordHash, ...result } = isUserExists;
    return result;
  }

  generateRefreshToken(payload: Omit<User, 'passwordHash'>) {
    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
      expiresIn: thirtyDaysFromNow(),
    });
  }

  generateAccessToken(payload: Omit<User, 'passwordHash'>) {
    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
      expiresIn:
        payload.role === Role.ADMIN
          ? threeHourFromNow()
          : fifteenMinutesFromNow(),
    });
  }

  async refreshAccessToken(refreshToken: string) {
    const decoded = this.jwtService.verify(refreshToken, {
      secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
    });

    const user = await this.prismaService.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { passwordHash, ...payload } = user;

    return {
      accessToken: this.generateAccessToken(payload),
      accessTokenExpiresIn: fifteenMinutesFromNow(),
      refreshToken: this.generateRefreshToken(payload),
      refreshTokenExpiresIn: thirtyDaysFromNow(),
    };
  }

  extractRefreshToken(req: Request): string | null {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      throw new UnauthorizedException('No cookies were found');
    }

    const cookies = this.parseCookies(cookieHeader);
    const refreshToken = cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    return refreshToken;
  }

  private parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach((cookie) => {
      const [name, ...rest] = cookie.split('=');
      const value = decodeURIComponent(rest.join('=')).trim();
      if (value !== 'undefined') {
        cookies[name.trim()] = value;
      }
    });
    return cookies;
  }
}
