import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';
import sharp from 'sharp';
import { v4 } from 'uuid';
import { MinioService } from '../minio/minio.service';
import { VideosRepositoryService } from './videos.repository.service';
import { generateBlurhash } from '../common/blurhash.util';
import { VideosDto } from '../types/planner/videos.dto';
import {
  MAX_VIDEO_DURATION_MS,
  VideoBucketName,
} from '../types/videos/videos.dto';
import VideosConfig from './config/videos.config';
import type { ConfigType } from '@nestjs/config';

ffmpeg.setFfmpegPath(ffmpegPath as unknown as string);
ffmpeg.setFfprobePath(ffprobeStatic.path);

export interface VideoWithBlurhash {
  uri: string;
  posterUri: string | null;
  blurhash: string | null;
}

@Injectable()
export class VideosService {
  constructor(
    private readonly minioService: MinioService,
    private readonly videosRepositoryService: VideosRepositoryService,

    @Inject(VideosConfig.KEY)
    private readonly videosConfig: ConfigType<typeof VideosConfig>,
  ) {}

  public async setMain(placeId: number, videoId: number): Promise<void> {
    await this.videosRepositoryService.setMainVideo(placeId, videoId);
  }

  public async getVideoById(videoId: number): Promise<VideosDto> {
    const video = await this.videosRepositoryService.getVideoById(videoId);
    if (!video) {
      throw new NotFoundException(`Video with ID ${videoId} not found`);
    }
    return this.constructVideoDto(video);
  }

  public async getMainVideoOrFirstByPlaceId(
    placeId: number,
  ): Promise<VideoWithBlurhash | null> {
    const video = await this.videosRepositoryService.getMainVideo(placeId);
    if (!video) {
      return null;
    }
    const dto = this.constructVideoDto(video);
    return { uri: dto.uri, posterUri: dto.posterUri, blurhash: dto.blurhash };
  }

  public async getVideosByPlaceId(placeId: number): Promise<VideosDto[]> {
    const videos =
      await this.videosRepositoryService.getVideosByPlaceId(placeId);
    return videos.map((v) => this.constructVideoDto(v));
  }

  public async uploadFile(
    placeId: number,
    file: Express.Multer.File,
    bucketName: VideoBucketName,
  ): Promise<VideosDto> {
    // No content-moderation gate here: Google Vision SafeSearch only screens
    // still images, and a poster-frame-only check would be partial/misleading
    // (content later in the clip goes unchecked). Moderation is deferred until
    // Google's Video Intelligence API (full-clip analysis) is integrated as a
    // follow-up project — this is a deliberate v1 scope cut, not an oversight.
    const tempFilePath = file.path;
    let posterPath: string | null = null;

    try {
      const probe = await this.probe(tempFilePath).catch(() => {
        // ffprobe fails on anything it can't decode (corrupt upload, or a
        // file whose declared mimetype doesn't match its actual content —
        // FileTypeValidator's magic-number check can miss this for some
        // containers). Surface it as a clean rejection, not a raw 500.
        throw new UnprocessableEntityException(
          'Could not read video file — it may be corrupt or in an unsupported format',
        );
      });
      const durationMs = probe.durationSeconds
        ? Math.round(probe.durationSeconds * 1000)
        : null;

      if (durationMs !== null && durationMs > MAX_VIDEO_DURATION_MS) {
        throw new UnprocessableEntityException(
          `Video exceeds the maximum allowed duration of ${MAX_VIDEO_DURATION_MS / 1000}s`,
        );
      }

      posterPath = await this.extractPoster(
        tempFilePath,
        probe.durationSeconds,
      ).catch(() => {
        throw new UnprocessableEntityException(
          'Could not generate a preview frame for this video',
        );
      });

      const posterSharp = sharp(posterPath);
      const [blurhash, posterMeta] = await Promise.all([
        generateBlurhash(posterSharp),
        posterSharp.metadata(),
      ]);

      const ratio =
        probe.width && probe.height
          ? probe.width / probe.height
          : posterMeta.width && posterMeta.height
            ? posterMeta.width / posterMeta.height
            : null;

      const objectKey = await this.uploadOriginal(
        placeId,
        bucketName,
        tempFilePath,
        file.mimetype,
        file.size,
      );
      const posterObjectKey = await this.uploadPoster(
        placeId,
        bucketName,
        posterPath,
      );

      const created = await this.videosRepositoryService.createVideo({
        placeId,
        bucketName,
        mimeType: file.mimetype,
        fileSize: file.size,
        durationMs,
        objectKey,
        posterObjectKey,
        ratio,
        blurhash,
      });

      return this.constructVideoDto(created);
    } finally {
      await this.safeUnlink(tempFilePath);
      if (posterPath) {
        await this.safeUnlink(posterPath);
      }
    }
  }

