import { Module } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { PlannerController } from './planner.controller';
import { GoogleApiModule } from '../google-api/google-api.module';
import { PlaceFilterRepositoryService } from './placeFilter.repository.service';
import { PlansRepositoryService } from './plans.repository.service';
import { PlannerRepositoryService } from './planner.repository.service';
import { PhotosModule } from '../photos/photos.module';

@Module({
  providers: [
    PlannerService,
    PlaceFilterRepositoryService,
    PlansRepositoryService,
    PlannerRepositoryService,
  ],
  controllers: [PlannerController],
  exports: [PlannerService, PlansRepositoryService],
  imports: [GoogleApiModule, PhotosModule],
})
export class PlannerModule {}
