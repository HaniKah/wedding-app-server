import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlacesModule } from './places/places.module';
import { GoogleApiModule } from './google-api/google-api.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PlacesModule, GoogleApiModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
