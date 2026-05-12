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
import {
  BucketName,
  DeletePhotoRequest,
  PhotoSize,
} from '../types/photos/photos.dto';
import { PhotosViewModel } from '../types/planner/photos.dto';
import { Public } from '../auth/decorators/public.decorator';

@Public()
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
    await this.photosService.uploadFiles(id, files, BucketName.Listings);
  }
  @Get(':id')
  public async getPhotos(@Param('id') id: number): Promise<PhotosViewModel> {
    const photos = await this.photosService.getPhotosByPlaceId(
      Number(id),
      PhotoSize.Thumbnail,
    );
    return {
      result: photos,
    };
  }

  @Post('delete')
  public async deletePhoto(@Body() req: DeletePhotoRequest): Promise<void> {
    await this.photosService.deletePhoto(req.id);
  }
}
