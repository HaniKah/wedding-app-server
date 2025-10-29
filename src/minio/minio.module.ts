import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ConfigModule } from '@nestjs/config';
import MinioConfig from './config/minio.config';

@Module({
  providers: [MinioService],
  imports: [ConfigModule.forFeature(MinioConfig)],
})
export class MinioModule {}
