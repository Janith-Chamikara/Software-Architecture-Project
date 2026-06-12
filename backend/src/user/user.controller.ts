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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './services/user.service';
import { Role } from 'generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user (Driver, Officer, or Admin)' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or missing data.',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all users' })
  @ApiQuery({
    name: 'role',
    enum: Role,
    required: false,
    description: 'Filter users by their specific role',
  })
  @ApiResponse({ status: 200, description: 'Returns an array of users.' })
  async getAllUsers(@Query('role') role?: Role) {
    return this.userService.getAllUsers(role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific user by their ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user object including their related data.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUserById(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user securely' })
  @ApiResponse({
    status: 200,
    description: 'The user was successfully deleted.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Cannot delete due to associated records.',
  })
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUserById(id);
  }
}
