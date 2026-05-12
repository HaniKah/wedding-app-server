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
  @Post('upload')
  public async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() placeId: { placeId: string },
  ): Promise<PhotosDto> {
    const id = parseInt(placeId.placeId);
    return await this.photosService.uploadFile(id, file, BucketName.Listings);
  }
  @Get('getAll/:id')
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
