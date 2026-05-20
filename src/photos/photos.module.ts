import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { PhotosRepositoryService } from './photos.repository.service';
import { MinioModule } from '../minio/minio.module';
import { GoogleApiModule } from '../google-api/google-api.module';
import { ConfigModule } from '@nestjs/config';
import PhotosConfig from './config/photos.config';

@Module({
  providers: [PhotosService, PhotosRepositoryService],
  controllers: [PhotosController],
  imports: [
    MinioModule,
    GoogleApiModule,
    ConfigModule.forFeature(PhotosConfig),
  ],
  exports: [PhotosService],
})
export class PhotosModule {}
