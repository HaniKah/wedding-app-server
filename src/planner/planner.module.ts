import { Module } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { PlannerController } from './planner.controller';
import { GoogleApiModule } from '../google-api/google-api.module';

@Module({
  providers: [PlannerService],
  controllers: [PlannerController],
  exports: [PlannerService],
  imports: [GoogleApiModule],
})
export class PlannerModule {}
