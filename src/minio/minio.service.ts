import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'minio';
import type { ConfigType } from '@nestjs/config';
import MinioConfig from './config/minio.config';

@Injectable()
export class MinioService {
  public readonly minio: Client;
  constructor(
    @Inject(MinioConfig.KEY)
    private readonly minioConfig: ConfigType<typeof MinioConfig>,
  ) {
    this.minio = new Client({
      endPoint: minioConfig.endPoint,
      port: minioConfig.port,
      useSSL: minioConfig.useSSL,
      accessKey: minioConfig.accessKey,
      secretKey: minioConfig.secretKey,
    });
  }
}
