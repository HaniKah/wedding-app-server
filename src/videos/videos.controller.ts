import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as os from 'os';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { VideosService } from './videos.service';
import { VideosDto, VideosViewModel } from '../types/planner/videos.dto';
import {
  ALLOWED_VIDEO_MIME_TYPES,
  DeleteVideoRequest,
  MAX_VIDEO_FILE_SIZE_BYTES,
  VideoBucketName,
} from '../types/videos/videos.dto';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  // Upload requires auth (global JWT guard applies — no @Public() here),
  // unlike the read endpoints below, since video storage/bandwidth cost is
  // meaningfully higher than photos.
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({ destination: os.tmpdir() }),
      limits: { fileSize: MAX_VIDEO_FILE_SIZE_BYTES },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: 'multipart/form-data' })
  @Post('upload/:placeId')
  public async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_VIDEO_FILE_SIZE_BYTES }),
          new FileTypeValidator({
            fileType: new RegExp(
              `^(${ALLOWED_VIDEO_MIME_TYPES.join('|').replace(/\//g, '\\/')})$`,
            ),
            fallbackToMimetype: true,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('placeId') id: number,
  ): Promise<VideosDto> {
    return await this.videosService.uploadFile(
      id,
      file,
      VideoBucketName.Listings,
    );
  }

  @Public()
  @Get('getAll/:placeId')
  public async getAllVideos(
    @Param('placeId') id: number,
  ): Promise<VideosViewModel> {
    const videos = await this.videosService.getVideosByPlaceId(id);
    return {
      result: videos,
    };
  }

  @Public()
  @Get('getVideo/:id')
  public async getVideo(@Param('id') id: number): Promise<VideosDto> {
    return await this.videosService.getVideoById(id);
  }

  @Post('delete')
  public async deleteVideo(@Body() req: DeleteVideoRequest): Promise<void> {
    await this.videosService.deleteVideo(req.id);
  }

  @Post('toggleMain/:placeId/:videoId')
  public async setMain(
    @Param('videoId') videoId: number,
    @Param('placeId') placeId: number,
  ): Promise<void> {
    await this.videosService.setMain(placeId, videoId);
  }
}
