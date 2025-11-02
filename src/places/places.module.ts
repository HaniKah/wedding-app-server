import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { PlacesRepositoryService } from './places.repository.service';
import { PhotosModule } from '../photos/photos.module';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService, PlacesRepositoryService],
  imports: [PhotosModule],
})
export class PlacesModule {}
