import { Module } from '@nestjs/common';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { ChecklistRepositoryService } from './checklist.repository.service';

@Module({
  controllers: [ChecklistController],
  providers: [ChecklistService, ChecklistRepositoryService],
})
export class ChecklistModule {}
