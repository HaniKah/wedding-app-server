import { Test, TestingModule } from '@nestjs/testing';
import { UnprocessableEntityException } from '@nestjs/common';
import { VideosService } from './videos.service';
import { MinioService } from '../minio/minio.service';
import { VideosRepositoryService } from './videos.repository.service';
import VideosConfig from './config/videos.config';
import { VideoBucketName } from '../types/videos/videos.dto';

let ffprobeImpl: (
  path: string,
  cb: (err: Error | null, data?: unknown) => void,
) => void = (_path, cb) =>
  cb(null, {
    format: { duration: 10 },
    streams: [{ codec_type: 'video', width: 640, height: 480 }],
  });

interface MockFfmpegChain {
  on: (event: string, cb: (err?: Error) => void) => MockFfmpegChain;
  screenshots: (opts: unknown) => MockFfmpegChain;
  end: () => void;
  error: (err: Error) => void;
}

let screenshotsImpl: (chain: MockFfmpegChain) => void = (chain) => chain.end();

jest.mock('fluent-ffmpeg', () => {
  const fn = jest.fn(() => {
    const handlers: Record<string, (err?: Error) => void> = {};
    const chain: MockFfmpegChain = {
      on: (event, cb) => {
        handlers[event] = cb;
        return chain;
      },
      screenshots: () => {
        screenshotsImpl(chain);
        return chain;
      },
      end: () => handlers['end']?.(),
      error: (err) => handlers['error']?.(err),
    };
    return chain;
  });
  (fn as unknown as { ffprobe: unknown }).ffprobe = jest.fn(
    (path: string, cb: (err: Error | null, data?: unknown) => void) =>
      ffprobeImpl(path, cb),
  );
  (fn as unknown as { setFfmpegPath: unknown }).setFfmpegPath = jest.fn();
  (fn as unknown as { setFfprobePath: unknown }).setFfprobePath = jest.fn();
  return { __esModule: true, default: fn };
});

jest.mock('ffmpeg-static', () => ({
  __esModule: true,
  default: '/mock/ffmpeg',
}));
jest.mock('ffprobe-static', () => ({
  __esModule: true,
  default: { path: '/mock/ffprobe' },
}));

jest.mock('sharp', () => {
  const mSharp: Record<string, jest.Mock> = {
    resize: jest.fn(),
    webp: jest.fn(),
    clone: jest.fn(),
    raw: jest.fn(),
    ensureAlpha: jest.fn(),
    toBuffer: jest.fn((opts?: { resolveWithObject?: boolean }) => {
      if (opts?.resolveWithObject) {
        return Promise.resolve({
          data: Buffer.from('mockPoster'),
          info: { width: 800, height: 450 },
        });
      }
      return Promise.resolve(Buffer.from('mockPoster'));
    }),
  };
  for (const key of ['resize', 'webp', 'clone', 'raw', 'ensureAlpha']) {
    mSharp[key].mockReturnValue(mSharp);
  }
  return jest.fn(() => mSharp);
});

jest.mock('blurhash', () => ({
  encode: jest.fn().mockReturnValue('mockBlurhash'),
}));
jest.mock('uuid', () => ({ v4: jest.fn().mockReturnValue('mockUuid') }));

jest.mock('fs', () => {
  const actual = jest.requireActual<typeof import('fs')>('fs');
  return {
    ...actual,
    createReadStream: jest.fn().mockReturnValue('mockStream'),
    promises: {
      ...actual.promises,
      unlink: jest.fn().mockResolvedValue(undefined),
    },
  };
});

import * as fs from 'fs';