  public async deleteVideo(videoId: number) {
    const video = await this.videosRepositoryService.getVideoById(videoId);
    if (!video) {
      return;
    }
    await this.minioService.minio.removeObject(
      video.bucketName,
      video.objectKey,
    );
    if (video.posterObjectKey) {
      await this.minioService.minio.removeObject(
        video.bucketName,
        video.posterObjectKey,
      );
    }
    await this.videosRepositoryService.deleteVideo(videoId);
  }

  private constructVideoDto(video: {
    id: number;
    bucketName: string;
    objectKey: string;
    posterObjectKey: string | null;
    ratio: number | null;
    blurhash: string | null;
    durationMs: number | null;
    main: boolean | null;
  }): VideosDto {
    const base = this.videosConfig.minioBaseUrl + video.bucketName + '/';
    return {
      id: video.id,
      uri: base + video.objectKey,
      posterUri: video.posterObjectKey ? base + video.posterObjectKey : null,
      ratio: video.ratio,
      blurhash: video.blurhash,
      durationMs: video.durationMs,
      isMain: !!video.main,
    };
  }

  private probe(filePath: string): Promise<{
    durationSeconds: number | null;
    width: number | null;
    height: number | null;
  }> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        const videoStream = data.streams.find((s) => s.codec_type === 'video');
        resolve({
          durationSeconds: data.format?.duration ?? null,
          width: videoStream?.width ?? null,
          height: videoStream?.height ?? null,
        });
      });
    });
  }

  private extractPoster(
    filePath: string,
    durationSeconds: number | null,
  ): Promise<string> {
    const timestamp = Math.min(1, (durationSeconds ?? 10) * 0.1);
    const outDir = os.tmpdir();
    const outName = `${v4()}.jpg`;

    return new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .on('end', () => resolve(path.join(outDir, outName)))
        .on('error', (err) => reject(err))
        .screenshots({
          timestamps: [timestamp],
          filename: outName,
          folder: outDir,
        });
    });
  }

  private async uploadOriginal(
    placeId: number,
    bucketName: string,
    tempFilePath: string,
    mimeType: string,
    fileSize: number,
  ): Promise<string> {
    const ext =
      mimeType === 'video/quicktime'
        ? 'mov'
        : mimeType === 'video/webm'
          ? 'webm'
          : 'mp4';
    const objectName = `${placeId}/video/original/${v4()}.${ext}`;

    await this.minioService.minio.putObject(
      bucketName,
      objectName,
      fs.createReadStream(tempFilePath),
      fileSize,
      { fileName: `${v4()}.${ext}`, contentType: mimeType },
    );
    return objectName;
  }

  private async uploadPoster(
    placeId: number,
    bucketName: string,
    posterPath: string,
  ): Promise<string> {
    const objectName = `${placeId}/video/poster/${v4()}.jpg`;
    const stat = await fs.promises.stat(posterPath);

    await this.minioService.minio.putObject(
      bucketName,
      objectName,
      fs.createReadStream(posterPath),
      stat.size,
      { contentType: 'image/jpeg' },
    );
    return objectName;
  }

  private async safeUnlink(filePath: string) {
    try {
      await fs.promises.unlink(filePath);
    } catch {
      // Already removed or never created — nothing to clean up.
    }
  }
}
