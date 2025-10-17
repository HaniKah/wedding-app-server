import { IsEmail, IsString } from 'class-validator';
import { Role } from '../auth/auth.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: Role, enumName: 'Role' })
  role: Role;

  @IsString()
  password: string;
}
