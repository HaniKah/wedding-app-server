import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { PhotosService } from './photos.service';
import {
  BucketName,
  DeletePhotoRequest,
  PhotoSize,
} from '../types/photos/photos.dto';
import { PhotosDto, PhotosViewModel } from '../types/planner/photos.dto';
import { Public } from '../auth/decorators/public.decorator';

@Public()
@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: 'multipart/form-data' })
  @Post('upload/:placeId')
  public async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('placeId') id: number,
  ): Promise<PhotosDto> {
    return await this.photosService.uploadFile(id, file, BucketName.Listings);
  }

  @Get('getAll/:placeId/:photoSize')
  public async getAllPhotos(
    @Param('placeId') id: number,
    @Param('photoSize') photoSize: PhotoSize,
  ): Promise<PhotosViewModel> {
    const photos = await this.photosService.getPhotosByPlaceId(id, photoSize);
    return {
      result: photos,
    };
  }

  @Get('getPhoto/:id')
  public async getPhoto(@Param('id') id: number): Promise<PhotosDto> {
    return await this.photosService.getPhotoById(
      BucketName.Listings,
      id,
      PhotoSize.Image,
    );
  }

  @Post('delete')
  public async deletePhoto(@Body() req: DeletePhotoRequest): Promise<void> {
    await this.photosService.deletePhoto(req.id);
  }

  @Post('toggleMain/:placeId/:photoId')
  public async setMain(
    @Param('photoId') photoId: number,
    @Param('placeId') placeId: number,
  ): Promise<void> {
    await this.photosService.setMain(placeId, photoId);
  }
}
