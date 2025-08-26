import { Module } from '@nestjs/common';
import { GoogleApiService } from './google-api.service';

@Module({
  providers: [GoogleApiService]
})
export class GoogleApiModule {}
