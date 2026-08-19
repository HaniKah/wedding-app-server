import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Role } from '../auth/auth.dto';

export class AdminCreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @ApiProperty({ enum: Role, enumName: 'Role', required: false })
  role?: Role;
}

export class AdminUserDto {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  @ApiProperty({ enum: Role, enumName: 'Role' })
  role: Role;
  googleId: string | null;
  appleId: string | null;
  emailVerified: boolean;
  createdAt: Date | null;
}
