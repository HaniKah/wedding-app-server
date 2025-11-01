import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePlaceDto, CreatePlaceRequest } from '../types/places/places.dto';
import { PlacesService } from './places.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import type { Request } from 'express';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post('create')
  public async createPlace(
    @Req() req: Request,
    @Body() body: CreatePlaceRequest,
  ): Promise<CreatePlaceDto> {
    return await this.placesService.createPlace(req.user.id, body);
  }

  @UseInterceptors(FilesInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: 'multipart/form-data' })
  @Post('upload')
  public async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() placeId: { placeId: string },
  ): Promise<void> {
    const id = parseInt(placeId.placeId);
    await this.placesService.uploadFiles(id, files);
  }

  @Public()
  @Get('test')
  test() {
    const form = new FormData();
    form.append('name', 'hani');
    form.append('age', '20');
    form.append('file', new Blob(['hello world']));
    console.log(form);
    return form;
  }
}
