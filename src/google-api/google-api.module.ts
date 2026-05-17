import { Module } from '@nestjs/common';
import { GoogleApiService } from './google-api.service';
import { ConfigModule } from '@nestjs/config';
import { GoogleVisionApiService } from './google-vision-api.service';
import googleApiConfig from './config/google-api.config';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [GoogleApiService, GoogleVisionApiService],
  exports: [GoogleApiService, GoogleVisionApiService],
  imports: [ConfigModule.forFeature(googleApiConfig), HttpModule],
})
export class GoogleApiModule {}
