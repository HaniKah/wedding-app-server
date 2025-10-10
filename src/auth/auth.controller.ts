import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { FirebaseUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { FirebaseService } from './firebase.service';
import { FirebaseUserDto, SyncUserDto } from '../types/auth/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly firebaseService: FirebaseService) {}

  /**
   * Public endpoint - health check
   */
  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint (public)' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Firebase Auth',
    };
  }

  /**
   * Get current user profile
   * Requires Firebase authentication
   */
  @UseGuards(FirebaseAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully', type: FirebaseUserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@CurrentUser() user: FirebaseUser): FirebaseUser {
    return user;
  }

  /**
   * Sync Firebase user with local database
   * This endpoint should be called after Firebase authentication on the client
   */
  @UseGuards(FirebaseAuthGuard)
  @Post('sync')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync Firebase user with local database' })
  @ApiResponse({ status: 200, description: 'User synced successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async syncUser(
    @CurrentUser() user: FirebaseUser,
    @Body() syncData: SyncUserDto,
  ) {
    // TODO: Implement logic to sync user with your PostgreSQL database
    // This is where you would create or update the user record in your database
    return {
      message: 'User synced successfully',
      user: {
        uid: user.uid,
        email: user.email,
        phoneNumber: user.phoneNumber,
        ...syncData,
      },
    };
  }

  /**
   * Get user by UID (admin only)
   */
  @UseGuards(FirebaseAuthGuard)
  @Get('user/:uid')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by Firebase UID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserByUid(@CurrentUser() user: FirebaseUser) {
    // TODO: Add role-based authorization (admin only)
    const userRecord = await this.firebaseService.getUserByUid(user.uid);
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      phoneNumber: userRecord.phoneNumber,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      disabled: userRecord.disabled,
      metadata: userRecord.metadata,
    };
  }
}