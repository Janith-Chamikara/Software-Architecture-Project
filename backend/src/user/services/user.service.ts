import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { Prisma, Role, User } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create a new user (Driver, Officer, or Admin)
   */
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.prismaService.user.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  /**
   * Retrieve a single user by ID
   * Includes dynamic relation loading based on their role
   */
  async getUserById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        // Only include payments if they are a driver, or issued fines if they are an officer
        payments: true,
        issuedFines: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User with the provided ID does not exist');
    }

    return user;
  }

  /**
   * Retrieve all users, optionally filtered by Role
   */
  async getAllUsers(role?: Role): Promise<User[]> {
    return this.prismaService.user.findMany({
      where: role ? { role } : undefined,
    });
  }

  /**
   * Update existing user information
   */
  async updateUserById(
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    // Verify user exists first
    await this.getUserById(id);

    try {
      return await this.prismaService.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error occurred while updating user',
      );
    }
  }

  /**
   * Delete a user securely
   * Handles relation constraints (Fines and Payments)
   */
  async deleteUserById(id: string): Promise<User> {
    try {
      return await this.prismaService.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
