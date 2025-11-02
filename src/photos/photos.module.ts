import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { PhotosRepositoryService } from './photos.repository.service';
import { MinioModule } from '../minio/minio.module';

@Module({
  providers: [PhotosService, PhotosRepositoryService],
  controllers: [PhotosController],
  imports: [MinioModule],
})
export class PhotosModule {}
