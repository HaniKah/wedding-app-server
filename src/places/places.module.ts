import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { PlacesRepositoryService } from './places.repository.service';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService, PlacesRepositoryService],
})
export class PlacesModule {}
