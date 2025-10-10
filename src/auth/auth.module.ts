import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [AuthController],
  imports: [ConfigModule.forRoot()],
  providers: [
    FirebaseService,
    FirebaseAuthGuard,
    // uncomment the following to apply Firebase auth globally to all routes
    // Routes can be made public using the @Public() decorator
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
  ],
  exports: [FirebaseService, FirebaseAuthGuard],
})
export class AuthModule {}
