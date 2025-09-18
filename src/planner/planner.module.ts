import { Module } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { PlannerController } from './planner.controller';
import { GoogleApiModule } from '../google-api/google-api.module';
import { PlannerRepositoryService } from './planner.repository.service';

@Module({
  providers: [PlannerService, PlannerRepositoryService],
  controllers: [PlannerController],
  exports: [PlannerService],
  imports: [GoogleApiModule],
})
export class PlannerModule {}
