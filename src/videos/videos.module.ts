import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { VideosRepositoryService } from './videos.repository.service';
import { MinioModule } from '../minio/minio.module';
import { ConfigModule } from '@nestjs/config';
import VideosConfig from './config/videos.config';

@Module({
  providers: [VideosService, VideosRepositoryService],
  controllers: [VideosController],
  imports: [MinioModule, ConfigModule.forFeature(VideosConfig)],
  exports: [VideosService],
})
export class VideosModule {}
