import { Module } from '@nestjs/common';
import { AdminUsersController } from './admin-users.controller';
import { AdminPlacesController } from './admin-places.controller';
import { UsersModule } from '../users/users.module';
import { PlacesModule } from '../places/places.module';

@Module({
  imports: [UsersModule, PlacesModule],
  controllers: [AdminUsersController, AdminPlacesController],
})
export class AdminModule {}
