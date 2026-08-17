import { Module } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { PlannerController } from './planner.controller';
import { GoogleApiModule } from '../google-api/google-api.module';
import { PlansRepositoryService } from './plans.repository.service';
import { PlannerRepositoryService } from './planner.repository.service';
import { PhotosModule } from '../photos/photos.module';
import { VideosModule } from '../videos/videos.module';

@Module({
  providers: [PlannerService, PlansRepositoryService, PlannerRepositoryService],
  controllers: [PlannerController],
  exports: [PlannerService, PlansRepositoryService],
  imports: [GoogleApiModule, PhotosModule, VideosModule],
})
export class PlannerModule {}
