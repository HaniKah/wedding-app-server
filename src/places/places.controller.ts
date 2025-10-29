import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePlaceRequest } from '../types/places/places.dto';
import { PlacesService } from './places.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post('Create')
  @UseInterceptors(FileInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreatePlaceRequest,
  })
  public async createPlace(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: CreatePlaceRequest,
  ): Promise<void> {
    files.forEach((file) => {
      console.log(file.filename);
    });
  }
}
