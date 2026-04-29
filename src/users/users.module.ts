import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PlannerModule } from '../planner/planner.module';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  imports: [PlannerModule],
  controllers: [UsersController],
})
export class UsersModule {}
