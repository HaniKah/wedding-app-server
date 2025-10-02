import { Module } from '@nestjs/common';
import { GuestsController } from './guests.controller';
import { GuestsService } from './guests.service';
import { GuestsRepositoryService } from './guests.repository.service';

@Module({
  controllers: [GuestsController],
  providers: [GuestsService, GuestsRepositoryService],
})
export class GuestsModule {}
