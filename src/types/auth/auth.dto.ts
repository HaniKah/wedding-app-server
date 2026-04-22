import { IsEmail, IsEnum, IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
export enum Role {
  Admin = 'Admin',
  User = 'User',
  Guest = 'Guest',
}
export type AuthJwtPayload = {
  sub: number;
  role: Role;
};
export class CurrentUser {
  id: number;
  role: Role;
}

export enum Provider {
  Google = 'Google',
  Apple = 'Apple',
  Facebook = 'Facebook',
}

export class SignUpDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  role: Role;
}
