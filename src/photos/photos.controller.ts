import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { PhotosService } from './photos.service';
import { BucketName, PhotoSize } from '../types/photos/photos.dto';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}
  @UseInterceptors(FilesInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: 'multipart/form-data' })
  @Post('upload')
  public async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() placeId: { placeId: string },
  ): Promise<void> {
    const id = parseInt(placeId.placeId);
    await this.photosService.uploadFiles(id, files, BucketName.Places, [
      PhotoSize.Small,
      PhotoSize.Large,
    ]);
  }
  @Get(':id')
  public async getPhotos(@Param('id') id: string): Promise<string[]> {
    return await this.photosService.getPhotosByPlaceId(
      Number(id),
      PhotoSize.Small,
    );
  }
}
