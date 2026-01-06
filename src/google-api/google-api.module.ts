import { Module } from '@nestjs/common';
import { GoogleApiService } from './google-api.service';
import { ConfigModule } from '@nestjs/config';
import googleApiConfig from './config/google-api.config';

@Module({
  providers: [GoogleApiService],
  exports: [GoogleApiService],
  imports: [ConfigModule.forFeature(googleApiConfig)],
})
export class GoogleApiModule {}
