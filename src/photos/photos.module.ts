import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { PhotosRepositoryService } from './photos.repository.service';
import { MinioModule } from '../minio/minio.module';
import { GoogleApiModule } from '../google-api/google-api.module';

@Module({
  providers: [PhotosService, PhotosRepositoryService],
  controllers: [PhotosController],
  imports: [MinioModule, GoogleApiModule],
  exports: [PhotosService],
})
export class PhotosModule {}
