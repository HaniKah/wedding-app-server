import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PlannerModule } from '../planner/planner.module';
import { UsersController } from './users.controller';
import { PhotosModule } from '../photos/photos.module';

@Module({
  providers: [UsersService],
  imports: [PlannerModule, PhotosModule],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
