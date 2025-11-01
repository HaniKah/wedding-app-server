import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { PlacesRepositoryService } from './places.repository.service';
import { MinioModule } from '../minio/minio.module';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService, PlacesRepositoryService],
  imports: [MinioModule],
})
export class PlacesModule {}