describe('VideosService', () => {
  let videosService: VideosService;

  const mockMinioService = {
    minio: {
      putObject: jest.fn(),
      removeObject: jest.fn(),
    },
  };

  const mockRepositoryService = {
    createVideo: jest.fn(),
    getVideoById: jest.fn(),
    getVideosByPlaceId: jest.fn(),
    getMainVideo: jest.fn(),
    setMainVideo: jest.fn(),
    deleteVideo: jest.fn(),
  };

  const mockVideosConfig = {
    minioBaseUrl: 'http://localhost:9000/',
  };

  const mockFile = {
    path: '/tmp/mockUpload.mp4',
    mimetype: 'video/mp4',
    size: 12345,
  } as Express.Multer.File;

  beforeEach(async () => {
    jest.clearAllMocks();
    ffprobeImpl = (_path, cb) =>
      cb(null, {
        format: { duration: 10 },
        streams: [{ codec_type: 'video', width: 640, height: 480 }],
      });
    screenshotsImpl = (chain) => chain.end();
    mockMinioService.minio.putObject.mockResolvedValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        { provide: MinioService, useValue: mockMinioService },
        { provide: VideosRepositoryService, useValue: mockRepositoryService },
        { provide: VideosConfig.KEY, useValue: mockVideosConfig },
      ],
    }).compile();

    videosService = module.get<VideosService>(VideosService);
  });

  it('should be defined', () => {
    expect(videosService).toBeDefined();
  });

  describe('uploadFile', () => {
    it('uploads original + poster, creates the DB row, and returns the DTO', async () => {
      mockRepositoryService.createVideo.mockResolvedValue({
        id: 1,
        bucketName: VideoBucketName.Listings,
        objectKey: '123/video/original/mockUuid.mp4',
        posterObjectKey: '123/video/poster/mockUuid.webp',
        ratio: 640 / 480,
        blurhash: 'mockBlurhash',
        durationMs: 10000,
        main: false,
      });

      const result = await videosService.uploadFile(
        123,
        mockFile,
        VideoBucketName.Listings,
      );

      expect(mockMinioService.minio.putObject).toHaveBeenCalledTimes(2);
      expect(mockRepositoryService.createVideo).toHaveBeenCalledWith({
        placeId: 123,
        bucketName: VideoBucketName.Listings,
        mimeType: 'video/mp4',
        fileSize: 12345,
        durationMs: 10000,
        objectKey: '123/video/original/mockUuid.mp4',
        posterObjectKey: '123/video/poster/mockUuid.webp',
        ratio: 640 / 480,
        blurhash: 'mockBlurhash',
      });
      expect(result).toEqual({
        id: 1,
        uri: 'http://localhost:9000/listings/123/video/original/mockUuid.mp4',
        posterUri:
          'http://localhost:9000/listings/123/video/poster/mockUuid.webp',
        ratio: 640 / 480,
        blurhash: 'mockBlurhash',
        durationMs: 10000,
        isMain: false,
      });
      expect(fs.promises.unlink).toHaveBeenCalledWith(mockFile.path);
    });

    it('throws UnprocessableEntityException when ffprobe fails on a corrupt file', async () => {
      ffprobeImpl = (_path, cb) => cb(new Error('ffprobe failed'));

      await expect(
        videosService.uploadFile(123, mockFile, VideoBucketName.Listings),
      ).rejects.toThrow(UnprocessableEntityException);

      expect(mockMinioService.minio.putObject).not.toHaveBeenCalled();
      expect(fs.promises.unlink).toHaveBeenCalledWith(mockFile.path);
    });

    it('throws UnprocessableEntityException when duration exceeds the 90s limit', async () => {
      ffprobeImpl = (_path, cb) =>
        cb(null, {
          format: { duration: 90.001 },
          streams: [{ codec_type: 'video', width: 640, height: 480 }],
        });

      await expect(
        videosService.uploadFile(123, mockFile, VideoBucketName.Listings),
      ).rejects.toThrow(UnprocessableEntityException);

      expect(mockMinioService.minio.putObject).not.toHaveBeenCalled();
    });

    it('does not throw when duration is exactly at the 90s boundary', async () => {
      ffprobeImpl = (_path, cb) =>
        cb(null, {
          format: { duration: 90 },
          streams: [{ codec_type: 'video', width: 640, height: 480 }],
        });
      mockRepositoryService.createVideo.mockResolvedValue({
        id: 2,
        bucketName: VideoBucketName.Listings,
        objectKey: 'key',
        posterObjectKey: 'poster-key',
        ratio: 1,
        blurhash: 'mockBlurhash',
        durationMs: 90000,
        main: false,
      });

      await expect(
        videosService.uploadFile(123, mockFile, VideoBucketName.Listings),
      ).resolves.toBeDefined();
    });

    it('throws UnprocessableEntityException when poster extraction fails', async () => {
      screenshotsImpl = (chain) => chain.error(new Error('no visual stream'));

      await expect(
        videosService.uploadFile(123, mockFile, VideoBucketName.Listings),
      ).rejects.toThrow(UnprocessableEntityException);

      expect(mockMinioService.minio.putObject).not.toHaveBeenCalled();
      expect(fs.promises.unlink).toHaveBeenCalledWith(mockFile.path);
    });

    it('falls back to the poster image dimensions when ffprobe has no width/height', async () => {
      ffprobeImpl = (_path, cb) =>
        cb(null, { format: { duration: 10 }, streams: [] });
      mockRepositoryService.createVideo.mockImplementation(
        (data: { ratio: number | null; durationMs: number | null }) =>
          Promise.resolve({
            id: 3,
            bucketName: VideoBucketName.Listings,
            objectKey: 'key',
            posterObjectKey: 'poster-key',
            ratio: data.ratio,
            blurhash: 'mockBlurhash',
            durationMs: data.durationMs,
            main: false,
          }),
      );

      await videosService.uploadFile(123, mockFile, VideoBucketName.Listings);

      expect(mockRepositoryService.createVideo).toHaveBeenCalledWith(
        expect.objectContaining({ ratio: 800 / 450 }),
      );
    });

    it('still cleans up temp files when the MinIO upload fails', async () => {
      mockMinioService.minio.putObject.mockRejectedValueOnce(
        new Error('minio down'),
      );

      await expect(
        videosService.uploadFile(123, mockFile, VideoBucketName.Listings),
      ).rejects.toThrow('minio down');

      expect(fs.promises.unlink).toHaveBeenCalledWith(mockFile.path);
    });
  });

  describe('deleteVideo', () => {
    it('removes both MinIO objects and deletes the DB row', async () => {
      mockRepositoryService.getVideoById.mockResolvedValue({
        id: 1,
        bucketName: VideoBucketName.Listings,
        objectKey: '123/video/original/mockUuid.mp4',
        posterObjectKey: '123/video/poster/mockUuid.webp',
      });

      await videosService.deleteVideo(1);

      expect(mockMinioService.minio.removeObject).toHaveBeenCalledTimes(2);
      expect(mockMinioService.minio.removeObject).toHaveBeenCalledWith(
        VideoBucketName.Listings,
        '123/video/original/mockUuid.mp4',
      );
      expect(mockMinioService.minio.removeObject).toHaveBeenCalledWith(
        VideoBucketName.Listings,
        '123/video/poster/mockUuid.webp',
      );
      expect(mockRepositoryService.deleteVideo).toHaveBeenCalledWith(1);
    });

    it('only removes one object when there is no poster', async () => {
      mockRepositoryService.getVideoById.mockResolvedValue({
        id: 1,
        bucketName: VideoBucketName.Listings,
        objectKey: '123/video/original/mockUuid.mp4',
        posterObjectKey: null,
      });

      await videosService.deleteVideo(1);

      expect(mockMinioService.minio.removeObject).toHaveBeenCalledTimes(1);
      expect(mockRepositoryService.deleteVideo).toHaveBeenCalledWith(1);
    });

    it('no-ops silently when the video does not exist', async () => {
      mockRepositoryService.getVideoById.mockResolvedValue(undefined);

      await videosService.deleteVideo(999);

      expect(mockMinioService.minio.removeObject).not.toHaveBeenCalled();
      expect(mockRepositoryService.deleteVideo).not.toHaveBeenCalled();
    });
  });
});
