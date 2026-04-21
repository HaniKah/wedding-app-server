import { Module } from '@nestjs/common';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { ChecklistRepositoryServiceTsService } from './checklist.repository.service.ts/checklist.repository.service.ts.service';
import { RespositoryServiceService } from './respository.service/respository.service.service';

@Module({
  controllers: [ChecklistController],
  providers: [ChecklistService, ChecklistRepositoryServiceTsService, RespositoryServiceService]
})
export class ChecklistModule {}
