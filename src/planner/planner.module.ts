import { Module } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { PlannerController } from './planner.controller';
import { GoogleApiModule } from '../google-api/google-api.module';
import { PlaceDetailsRepositoryService } from './place-details.repository.service';
import { PlansRepositoryService } from './plans.repository.service';
import { PlacesRepositoryService } from './places.repository.service';

@Module({
  providers: [
    PlannerService,
    PlaceDetailsRepositoryService,
    PlansRepositoryService,
    PlacesRepositoryService,
  ],
  controllers: [PlannerController],
  exports: [PlannerService],
  imports: [GoogleApiModule],
})
export class PlannerModule {}
