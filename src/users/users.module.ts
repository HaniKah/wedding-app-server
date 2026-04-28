import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PlannerModule } from '../planner/planner.module';

@Module({
  providers: [UsersService],
  imports: [PlannerModule],
})
export class UsersModule {}
