import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { PhotosRepositoryService } from './photos.repository.service';

@Module({
  providers: [PhotosService, PhotosRepositoryService],
  controllers: [PhotosController],
})
export class PhotosModule {}
