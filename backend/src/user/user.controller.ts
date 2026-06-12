import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { Prisma, Role } from 'generated/prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Endpoint: POST /users
   * Creates a new user (Driver, Officer, or Admin)
   */
  @Post()
  async createUser(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.userService.createUser(createUserDto);
  }

  /**
   * Endpoint: GET /users
   * Optional Query: /users?role=DRIVER
   * Retrieves all users, with an optional filter for specific roles
   */
  @Get()
  async getAllUsers(@Query('role') role?: Role) {
    return this.userService.getAllUsers(role);
  }

  /**
   * Endpoint: GET /users/:id
   * Retrieves a specific user and their relation data (Fines/Payments) based on role
   */
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  /**
   * Endpoint: PATCH /users/:id
   * Updates an existing user's information
   */
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.userService.updateUserById(id, updateUserDto);
  }

  /**
   * Endpoint: DELETE /users/:id
   * Securely deletes a user, enforcing referential integrity (e.g., checking for issued fines)
   */
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUserById(id);
  }
}
