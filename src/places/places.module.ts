import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { GoogleApiModule } from '../google-api/google-api.module';

@Module({
  providers: [PlacesService],
  controllers: [PlacesController],
  exports: [PlacesService],
  imports: [GoogleApiModule],
})
export class PlacesModule {}
