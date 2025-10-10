import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
}

export class SignInDto {
  email: string;
  password: string;
}

export enum Role {
  Admin = 'Admin',
  User = 'User',
  Guest = 'Guest',
}

/**
 * DTO for Firebase authenticated user information
 */
export class FirebaseUserDto {
  @ApiProperty({ description: 'Firebase user ID' })
  uid: string;

  @ApiProperty({ description: 'User email', required: false })
  email?: string;

  @ApiProperty({ description: 'User phone number', required: false })
  phoneNumber?: string;

  @ApiProperty({ description: 'User display name', required: false })
  name?: string;

  @ApiProperty({ description: 'User profile picture URL', required: false })
  picture?: string;

  @ApiProperty({ description: 'Email verification status', required: false })
  emailVerified?: boolean;

  @ApiProperty({ description: 'User role in the system', enum: Role })
  role?: Role;
}

/**
 * DTO for syncing Firebase user with local database
 */
export class SyncUserDto {
  @ApiProperty({ description: 'Firebase user ID' })
  firebaseUid: string;

  @ApiProperty({ description: 'User email', required: false })
  email?: string;

  @ApiProperty({ description: 'User phone number', required: false })
  phoneNumber?: string;

  @ApiProperty({ description: 'User display name', required: false })
  displayName?: string;

  @ApiProperty({ description: 'User profile picture URL', required: false })
  photoUrl?: string;

  @ApiProperty({ description: 'User role', enum: Role, default: Role.User })
  role: Role;
}
