import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../types/auth/auth.dto';
import { AdminCreateUserDto, AdminUserDto } from '../types/admin/admin.dto';

@Roles(Role.Admin)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async listUsers(): Promise<AdminUserDto[]> {
    return await this.usersService.findAllUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<AdminUserDto> {
    const user = await this.usersService.findAdminUserById(Number(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post()
  async createUser(@Body() body: AdminCreateUserDto) {
    const existing = await this.usersService.findUserByEmail(
      body.email.toLowerCase(),
    );
    if (existing) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await argon2.hash(body.password);
    return await this.usersService.createUser({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email.toLowerCase(),
      password: hashedPassword,
      role: body.role ?? Role.User,
      emailVerified: true,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(Number(id));
  }
}
